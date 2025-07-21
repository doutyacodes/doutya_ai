// /api/ai-chat/create/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import { 
  AI_CHAT_ROOMS, 
  AI_CHAT_USAGE,
  AI_CHAT_TOPIC_OPTIONS,
  USER_DETAILS
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, and, gte, sql } from "drizzle-orm";

export async function POST(request) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const { topic, aiPersonalities } = await request.json();

  if (!topic?.trim() || !aiPersonalities?.length || aiPersonalities.length > 4) {
    return NextResponse.json(
      { error: "Invalid topic or AI personalities selection." },
      { status: 400 }
    );
  }

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

    // Check daily usage limits (Pro: 3 chats/day, Elite: 10 chats/day)
    const dailyLimit = userPlan === 'pro' ? 3 : 10;
    
    // Create proper date objects for comparison
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // Get today's usage - using date range comparison for timestamp fields
    let usage = await db
      .select()
      .from(AI_CHAT_USAGE)
      .where(and(
        eq(AI_CHAT_USAGE.user_id, userId),
        gte(AI_CHAT_USAGE.last_reset_date, todayStart),
        sql`${AI_CHAT_USAGE.last_reset_date} < ${todayEnd}`
      ))
      .limit(1)
      .execute();

    if (usage.length === 0) {
      // Create new usage record for today
      await db.insert(AI_CHAT_USAGE).values({
        user_id: userId,
        plan_type: userPlan,
        chats_created_today: 1, // Set to 1 since we're creating a chat now
        chats_created_this_month: 1,
        last_reset_date: now // Use Date object, not string
      });
    } else {
      // Check if user has reached daily limit
      if (usage[0].chats_created_today >= dailyLimit) {
        return NextResponse.json(
          { 
            error: `Daily limit reached. ${userPlan === 'pro' ? 'Pro' : 'Elite'} members can create ${dailyLimit} chats per day.` 
          },
          { status: 429 }
        );
      }

      // Update usage count
      await db
        .update(AI_CHAT_USAGE)
        .set({ 
          chats_created_today: usage[0].chats_created_today + 1,
          chats_created_this_month: (usage[0].chats_created_this_month || 0) + 1,
          last_reset_date: now // Update with current timestamp
        })
        .where(eq(AI_CHAT_USAGE.id, usage[0].id))
        .execute();
    }

    // For Pro members, validate topic is from predefined list
    if (userPlan === 'pro') {
      const validTopics = await db
        .select({ topic: AI_CHAT_TOPIC_OPTIONS.topic })
        .from(AI_CHAT_TOPIC_OPTIONS)
        .where(eq(AI_CHAT_TOPIC_OPTIONS.is_active, true))
        .execute();

      const isValidTopic = validTopics.some(t => t.topic === topic.trim());
      if (!isValidTopic) {
        return NextResponse.json(
          { error: "Pro members must select from predefined topics." },
          { status: 400 }
        );
      }
    }

    // Validate AI personalities exist
    const validAIIds = [1, 2, 3, 4]; // Based on our schema
    const invalidAIs = aiPersonalities.filter(id => !validAIIds.includes(id));
    if (invalidAIs.length > 0) {
      return NextResponse.json(
        { error: "Invalid AI personality selection." },
        { status: 400 }
      );
    }

    // Create chat room
    const chatRoomData = {
      user_id: userId,
      topic: topic.trim(),
      ai_personalities: JSON.stringify(aiPersonalities),
      status: 'active',
      conversation_count: 0,
      max_conversations: 5,
      is_custom_topic: userPlan === 'elite'
    };

    const insertResult = await db
      .insert(AI_CHAT_ROOMS)
      .values(chatRoomData)
      .execute();

    const chatRoomId = insertResult[0].insertId;

    return NextResponse.json(
      {
        success: true,
        chat: {
          id: chatRoomId,
          ...chatRoomData,
          ai_personalities: aiPersonalities,
          created_at: new Date(),
          message_count: 0
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating AI chat:", error);
    return NextResponse.json(
      { 
        error: "Failed to create chat room", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}