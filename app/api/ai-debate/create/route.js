// /api/ai-debate/create/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import axios from "axios";
import {
  AI_DEBATE_ROOMS,
  AI_DEBATE_USAGE,
  AI_DEBATE_MESSAGES,
  USER_DETAILS,
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, and, gte, sql } from "drizzle-orm";

async function generateOpeningStatement(topic, aiPosition, userPosition) {
  const prompt = `You are participating in a formal debate about: "${topic}"

Your position: ${aiPosition}
Opponent's position: ${userPosition}

As the AI debater taking the "${aiPosition}" stance, provide a strong opening statement (2-3 sentences) that:
1. Clearly states your position
2. Presents your strongest initial argument
3. Challenges the opposing view professionally
4. Sets an engaging tone for the debate

Keep it under 300 characters and be persuasive but respectful.`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating opening statement:", error);
    return `I strongly believe in the ${aiPosition} position on ${topic}. Let me present compelling evidence for why this perspective is correct.`;
  }
}

export async function POST(request) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const { topic, userPosition, aiPosition, newsId } = await request.json();

  if (!topic?.trim() || !userPosition?.trim() || !aiPosition?.trim()) {
    return NextResponse.json(
      { error: "Topic and both positions are required." },
      { status: 400 }
    );
  }

  try {
    // Check user plan - only Elite users can access debates
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

    // Check daily usage limits (Elite: 5 debates/day)
    const dailyLimit = 5;

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    let usage = await db
      .select()
      .from(AI_DEBATE_USAGE)
      .where(
        and(
          eq(AI_DEBATE_USAGE.user_id, userId),
          gte(AI_DEBATE_USAGE.last_reset_date, todayStart),
          sql`${AI_DEBATE_USAGE.last_reset_date} < ${todayEnd}`
        )
      )
      .limit(1)
      .execute();

    if (usage.length === 0) {
      await db.insert(AI_DEBATE_USAGE).values({
        user_id: userId,
        debates_created_today: 1,
        debates_created_this_month: 1,
        last_reset_date: now,
      });
    } else {
      if (usage[0].debates_created_today >= dailyLimit) {
        return NextResponse.json(
          {
            error: `Daily limit reached. Elite members can create ${dailyLimit} debates per day.`,
          },
          { status: 429 }
        );
      }

      await db
        .update(AI_DEBATE_USAGE)
        .set({
          debates_created_today: usage[0].debates_created_today + 1,
          debates_created_this_month:
            (usage[0].debates_created_this_month || 0) + 1,
          last_reset_date: now,
        })
        .where(eq(AI_DEBATE_USAGE.id, usage[0].id))
        .execute();
    }

    // Create debate room
    const debateRoomData = {
      user_id: userId,
      topic: topic.trim(),
      user_position: userPosition.trim(),
      ai_position: aiPosition.trim(),
      status: "active",
      conversation_count: 0,
      max_conversations: 7,
      news_id: newsId || null,
    };

    const insertResult = await db
      .insert(AI_DEBATE_ROOMS)
      .values(debateRoomData)
      .execute();

    const debateRoomId = insertResult[0].insertId;

    // Generate AI's opening statement
    const openingStatement = await generateOpeningStatement(
      topic,
      aiPosition,
      userPosition
    );

    // Save AI's opening message
    const aiOpeningMessage = {
      debate_room_id: debateRoomId,
      sender: "ai",
      content: openingStatement,
      character_count: openingStatement.length,
      conversation_turn: 0, // AI starts at turn 0
    };

    await db.insert(AI_DEBATE_MESSAGES).values(aiOpeningMessage).execute();

    return NextResponse.json(
      {
        success: true,
        debate: {
          id: debateRoomId,
          ...debateRoomData,
          created_at: new Date(),
          openingMessage: {
            ...aiOpeningMessage,
            id: "opening",
            created_at: new Date(),
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating AI debate:", error);
    return NextResponse.json(
      {
        error: "Failed to create debate room",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
