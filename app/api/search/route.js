import { NextResponse } from "next/server";
import axios from "axios";
import { COURSES, KEYWORDS, COURSES_KEYWORDS } from "@/utils/schema";
import { db } from "@/utils";
import { eq } from "drizzle-orm";

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { courseName, language, difficulty } = await request.json();

    if (!courseName?.trim() || !language?.trim() || !difficulty?.trim()) {
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

    const prompt = generatePrompt(courseName, language, difficulty);

    let chatGptResponse;
    try {
        chatGptResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: prompt }],
              max_tokens: 6250,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
              timeout: 10000 // Timeout in milliseconds (10 seconds)
            }
          );
          
    } catch (apiError) {
      console.error("API Request Error:", apiError);
      return NextResponse.json(
        { message: "Error with OpenAI API request", error: apiError.message },
        { status: 500 }
      );
    }

    let responseText = chatGptResponse.data.choices[0].message.content.trim();
    responseText = responseText.replace(/```json|```/g, "").trim();

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError);
      return NextResponse.json(
        { message: "Error parsing API response as JSON", error: jsonError.message },
        { status: 500 }
      );
    }

    const { chapterContent, keywords } = parsedData;

    let courseId;
    try {
      const courseInsert = await db.insert(COURSES).values({
        name: courseName,
        language,
        difficulty,
        chapter_content: JSON.stringify(chapterContent),
      });
      courseId = courseInsert[0].insertId;
    } catch (dbError) {
      console.error("Database Insertion Error:", dbError);
      return NextResponse.json(
        { message: "Error inserting course into database", error: dbError.message },
        { status: 500 }
      );
    }

    const keywordIds = [];
    for (const keyword of new Set(keywords)) {
      let keywordId;
      try {
        const existingKeyword = await db
          .select({ id: KEYWORDS.id })
          .from(KEYWORDS)
          .where(eq(KEYWORDS.keyword, keyword));

        if (existingKeyword.length > 0) {
          keywordId = existingKeyword[0].id;
        } else {
          const keywordInsert = await db.insert(KEYWORDS).values({ keyword });
          keywordId = keywordInsert[0].insertId;
        }

        keywordIds.push(keywordId);
      } catch (dbKeywordError) {
        console.error("Keyword Insertion Error:", dbKeywordError);
        return NextResponse.json(
          { message: "Error inserting keywords", error: dbKeywordError.message },
          { status: 500 }
        );
      }
    }

    try {
      await db.insert(COURSES_KEYWORDS).values(
        keywordIds.map(keywordId => ({ course_id: courseId, keyword_id: keywordId }))
      );
    } catch (dbKeywordRelError) {
      console.error("Keyword-Course Relationship Insertion Error:", dbKeywordRelError);
      return NextResponse.json(
        { message: "Error creating keyword relationships", error: dbKeywordRelError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Course created successfully!",
      parsedData,
      keywords,
    }, { status: 201 });
  } catch (error) {
    console.error("Error in /api/search:", error);
    return NextResponse.json(
      { message: "Error processing your request", error: error.message },
      { status: 500 }
    );
  }
}

function generatePrompt(courseName, language, difficulty) {
    return `
      Generate a detailed and comprehensive chapter on the topic of "${courseName}," written in "${language}" and tailored to a "${difficulty}" level. 
      The JSON object should contain a chapter structured with multiple sections that reflect the scope, relevance, and complexity of the topic. Each section must have dynamically generated subheadings based on the depth and nuances of the topic, arranged in a readable and logical order.
      The JSON structure should include:
      { 
        "courseName": "${courseName}",
        "language": "${language}",
        "difficulty": "${difficulty}",
        "chapterContent": {
          "introduction": {
            "summary": "An introduction providing a brief overview and significance of the topic.",
            "historical_background": "Optional background information to give context on the topic's development."
          },
          "main_sections": [
            {
              "section_title": "Primary Section Title",
              "content": "Comprehensive content covering this section, with relevant explanations and examples.",
              "subtopics": [
                {
                  "title": "Dynamic Subtopic Title",
                  "description": "Detailed content for the subtopic, addressing specific aspects or examples.",
                  "examples": ["Example 1", "Example 2"]
                }
              ]
            }
          ],
          "practical_applications": [
            {
              "application_title": "Application Section Title",
              "description": "Real-world applications of the topic, including examples and case studies."
            }
          ],
          "conclusion": {
            "summary": "Concise summary of the main points covered in the chapter.",
            "further_study": "Suggestions for further reading or exploration of the topic."
          },
          "references_and_resources": [
            "Reference 1",
            "Reference 2",
            "Reference 3"
          ]
        },
        "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8", "keyword9", "keyword10"]
      }
      Ensure that the chapter reaches a minimum of 6,000 characters, with well-researched, informative content that provides a thorough understanding of the subject. Do not proceed if the character count cannot be guaranteed.
    `;
  }
  
