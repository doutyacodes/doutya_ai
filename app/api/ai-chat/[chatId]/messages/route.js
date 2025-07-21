// /api/ai-chat/[chatId]/messages/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import { 
  AI_CHAT_ROOMS, 
  AI_CHAT_MESSAGES
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
  const chatId = params.chatId;

  try {
    // Verify chat room ownership
    const chatRoom = await db
      .select()
      .from(AI_CHAT_ROOMS)
      .where(and(
        eq(AI_CHAT_ROOMS.id, chatId),
        eq(AI_CHAT_ROOMS.user_id, userId)
      ))
      .limit(1)
      .execute();

    if (chatRoom.length === 0) {
      return NextResponse.json(
        { error: "Chat room not found." },
        { status: 404 }
      );
    }

    // Get messages for this chat
    const messages = await db
      .select({
        id: AI_CHAT_MESSAGES.id,
        sender: AI_CHAT_MESSAGES.sender,
        content: AI_CHAT_MESSAGES.content,
        ai_personality_id: AI_CHAT_MESSAGES.ai_personality_id,
        conversation_turn: AI_CHAT_MESSAGES.conversation_turn,
        timestamp: AI_CHAT_MESSAGES.created_at
      })
      .from(AI_CHAT_MESSAGES)
      .where(eq(AI_CHAT_MESSAGES.chat_room_id, chatId))
      .orderBy(asc(AI_CHAT_MESSAGES.created_at))
      .execute();

    return NextResponse.json(
      {
        success: true,
        messages,
        chatRoom: {
          ...chatRoom[0],
          ai_personalities: JSON.parse(chatRoom[0].ai_personalities)
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch messages", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}
