
// /api/ai-chat/[chatId]/report/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import { 
  AI_CHAT_ROOMS, 
  AI_CHAT_REPORTS
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, and } from "drizzle-orm";

export async function GET(request, { params }) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const chatId = params.chatId;

  try {
    // Verify chat room ownership and completion
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

    if (chatRoom[0].status !== 'completed') {
      return NextResponse.json(
        { error: "Chat must be completed to view report." },
        { status: 400 }
      );
    }

    // Get chat report
    const report = await db
      .select({
        overall_analysis: AI_CHAT_REPORTS.overall_analysis,
        strengths: AI_CHAT_REPORTS.strengths,
        improvements: AI_CHAT_REPORTS.improvements,
        insights: AI_CHAT_REPORTS.insights,
        argument_quality_score: AI_CHAT_REPORTS.argument_quality_score,
        persuasiveness_score: AI_CHAT_REPORTS.persuasiveness_score,
        logical_consistency_score: AI_CHAT_REPORTS.logical_consistency_score,
        created_at: AI_CHAT_REPORTS.created_at
      })
      .from(AI_CHAT_REPORTS)
      .where(eq(AI_CHAT_REPORTS.chat_room_id, chatId))
      .limit(1)
      .execute();

    if (report.length === 0) {
      return NextResponse.json(
        { error: "Report not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        report: report[0],
        chatTopic: chatRoom[0].topic
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching chat report:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch report", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

