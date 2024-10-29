// app/api/subtopics/route.js
import { NextResponse } from 'next/server';
import { SUBTOPICS, MODULES, COURSES } from '@/utils/schema'; // Ensure all relevant tables are imported
import { db } from '@/utils';
import { eq } from 'drizzle-orm';
import axios from 'axios'; // Import axios for HTTP requests

// Replace with your OpenAI API key and endpoint
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; 
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function fetchChatGPTResponse(prompt) {
  let chatGptResponse;
  try {
    chatGptResponse = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o-mini", // Specify the model you want to use
        messages: [{ role: "user", content: prompt }],
        max_tokens: 5000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (apiError) {
    console.error("API Request Error:", apiError.response ? apiError.response.data : apiError.message);
    throw new Error("Error with OpenAI API request");
  }

  const responseContent = chatGptResponse.data.choices?.[0]?.message?.content.trim();
  console.log("responseContent",responseContent)
  if (!responseContent) {
    throw new Error("No response content from OpenAI API.");
  }

  let parsedData;
  try {
    // Clean up response for parsing as JSON
    parsedData = JSON.parse(responseContent.replace(/```json|```/g, "").trim());
  } catch (jsonError) {
    console.error("JSON Parsing Error:", jsonError);
    throw new Error("Error parsing API response as JSON");
  }

  return parsedData;
}

export async function POST(req) {
  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ message: "Slug is required." }, { status: 400 });
    }

    // Fetch subtopic based on slug
    const subtopic = await db.select().from(SUBTOPICS).where(eq(SUBTOPICS.slug, slug));

    if (subtopic.length === 0) {
      return NextResponse.json({ message: "No subtopics found for this slug." }, { status: 404 });
    }

    const subtopicData = subtopic[0];

    // Fetch course and module details
    const moduleDetails = await db.select().from(MODULES).where(eq(MODULES.id, subtopicData.module_id));
    const courseDetails = await db.select().from(COURSES).where(eq(COURSES.id, moduleDetails[0]?.course_id));

    // Generate the prompt
    const prompt = `Generate a detailed and comprehensive JSON object for chapter on the topic of "${subtopicData.title}", written in "${courseDetails[0]?.language}" and tailored to a "${courseDetails[0]?.difficulty}" level for a reader around ${courseDetails[0]?.age} years old for the course "${courseDetails[0]?.name}" and the module "${moduleDetails[0]?.title}", making the tone age-appropriate and ${
      courseDetails[0]?.age <= 8
        ? "playful and fun, often using exclamations or questions"
        : courseDetails[0]?.age <= 12
        ? "encouraging and informative; can include humor or wit"
        : courseDetails[0]?.age <= 17
        ? "reflective and sometimes critical; may address real-world issues"
        : "serious, persuasive, or analytical, depending on the subject matter"
    }.

    The chapter should dynamically generate topics and subtopics relevant to "${subtopicData.title}", with each section and subsection tailored to provide a clear and engaging understanding of the subject. 

    Structure the chapter in JSON format with an "introduction," a "body" containing "sections" and dynamically generated "subtopics" based on the topic's depth, and a "conclusion" to summarize key points. 

    Each section should have a minimum of 1500 characters, and the entire chapter must reach at least 7500 characters. Adjust content in each section as needed to meet this requirement, ensuring the content remains informative and accessible.

    Example JSON Structure:
    {
      "language": "${courseDetails[0]?.language}",
      "difficulty": "${courseDetails[0]?.difficulty}",
      "age": ${courseDetails[0]?.age},
      "chapterContent": {
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
    }`;

    // Fetch response from ChatGPT
    const chapterContent = await fetchChatGPTResponse(prompt);

    // Optionally, you can insert the chapterContent into the database here
    // const courseInsert = await db.insert(COURSES).values({
    //   name: courseDetails[0]?.name,
    //   language: courseDetails[0]?.language,
    //   difficulty: courseDetails[0]?.difficulty,
    //   age: courseDetails[0]?.age,
    //   type: courseDetails[0]?.type,
    //   chapter_content: JSON.stringify(chapterContent),
    // });

    return NextResponse.json({
      subtopic: subtopicData,
      chapterContent, // Return the generated content
    });
  } catch (error) {
    console.error("Error fetching subtopics:", error);
    return NextResponse.json({ message: "Error fetching subtopics", error: error.message }, { status: 500 });
  }
}
