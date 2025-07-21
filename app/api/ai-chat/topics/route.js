// /api/ai-chat/topics/route.js - Get predefined topics for Pro members
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import { AI_CHAT_TOPIC_OPTIONS } from "@/utils/schema";
import { db } from "@/utils";
import { eq } from "drizzle-orm";

export async function GET(request) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  try {
    const topics = await db
      .select({
        id: AI_CHAT_TOPIC_OPTIONS.id,
        topic: AI_CHAT_TOPIC_OPTIONS.topic,
        category: AI_CHAT_TOPIC_OPTIONS.category,
        difficulty_level: AI_CHAT_TOPIC_OPTIONS.difficulty_level
      })
      .from(AI_CHAT_TOPIC_OPTIONS)
      .where(eq(AI_CHAT_TOPIC_OPTIONS.is_active, true))
      .execute();

    return NextResponse.json(
      {
        success: true,
        topics
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch topics", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}