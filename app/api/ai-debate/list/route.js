// /api/ai-debate/list/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import {
  AI_DEBATE_ROOMS,
  AI_DEBATE_MESSAGES,
  USER_DETAILS,
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

    const userPlan = userInfo[0]?.plan || "starter";

    if (userPlan !== "elite") {
      return NextResponse.json(
        { error: "AI Debate feature is only available for Elite members." },
        { status: 403 }
      );
    }

    // Get user's debate rooms
    const debates = await db
      .select({
        id: AI_DEBATE_ROOMS.id,
        topic: AI_DEBATE_ROOMS.topic,
        user_position: AI_DEBATE_ROOMS.user_position,
        ai_position: AI_DEBATE_ROOMS.ai_position,
        status: AI_DEBATE_ROOMS.status,
        conversation_count: AI_DEBATE_ROOMS.conversation_count,
        max_conversations: AI_DEBATE_ROOMS.max_conversations,
        news_id: AI_DEBATE_ROOMS.news_id,
        created_at: AI_DEBATE_ROOMS.created_at,
        updated_at: AI_DEBATE_ROOMS.updated_at,
      })
      .from(AI_DEBATE_ROOMS)
      .where(eq(AI_DEBATE_ROOMS.user_id, userId))
      .orderBy(desc(AI_DEBATE_ROOMS.updated_at))
      .execute();

    // Get message count for each debate
    const debatesWithMessageCount = await Promise.all(
      debates.map(async (debate) => {
        const messageCount = await db
          .select({ count: count() })
          .from(AI_DEBATE_MESSAGES)
          .where(eq(AI_DEBATE_MESSAGES.debate_room_id, debate.id))
          .execute();

        return {
          ...debate,
          message_count: messageCount[0]?.count || 0,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        debates: debatesWithMessageCount,
        userPlan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching debate list:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch debate list",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
