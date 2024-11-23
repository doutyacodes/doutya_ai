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
    // Fetch the specific news and associated questions
    const newsWithQuestions = await db
      .select({
        news: NEWS,
        questions: NEWS_QUESTIONS.questions,
      })
      .from(NEWS)
      .leftJoin(NEWS_QUESTIONS, eq(NEWS.id, NEWS_QUESTIONS.news_id))
      .where(eq(NEWS.id, id))
      .execute();

    if (newsWithQuestions.length === 0) {
      return NextResponse.json(
        { error: "News not found." },
        { status: 404 }
      );
    }

    // Fetch all words_meanings
    const allMeanings = await db
      .select({
        word: WORDS_MEANINGS.word,
        description: WORDS_MEANINGS.description,
      })
      .from(WORDS_MEANINGS)
      .execute();

    // Format the response to include news, questions, and all meanings
    const formattedResponse = {
      ...newsWithQuestions[0].news,
      questions: newsWithQuestions
        .map((item) => item.questions)
        .filter(Boolean), // Extract questions
      meanings: allMeanings, // Include all word meanings
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
