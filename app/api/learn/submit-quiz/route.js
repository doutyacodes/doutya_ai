import { NextResponse } from "next/server";
import { db } from "@/utils";
import { USER_PROGRESS, QUESTIONS, OPTIONS, USER_BADGES, BADGES } from "@/utils/schema"; // Include the USER_BADGES and BADGES schemas
import { authenticate } from "@/lib/jwtMiddleware";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response; // Return the response if authentication fails
    }

    const userId = authResult.decoded_Data.id;
    const { childId, answers } = await req.json(); // Expecting an array of answers in the request body

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: "No answers provided." }, { status: 400 });
    }

    // Initialize score calculation and result tracking
    let correctAnswersCount = 0;
    const results = [];

    for (const answer of answers) {
      const { questionId, selectedOptions } = answer;

      // Fetch correct options for the current question
      const correctOptions = await db
        .select()
        .from(OPTIONS)
        .where(eq(OPTIONS.question_id, questionId), eq(OPTIONS.is_answer, true))
        .execute();

      const correctOptionIds = correctOptions.map(option => option.id);

      // Check if user's selected options match the correct answers
      const isCorrect = selectedOptions.length === correctOptionIds.length &&
                        selectedOptions.every(selected => correctOptionIds.includes(selected));

      if (isCorrect) {
        correctAnswersCount++;
      }

      // Store the result for each question in the USER_PROGRESS table
      await db.insert(USER_PROGRESS).values({
        user_id: userId,
        child_id: childId,
        question_id: questionId,
        completed: true,
        score: isCorrect ? 1 : 0,
        created_at: new Date(),
      }).execute();

      results.push({ questionId, isCorrect });
    }

    // Calculate total score and percentage
    const totalQuestions = answers.length;
    const totalScore = correctAnswersCount;
    const percentageScore = (totalScore / totalQuestions) * 100;

    // Check if the badge exists for this quiz
    const badge = await db
      .select()
      .from(BADGES)
      .where(eq(BADGES.badge_type, 'quiz'), eq(BADGES.learn_topic_id, 1)) // Replace 1 with the appropriate learn_topic_id
      .execute();

    if (badge.length > 0 && percentageScore > 40) {
      // Insert into user_badges if the badge exists and score is above 40%
      await db.insert(USER_BADGES).values({
        child_id: childId,
        badge_id: badge[0].id, // Assuming the badge has an 'id' column
        earned_at: new Date(),
      }).execute();
    }

    return NextResponse.json({
      message: "Quiz submitted successfully.",
      score: totalScore,
      totalQuestions,
      results,
      percentageScore, // Optionally return the percentage score
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz." },
      { status: 500 }
    );
  }
}