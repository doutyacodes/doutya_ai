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
    Generate a JSON object for a course chapter on the topic of "${courseName}", written in "${language}" at a "${difficulty}" level of difficulty.
    The JSON object should include the following structure:
    { 
      "courseName": "${courseName}",
      "language": "${language}",
      "difficulty": "${difficulty}",
      "chapterContent": {
        "overview": "A brief introduction highlighting the significance of the topic.",
        "key_concepts": "Essential ideas and principles relevant to the topic.",
        "detailed_concepts": "Detailed breakdown of the topic in subtopics, from simpler to complex.",
        "practical_applications": "Examples or case studies illustrating the concepts.",
        "conclusion": "Summary of main points and further study suggestions.",
        "references_and_resources": "List of recommended readings or resources."
      },
      "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8", "keyword9", "keyword10"]
    }
  `;
}
