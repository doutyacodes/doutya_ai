import { NextResponse } from "next/server";
import axios from "axios";
import { COURSES } from "@/utils/schema";
import { db } from "@/utils";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { courseName, language, difficulty, age } = await request.json();

    // Input validation
    if (![courseName, language, difficulty, age].every(field => field?.toString().trim())) {
      return NextResponse.json(
        { message: "All fields are required and must not be empty." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { message: "API Key is missing in environment variables." },
        { status: 500 }
      );
    }

    const prompt = generatePrompt(courseName, language, difficulty, age);

    // Making API request to OpenAI
    let chatGptResponse;
    try {
      chatGptResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini", 
          messages: [{ role: "user", content: prompt }],
          max_tokens: 5000,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (apiError) {
      console.error("API Request Error:", apiError.response ? apiError.response.data : apiError.message);
      return NextResponse.json(
        { message: "Error with OpenAI API request", error: apiError.message },
        { status: 500 }
      );
    }

    const responseContent = chatGptResponse.data.choices?.[0]?.message?.content.trim();
    if (!responseContent) {
      return NextResponse.json(
        { message: "No response content from OpenAI API." },
        { status: 500 }
      );
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseContent.replace(/```json|```/g, "").trim());
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError);
      console.error("Partial JSON Response:", responseContent.slice(0, 500));
      return NextResponse.json(
        { message: "Error parsing API response as JSON", error: jsonError.message },
        { status: 500 }
      );
    }

    // Insert course into the database
    let courseId;
    try {
      const courseInsert = await db.insert(COURSES).values({
        name: courseName,
        language,
        difficulty,
        age,
        chapter_content: JSON.stringify(parsedData),
      });
      courseId = courseInsert[0].insertId;
      if (!courseId) throw new Error("Course insertion did not return an insertId");
    } catch (dbError) {
      console.error("Database Insertion Error:", dbError);
      return NextResponse.json(
        { message: "Error inserting course into database", error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Course created successfully!", content: parsedData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in /api/search:", error);
    return NextResponse.json(
      { message: "Error processing your request", error: error.message },
      { status: 500 }
    );
  }
}

function generatePrompt(courseName, language, difficulty, age) {
  return `
    Generate a detailed and comprehensive JSON object for an essay on the topic of "${courseName}," written in "${language}" and tailored to a "${difficulty}" level for a reader around ${age} years old, making the tone age-appropriate and ${age <= 8 ? "Playful and fun, often using exclamations or questions" : age <= 12 ? "Encouraging and informative; can include humor or wit": age <= 17 ? " Reflective and sometimes critical; may address real-world issues": "Serious, persuasive, or analytical, depending on the subject matter"}.
    The essay should dynamically generate topics and subtopics relevant to "${courseName}", with each section and subsection tailored to provide a clear and engaging understanding of the subject. 
    Structure the essay in JSON format with an "introduction," a "body" containing "sections" and dynamically generated "subtopics" based on the topic's depth, and a "conclusion" to summarize key points. 
    Each section should have a minimum of 1500 characters, and the entire essay must reach at least 7500 characters. Adjust content in each section as needed to meet this requirement, ensuring the content remains informative and accessible.
    
    JSON Structure Example:
    {
      "courseName": "${courseName}",
      "language": "${language}",
      "difficulty": "${difficulty}",
      "age": ${age},
      "essayContent": {
        "introduction": {
          "content": "A brief, age-appropriate introduction to the topic."
        },
        "body": {
          "sections": [
            {
              "title": "Dynamic Section Title",
              "content": "Content for the section, meeting character and age-appropriateness requirements.",
              "subtopics": [
                {
                  "title": "Dynamic Subtopic Title",
                  "content": "Detailed content for the subtopic, focusing on specific aspects with examples for easier understanding."
                }
              ]
            }
          ]
        },
        "conclusion": {
          "content": "A concise summary of the main points covered in the essay."
        }
      }
    }
  `;
}
