// /api/ai-debate/[debateId]/report/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import { AI_DEBATE_ROOMS, AI_DEBATE_REPORTS } from "@/utils/schema";
import { db } from "@/utils";
import { eq, and } from "drizzle-orm";

export async function GET(request, { params }) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const debateId = params.debateId;

  try {
    // Verify debate room ownership and completion
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

    if (debateRoom[0].status !== "completed") {
      return NextResponse.json(
        { error: "Debate must be completed to view report." },
        { status: 400 }
      );
    }

    // Get debate report
    const reportColumns = {
      overall_analysis: AI_DEBATE_REPORTS.overall_analysis,
      strengths: AI_DEBATE_REPORTS.strengths,
      improvements: AI_DEBATE_REPORTS.improvements,
      insights: AI_DEBATE_REPORTS.insights,
      argument_quality_score: AI_DEBATE_REPORTS.argument_quality_score,
      persuasiveness_score: AI_DEBATE_REPORTS.persuasiveness_score,
      factual_accuracy_score: AI_DEBATE_REPORTS.factual_accuracy_score,
      logical_consistency_score: AI_DEBATE_REPORTS.logical_consistency_score,
      winner: AI_DEBATE_REPORTS.winner,
      debate_type: AI_DEBATE_REPORTS.debate_type,
      created_at: AI_DEBATE_REPORTS.created_at,
    };

    // Add MCQ-specific fields if applicable
    if (debateRoom[0].debate_type === "mcq") {
      reportColumns.mcq_score = AI_DEBATE_REPORTS.mcq_score;
      reportColumns.knowledge_depth_score = AI_DEBATE_REPORTS.knowledge_depth_score;
    }

    const report = await db
      .select(reportColumns)
      .from(AI_DEBATE_REPORTS)
      .where(eq(AI_DEBATE_REPORTS.debate_room_id, debateId))
      .limit(1)
      .execute();

    if (report.length === 0) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    const reportData = report[0];

    // Format response based on debate type
    let formattedReport = {
      ...reportData,
    };

    // Add type-specific formatting
    if (reportData.debate_type === "mcq") {
      formattedReport.total_questions = debateRoom[0].total_questions;
      formattedReport.score_percentage = reportData.mcq_score 
        ? Math.round((reportData.mcq_score / debateRoom[0].total_questions) * 100)
        : 0;
    }

    return NextResponse.json(
      {
        success: true,
        report: formattedReport,
        debateRoom: {
          id: debateRoom[0].id,
          topic: debateRoom[0].topic,
          debate_type: debateRoom[0].debate_type,
          user_position: debateRoom[0].user_position,
          ai_position: debateRoom[0].ai_position,
          ai_position_2: debateRoom[0].ai_position_2,
          conversation_count: debateRoom[0].conversation_count,
          max_conversations: debateRoom[0].max_conversations,
          total_questions: debateRoom[0].total_questions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching debate report:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch report",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}