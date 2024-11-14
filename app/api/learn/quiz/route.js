// app/api/quiz-section/route.js
import { NextResponse } from "next/server";
import { db } from "@/utils";
import { LEARN_TOPICS, QUESTIONS, USER_PROGRESS, OPTIONS2 } from "@/utils/schema"; // Ensure the relevant schemas are imported
import { authenticate } from "@/lib/jwtMiddleware";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response; // Return the response if authentication fails
    }

    const userId = authResult.decoded_Data.id;
    const { slug, childId } = await req.json(); // Assume slug is passed as a query parameter

    if (!slug) {
      return NextResponse.json({ error: "slug is required." }, { status: 400 });
    }
    
    // Fetch the topic associated with the slug
    const topic = await db
      .select()
      .from(LEARN_TOPICS)
      .where(eq(LEARN_TOPICS.slug, slug))
      .execute();

    // Check if the topic was found
    if (topic.length === 0) {
      return NextResponse.json(
        { error: "No topic found for the given slug." },
        { status: 404 }
      );
    }

    const topicId = topic[0].id;

    // Fetch questions associated with the topic
    const questions = await db
      .select()
      .from(QUESTIONS)
      .where(eq(QUESTIONS.learn_topic_id, topicId))
      .execute();

      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await db
            .select()
            .from(OPTIONS2)
            .where(eq(OPTIONS2.question_id, question.id))
            .execute();
  
          return {
            ...question,
            options,
          };
        })
      );

    // Check user progress on this quiz
    const userProgress = await db
      .select()
      .from(USER_PROGRESS)
      .where(eq(USER_PROGRESS.child_id, childId))
      .execute();

    const completed = userProgress.length > 0;

    return NextResponse.json({
      completed,
      questions: questionsWithOptions,
    });
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz data." },
      { status: 500 }
    );
  }
}
