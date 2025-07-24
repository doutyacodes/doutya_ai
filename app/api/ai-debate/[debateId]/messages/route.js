// /api/ai-debate/[debateId]/messages/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import { 
  AI_DEBATE_ROOMS, 
  AI_DEBATE_MESSAGES, 
  AI_DEBATE_QUESTIONS,
  AI_DEBATE_MCQ_OPTIONS,
  AI_DEBATE_MCQ_RESPONSES 
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, and, asc } from "drizzle-orm";

export async function GET(request, { params }) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const debateId = params.debateId;

  try {
    // Verify debate room ownership
    const debateRoom = await db
      .select()
      .from(AI_DEBATE_ROOMS)
      .where(
        and(
          eq(AI_DEBATE_ROOMS.id, debateId),
          eq(AI_DEBATE_ROOMS.user_id, userId)
        )
      )
      .limit(1)
      .execute();

    if (debateRoom.length === 0) {
      return NextResponse.json(
        { error: "Debate room not found." },
        { status: 404 }
      );
    }

    const room = debateRoom[0];

    let responseData = {
      success: true,
      debateRoom: room,
    };

    // Handle different debate types
    if (room.debate_type === "mcq") {
      // Get MCQ questions and user responses
      const questions = await db
        .select()
        .from(AI_DEBATE_QUESTIONS)
        .where(eq(AI_DEBATE_QUESTIONS.debate_room_id, debateId))
        .orderBy(asc(AI_DEBATE_QUESTIONS.question_index))
        .execute();

      // Get options for each question
      for (let question of questions) {
        const options = await db
          .select()
          .from(AI_DEBATE_MCQ_OPTIONS)
          .where(eq(AI_DEBATE_MCQ_OPTIONS.question_id, question.id))
          .execute();
        question.options = options;
      }

      // Get user responses
      const responses = await db
        .select()
        .from(AI_DEBATE_MCQ_RESPONSES)
        .where(eq(AI_DEBATE_MCQ_RESPONSES.debate_room_id, debateId))
        .execute();

      responseData.questions = questions;
      responseData.responses = responses;
      responseData.currentQuestion = room.current_question_index < questions.length 
        ? questions[room.current_question_index] 
        : null;
    } else {
      // Get messages for debate types (user_vs_ai, ai_vs_ai)
      const whereClause = room.debate_type === "ai_vs_ai" 
        ? and(
            eq(AI_DEBATE_MESSAGES.debate_room_id, debateId),
            eq(AI_DEBATE_MESSAGES.is_visible, true)
          )
        : eq(AI_DEBATE_MESSAGES.debate_room_id, debateId);

      const messages = await db
        .select({
          id: AI_DEBATE_MESSAGES.id,
          sender: AI_DEBATE_MESSAGES.sender,
          content: AI_DEBATE_MESSAGES.content,
          conversation_turn: AI_DEBATE_MESSAGES.conversation_turn,
          is_visible: AI_DEBATE_MESSAGES.is_visible,
          created_at: AI_DEBATE_MESSAGES.created_at,
        })
        .from(AI_DEBATE_MESSAGES)
        .where(whereClause)
        .orderBy(asc(AI_DEBATE_MESSAGES.created_at))
        .execute();

      responseData.messages = messages;
      
      // For AI vs AI, also get total available messages count
      if (room.debate_type === "ai_vs_ai") {
        const totalMessages = await db
          .select()
          .from(AI_DEBATE_MESSAGES)
          .where(eq(AI_DEBATE_MESSAGES.debate_room_id, debateId))
          .execute();
        
        responseData.totalConversations = Math.floor(totalMessages.length / 2);
        responseData.visibleConversations = Math.floor(messages.length / 2);
      }
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error fetching debate data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch debate data",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}