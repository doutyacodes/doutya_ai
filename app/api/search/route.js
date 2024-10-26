import { NextResponse } from "next/server";
import axios from "axios";
import { COURSES, KEYWORDS, COURSES_KEYWORDS } from "@/utils/schema";
import { db } from "@/utils";
import { eq } from "drizzle-orm"; // Ensure eq is imported


export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { courseName, language, difficulty } = await request.json();

    // Validate input
    if (!courseName || !language || !difficulty) {
      return NextResponse.json(
        { message: "All fields are required. " },
        { status: 400 }
      );
    }

    // Generate the prompt dynamically
    const prompt = generatePrompt(courseName, language, difficulty);

    // Call the ChatGPT API
    const chatGptResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
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

    // Extract and parse JSON content from the response
    let responseText = chatGptResponse.data.choices[0].message.content.trim();
    responseText = responseText.replace(/```json|```/g, "").trim();

    const parsedData = JSON.parse(responseText); // Parse JSON data
    const { chapterContent, keywords } = parsedData; // Destructure the JSON response

    // Insert course details (as JSON) into the database
    const courseInsert = await db.insert(COURSES).values({
      name: courseName,
      language,
      difficulty,
      chapter_content: JSON.stringify(chapterContent), // Store chapter content as JSON
    });

    const courseId = courseInsert[0].insertId;

    // Insert keywords and establish relationships
    for (const keyword of keywords) {
      const existingKeyword = await db
        .select({ id: KEYWORDS.id })
        .from(KEYWORDS)
        .where(eq(KEYWORDS.keyword, keyword));

      let keywordId;

      if (existingKeyword.length > 0) {
        keywordId = existingKeyword[0].id;
      } else {
        const keywordInsert = await db.insert(KEYWORDS).values({ keyword });
        keywordId = keywordInsert[0].insertId;
      }

      // Insert relationship into COURSES_KEYWORDS table
      await db.insert(COURSES_KEYWORDS).values({
        course_id: courseId,
        keyword_id: keywordId,
      });
    }

    // Return a success response
    const responseData = {
      message: "Course created successfully!",
      chapterContent,
      keywords,
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error in /api/search:", error);
    return NextResponse.json(
      { message: "Error processing your request", error: error.message },
      { status: 500 }
    );
  }
}

// Function to generate the prompt based on course details
function generatePrompt(courseName, language, difficulty) {
  return `
    Generate a JSON object for a course chapter on the topic of '${courseName}', written in ${language} at a ${difficulty} level of difficulty.
    The JSON object should include the following structure:
    { 
    "courseName":${courseName},
    "language":${language},
    "difficulty":${difficulty},
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
