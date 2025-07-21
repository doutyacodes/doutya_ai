// /api/ai-chat/list/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import { 
  AI_CHAT_ROOMS, 
  AI_CHAT_MESSAGES,
  USER_DETAILS
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, desc, count } from "drizzle-orm";

export async function GET(request) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;

  try {
    // Check user plan
    const userInfo = await db
      .select({ plan: USER_DETAILS.plan })
      .from(USER_DETAILS)
      .where(eq(USER_DETAILS.id, userId))
      .limit(1)
      .execute();

    const userPlan = userInfo[0]?.plan || 'starter';

    if (userPlan === 'starter') {
      return NextResponse.json(
        { error: "AI Chat feature is only available for Pro and Elite members." },
        { status: 403 }
      );
    }

    // Get user's chat rooms with message count
    const chats = await db
      .select({
        id: AI_CHAT_ROOMS.id,
        topic: AI_CHAT_ROOMS.topic,
        ai_personalities: AI_CHAT_ROOMS.ai_personalities,
        status: AI_CHAT_ROOMS.status,
        conversation_count: AI_CHAT_ROOMS.conversation_count,
        max_conversations: AI_CHAT_ROOMS.max_conversations,
        is_custom_topic: AI_CHAT_ROOMS.is_custom_topic,
        created_at: AI_CHAT_ROOMS.created_at,
        updated_at: AI_CHAT_ROOMS.updated_at
      })
      .from(AI_CHAT_ROOMS)
      .where(eq(AI_CHAT_ROOMS.user_id, userId))
      .orderBy(desc(AI_CHAT_ROOMS.updated_at))
      .execute();

    // Get message count for each chat
    const chatsWithMessageCount = await Promise.all(
      chats.map(async (chat) => {
        const messageCount = await db
          .select({ count: count() })
          .from(AI_CHAT_MESSAGES)
          .where(eq(AI_CHAT_MESSAGES.chat_room_id, chat.id))
          .execute();

        return {
          ...chat,
          ai_personalities: JSON.parse(chat.ai_personalities),
          message_count: messageCount[0]?.count || 0
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        chats: chatsWithMessageCount,
        userPlan
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching chat list:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch chat list", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

