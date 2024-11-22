import { NextResponse } from "next/server";
import { db } from "@/utils";
import { CHALLENGE_USER_QUIZ, CHALLENGE_PROGRESS } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { authenticate } from "@/lib/jwtMiddleware";

export async function POST(req) {
  try {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const userId = authResult.decoded_Data.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const { challengeId, questionId, optionId, childId, isCompleted, isFirstQuestion } =
      await req.json();

    if (
      !challengeId ||
      !questionId ||
      !optionId ||
      !childId ||
      typeof isCompleted !== "boolean" ||
      typeof isFirstQuestion !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Invalid data. All fields are required." },
        { status: 400 }
      );
    }

    // Insert or update answer
    await db.insert(CHALLENGE_USER_QUIZ).values({
      challenge_id: challengeId,
      question_id: questionId,
      option_id: optionId,
      child_id: childId,
      user_id: userId,
    });

    // If it's the first question, insert a record in CHALLENGE_PROGRESS with is_started: true
    if (isFirstQuestion) {
      const existingProgress = await db
        .select()
        .from(CHALLENGE_PROGRESS)
        .where(
          and(
            eq(CHALLENGE_PROGRESS.challenge_id, challengeId),
            eq(CHALLENGE_PROGRESS.child_id, childId),
            eq(CHALLENGE_PROGRESS.user_id, userId)
          )
        )
        .limit(1);

      if (existingProgress.length === 0) {
        await db.insert(CHALLENGE_PROGRESS).values({
          challenge_id: challengeId,
          child_id: childId,
          user_id: userId,
          is_started: true,
          is_completed: false,
        });
      }
    }

    // Update challenge progress if completed
    if (isCompleted) {
      await db
        .update(CHALLENGE_PROGRESS)
        .set({ is_completed: true })
        .where(
          and(
            eq(CHALLENGE_PROGRESS.challenge_id, challengeId),
            eq(CHALLENGE_PROGRESS.child_id, childId),
            eq(CHALLENGE_PROGRESS.user_id, userId)
          )
        );
    }

    return NextResponse.json({ success: true, message: "Answer submitted successfully." });
  } catch (error) {
    console.error("Error submitting quiz answer:", error);
    return NextResponse.json(
      { error: "Failed to submit the answer. Please try again." },
      { status: 500 }
    );
  }
}
