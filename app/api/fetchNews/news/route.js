import { NextResponse } from "next/server";
import { db } from "@/utils";
import { NEWS, NEWS_QUESTIONS, WORDS_MEANINGS } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const { id } = await req.json(); // Extract 'id' from the request body

  if (!id) {
    return NextResponse.json(
      { error: "News ID is required." },
      { status: 400 }
    );
  }

  try {
    // Fetch the specific news, associated questions, and word meanings based on the provided id
    const newsWithDetails = await db
      .select({
        news: NEWS,
        questions: NEWS_QUESTIONS.questions,
        meanings: WORDS_MEANINGS.description,
        word: WORDS_MEANINGS.word,
      })
      .from(NEWS)
      .leftJoin(NEWS_QUESTIONS, eq(NEWS.id, NEWS_QUESTIONS.news_id))
      .leftJoin(WORDS_MEANINGS, eq(NEWS.id, WORDS_MEANINGS.news_id)) // Join with words_meanings table
      .where(eq(NEWS.id, id))
      .execute();

    if (newsWithDetails.length === 0) {
      return NextResponse.json(
        { error: "News not found." },
        { status: 404 }
      );
    }

    // Format the response to include news, questions, and meanings
    const formattedResponse = {
      ...newsWithDetails[0].news,
      questions: newsWithDetails
        .map((item) => item.questions)
        .filter(Boolean), // Extract questions
      meanings: newsWithDetails
        .map((item) => item.meanings && { word: item.word, description: item.meanings })
        .filter(Boolean), // Extract meanings with the word
    };

    return NextResponse.json(formattedResponse); // Return the formatted response
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch news." },
      { status: 500 }
    );
  }
}
