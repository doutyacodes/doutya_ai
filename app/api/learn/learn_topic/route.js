import { NextResponse } from "next/server";
import { db } from "@/utils";
import {
  CHILDREN,
  LEARN_DATA,
  LEARN_TOPICS,
  QUESTIONS,
  USER_LEARN_PROGRESS,
} from "@/utils/schema"; // Ensure the relevant schemas are imported
import { and, eq } from "drizzle-orm";
import { authenticate } from "@/lib/jwtMiddleware";

export async function POST(req) {
  try {
    const authResult = await authenticate(req, true);
    if (!authResult.authenticated) {
      return authResult.response; // Return the response if authentication fails
    }

    const userId = authResult.decoded_Data.id;
    const { slug, childId = null } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "slug is required." }, { status: 400 });
    }

    // Fetch the learn topic ID associated with the provided slug
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
    
    const topicId = topic[0].id; // Get the ID of the topic

    // Count the number of quizzes (questions) associated with the retrieved topic_id
    const quiz = await db
      .select()
      .from(QUESTIONS)
      .where(eq(QUESTIONS.learn_topic_id, topicId))
      .execute();
    const quizCountResult = quiz.length;
    const quizCount = quizCountResult || 0;

    let userProgressCountResult = 0;

    let finalChildId = childId;

    if (!childId && userId) {
      const firstChild = await db
        .select()
        .from(CHILDREN)
        .where(eq(CHILDREN.user_id, userId))
        .limit(1)
        .execute();

      if (firstChild.length > 0) {
        finalChildId = firstChild[0].id; // Assuming 'id' is the identifier for CHILDREN
      } else {
        return NextResponse.json(
          { error: "No children found for the user." },
          { status: 404 }
        );
      }
    }
    
    if (userId && finalChildId) {
      // Count the number of user progress entries associated with the retrieved topic_id
      const userProgress = await db
        .select()
        .from(USER_LEARN_PROGRESS)
        .where(
          and(
            eq(USER_LEARN_PROGRESS.learn_topic_id, topicId),
            eq(USER_LEARN_PROGRESS.child_id, finalChildId)
          )
        ) // Assuming you want to count progress on the questions for this topic
        .execute();
      userProgressCountResult = userProgress.length;
    }

    const userProgressCount = userProgressCountResult || 0;

    // Determine the completion status
    let status;
    if (userProgressCount == 0) {
      status = "incomplete";
    } else if (quizCount === userProgressCount) {
      status = "completed";
    } else if (quizCount > userProgressCount) {
      status = "continue";
    } else {
      status = "unknown"; // Handle unexpected cases, if necessary
    }
    const learnData = await db
      .select()
      .from(LEARN_DATA)
      .where(eq(LEARN_DATA.learn_topic_id, topicId))
      .execute();

    return NextResponse.json({
      quizCount,
      userProgressCount,
      status,
      topic,
      learnData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data." },
      { status: 500 }
    );
  }
}
