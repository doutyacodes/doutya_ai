// /api/debates/route.js
import { NextResponse } from "next/server";
import {
  ADULT_NEWS_GROUP,
  ADULT_NEWS,
  DEBATE_TOPICS,
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, desc, count, isNotNull, max, sql } from "drizzle-orm";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Get total count of unique news groups that have adult news
    const totalCountQuery = await db
      .selectDistinct({ group_id: ADULT_NEWS_GROUP.id })
      .from(ADULT_NEWS_GROUP)
      .leftJoin(ADULT_NEWS, eq(ADULT_NEWS.news_group_id, ADULT_NEWS_GROUP.id))
      .where(isNotNull(ADULT_NEWS.id))
      .execute();

    const totalCount = totalCountQuery.length;
    const totalPages = Math.ceil(totalCount / limit);

    // First, get the latest news date for each group
    const latestNewsPerGroup = await db
      .select({
        group_id: ADULT_NEWS.news_group_id,
        latest_show_date: max(ADULT_NEWS.show_date).as('latest_show_date'),
      })
      .from(ADULT_NEWS)
      .groupBy(ADULT_NEWS.news_group_id)
      .execute();

    // Create a subquery to get the most recent news for each group
    const newsGroupsQuery = await db
      .select({
        group_id: ADULT_NEWS_GROUP.id,
        group_created_at: ADULT_NEWS_GROUP.created_at,
        group_updated_at: ADULT_NEWS_GROUP.updated_at,
        show_on_top: ADULT_NEWS_GROUP.show_on_top,
        main_news: ADULT_NEWS_GROUP.main_news,
        news_id: ADULT_NEWS.id,
        news_title: ADULT_NEWS.title,
        news_image_url: ADULT_NEWS.image_url,
        news_summary: ADULT_NEWS.summary,
        news_created_at: ADULT_NEWS.created_at,
        news_viewpoint: ADULT_NEWS.viewpoint,
        news_show_date: ADULT_NEWS.show_date,
        latest_news_date: sql`${ADULT_NEWS.show_date}`.as('latest_news_date'),
      })
      .from(ADULT_NEWS_GROUP)
      .leftJoin(ADULT_NEWS, eq(ADULT_NEWS.news_group_id, ADULT_NEWS_GROUP.id))
      .where(isNotNull(ADULT_NEWS.id))
      .execute();

    // Group the results by news group and find the most recent news for each group
    const groupedResults = {};
    newsGroupsQuery.forEach(row => {
      if (!groupedResults[row.group_id]) {
        groupedResults[row.group_id] = {
          group_id: row.group_id,
          group_created_at: row.group_created_at,
          group_updated_at: row.group_updated_at,
          show_on_top: row.show_on_top,
          main_news: row.main_news,
          latest_news_date: new Date(row.news_show_date),
          sample_news: {
            id: row.news_id,
            title: row.news_title,
            image_url: row.news_image_url,
            summary: row.news_summary,
            created_at: row.news_created_at,
            viewpoint: row.news_viewpoint,
            show_date: row.news_show_date,
          }
        };
      } else {
        // Keep the most recent news for this group
        const currentNewsDate = new Date(row.news_show_date);
        if (currentNewsDate > groupedResults[row.group_id].latest_news_date) {
          groupedResults[row.group_id].latest_news_date = currentNewsDate;
          groupedResults[row.group_id].sample_news = {
            id: row.news_id,
            title: row.news_title,
            image_url: row.news_image_url,
            summary: row.news_summary,
            created_at: row.news_created_at,
            viewpoint: row.news_viewpoint,
            show_date: row.news_show_date,
          };
        }
      }
    });

    // Sort by latest news date (descending - most recent first)
    const allNewsGroups = Object.values(groupedResults)
      .sort((a, b) => new Date(b.latest_news_date) - new Date(a.latest_news_date));

    // Apply pagination to sorted results
    const paginatedNewsGroups = allNewsGroups.slice(offset, offset + limit);

    // Check if each group has debate topics and count total news
    const newsGroupsWithDebateInfo = await Promise.all(
      paginatedNewsGroups.map(async (group) => {
        const debateTopics = await db
          .select({ count: count() })
          .from(DEBATE_TOPICS)
          .where(eq(DEBATE_TOPICS.news_group_id, group.group_id))
          .execute();

        const hasDebate = debateTopics[0].count > 0;

        // Count total news in this group
        const totalNewsCount = await db
          .select({ count: count() })
          .from(ADULT_NEWS)
          .where(eq(ADULT_NEWS.news_group_id, group.group_id))
          .execute();

        // Remove the latest_news_date from the final response as it's just for sorting
        const { latest_news_date, ...groupWithoutSortField } = group;

        return {
          ...groupWithoutSortField,
          has_debate: hasDebate,
          total_news_count: totalNewsCount[0].count
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: newsGroupsWithDebateInfo,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_count: totalCount,
        limit: limit,
        has_next: page < totalPages,
        has_prev: page > 1,
      }
    });

  } catch (error) {
    console.error("Error fetching news groups:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch news groups",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}