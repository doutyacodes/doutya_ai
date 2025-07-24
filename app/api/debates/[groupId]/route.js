// /api/debates/[groupId]/route.js - Updated to include position titles
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import {
  ADULT_NEWS_GROUP,
  ADULT_NEWS,
  DEBATE_TOPICS,
  DEBATE_POSITIONS,
  AI_CONVERSATIONS,
  MC_DEBATE_RESPONSES,
  USER_DETAILS,
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, count } from "drizzle-orm";

export async function GET(request, { params }) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  
  // Await params before accessing groupId
  const { groupId } = await params;

  try {
    // Get user plan
    const userInfo = await db
      .select({ plan: USER_DETAILS.plan })
      .from(USER_DETAILS)
      .where(eq(USER_DETAILS.id, userId))
      .limit(1)
      .execute();

    const userPlan = userInfo[0]?.plan || "starter";

    // Get news group details
    const newsGroup = await db
      .select()
      .from(ADULT_NEWS_GROUP)
      .where(eq(ADULT_NEWS_GROUP.id, parseInt(groupId)))
      .limit(1)
      .execute();

    if (newsGroup.length === 0) {
      return NextResponse.json(
        { success: false, error: "News group not found" },
        { status: 404 }
      );
    }

    // Get all news articles in this group
    const newsArticles = await db
      .select({
        id: ADULT_NEWS.id,
        title: ADULT_NEWS.title,
        image_url: ADULT_NEWS.image_url,
        summary: ADULT_NEWS.summary,
        description: ADULT_NEWS.description,
        viewpoint: ADULT_NEWS.viewpoint,
        created_at: ADULT_NEWS.created_at,
        show_date: ADULT_NEWS.show_date,
        media_type: ADULT_NEWS.media_type,
      })
      .from(ADULT_NEWS)
      .where(eq(ADULT_NEWS.news_group_id, parseInt(groupId)))
      .execute();

    if (newsArticles.length === 0) {
      return NextResponse.json(
        { success: false, error: "No news articles found in this group" },
        { status: 404 }
      );
    }

    // Check what debate topics and positions are available for this group
    const debateTopics = await db
      .select({
        id: DEBATE_TOPICS.id,
        topic_title: DEBATE_TOPICS.topic_title,
        topic_description: DEBATE_TOPICS.topic_description,
      })
      .from(DEBATE_TOPICS)
      .where(eq(DEBATE_TOPICS.news_group_id, parseInt(groupId)))
      .execute();

    const hasDebateTopics = debateTopics.length > 0;
    let debatePositions = [];

    // Get debate positions if topics exist
    if (hasDebateTopics) {
      debatePositions = await db
        .select({
          id: DEBATE_POSITIONS.id,
          debate_topic_id: DEBATE_POSITIONS.debate_topic_id,
          position_type: DEBATE_POSITIONS.position_type,
          position_title: DEBATE_POSITIONS.position_title,
          ai_persona: DEBATE_POSITIONS.ai_persona,
        })
        .from(DEBATE_POSITIONS)
        .where(eq(DEBATE_POSITIONS.debate_topic_id, debateTopics[0].id))
        .execute();
    }

    // Check if AI vs AI conversations exist
    const aiConversationsCount = await db
      .select({ count: count() })
      .from(AI_CONVERSATIONS)
      .innerJoin(DEBATE_TOPICS, eq(AI_CONVERSATIONS.debate_topic_id, DEBATE_TOPICS.id))
      .where(eq(DEBATE_TOPICS.news_group_id, parseInt(groupId)))
      .execute();

    const hasAIvsAI = aiConversationsCount[0].count > 0;

    // Check if MCQ responses exist
    const mcqResponsesCount = await db
      .select({ count: count() })
      .from(MC_DEBATE_RESPONSES)
      .innerJoin(DEBATE_TOPICS, eq(MC_DEBATE_RESPONSES.debate_topic_id, DEBATE_TOPICS.id))
      .where(eq(DEBATE_TOPICS.news_group_id, parseInt(groupId)))
      .execute();

    const hasMCQ = mcqResponsesCount[0].count > 0;

    // Define available debate types
    const availableDebateTypes = [
      {
        id: "user_vs_ai",
        title: "Debate with AI",
        available: hasDebateTopics, // Always available if there are debate topics
      },
      {
        id: "ai_vs_ai", 
        title: "Watch AI vs AI",
        available: hasAIvsAI,
      },
      {
        id: "mcq",
        title: "MCQ Challenge",
        available: hasMCQ,
      }
    ];

    // Get sample news (first article) for the group display
    const sampleNews = newsArticles[0];

    // Get FOR and AGAINST positions for display
    const forPosition = debatePositions.find(p => p.position_type === 'for');
    const againstPosition = debatePositions.find(p => p.position_type === 'against');

    const response = {
      success: true,
      data: {
        newsGroup: {
          ...newsGroup[0],
          sampleNews: sampleNews,
        },
        newsArticles: newsArticles,
        availableDebateTypes: availableDebateTypes,
        userPlan: userPlan,
        hasDebateContent: hasDebateTopics,
        debateInfo: hasDebateTopics ? {
          topic: debateTopics[0],
          forPosition: forPosition ? {
            title: forPosition.position_title,
            persona: forPosition.ai_persona
          } : null,
          againstPosition: againstPosition ? {
            title: againstPosition.position_title,
            persona: againstPosition.ai_persona
          } : null,
        } : null,
        stats: {
          totalArticles: newsArticles.length,
          availableDebateTypes: availableDebateTypes.filter(t => t.available).length,
          hasAIvsAI,
          hasMCQ,
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error fetching news group details:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch news group details",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}