// /api/ai-debate/[debateId]/messages/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import { AI_DEBATE_ROOMS, AI_DEBATE_MESSAGES } from "@/utils/schema";
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

    // Get messages for this debate
    const messages = await db
      .select({
        id: AI_DEBATE_MESSAGES.id,
        sender: AI_DEBATE_MESSAGES.sender,
        content: AI_DEBATE_MESSAGES.content,
        character_count: AI_DEBATE_MESSAGES.character_count,
        conversation_turn: AI_DEBATE_MESSAGES.conversation_turn,
        created_at: AI_DEBATE_MESSAGES.created_at,
      })
      .from(AI_DEBATE_MESSAGES)
      .where(eq(AI_DEBATE_MESSAGES.debate_room_id, debateId))
      .orderBy(asc(AI_DEBATE_MESSAGES.created_at))
      .execute();

    return NextResponse.json(
      {
        success: true,
        messages,
        debateRoom: debateRoom[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching debate messages:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch messages",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
