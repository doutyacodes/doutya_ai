import { NextResponse } from "next/server";
import { db } from "@/utils";
import { ADULT_NEWS, NEWS_CATEGORIES, ADULT_NEWS_TO_CATEGORIES } from "@/utils/schema";
import { and, asc, desc, eq, gt, lt, or, sql } from "drizzle-orm";

export async function POST() {
  try {
    // Fetch news categories
    const newsCategories = await db
      .select()
      .from(NEWS_CATEGORIES)
      .orderBy(asc(NEWS_CATEGORIES.order_no))
      .execute();

    // Calculate 24-hour threshold
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Fetch top news created within the last 24 hours
    const newsTop = await db
      .select({
        id: ADULT_NEWS.id,
        title: ADULT_NEWS.title,
        description: ADULT_NEWS.description,
        categoryIds: sql`GROUP_CONCAT(${NEWS_CATEGORIES.id} SEPARATOR ',')`.as(
          "categoryIds"
        ),
        categoryNames:
          sql`GROUP_CONCAT(${NEWS_CATEGORIES.name} SEPARATOR ',')`.as(
            "categoryNames"
          ),
        image_url: ADULT_NEWS.image_url,
        summary: ADULT_NEWS.summary,
        created_at: ADULT_NEWS.created_at,
        updated_at: ADULT_NEWS.updated_at,
        main_news: ADULT_NEWS.main_news,
        news_group_id: ADULT_NEWS.news_group_id, // Include news_group_id
      })
      .from(ADULT_NEWS)
      .leftJoin(ADULT_NEWS_TO_CATEGORIES, eq(ADULT_NEWS.id, ADULT_NEWS_TO_CATEGORIES.news_id))
      .leftJoin(
        NEWS_CATEGORIES,
        eq(ADULT_NEWS_TO_CATEGORIES.news_category_id, NEWS_CATEGORIES.id)
      )
      .groupBy(ADULT_NEWS.id)
      .orderBy(desc(ADULT_NEWS.created_at))
      .where(
        and(eq(ADULT_NEWS.show_on_top, true), gt(ADULT_NEWS.created_at, twentyFourHoursAgo))
      )
      .execute();

    // Fetch normal news (not marked as "on top")
    const news = await db
      .select({
        id: ADULT_NEWS.id,
        title: ADULT_NEWS.title,
        description: ADULT_NEWS.description,
        categoryIds: sql`GROUP_CONCAT(${NEWS_CATEGORIES.id} SEPARATOR ',')`.as(
          "categoryIds"
        ),
        categoryNames:
          sql`GROUP_CONCAT(${NEWS_CATEGORIES.name} SEPARATOR ',')`.as(
            "categoryNames"
          ),
        image_url: ADULT_NEWS.image_url,
        summary: ADULT_NEWS.summary,
        created_at: ADULT_NEWS.created_at,
        updated_at: ADULT_NEWS.updated_at,
        news_group_id: ADULT_NEWS.news_group_id, // Include news_group_id
      })
      .from(ADULT_NEWS)
      .leftJoin(ADULT_NEWS_TO_CATEGORIES, eq(ADULT_NEWS.id, ADULT_NEWS_TO_CATEGORIES.news_id))
      .leftJoin(
        NEWS_CATEGORIES,
        eq(ADULT_NEWS_TO_CATEGORIES.news_category_id, NEWS_CATEGORIES.id)
      )
      .where(
        or(
          and(eq(ADULT_NEWS.show_on_top, false)),
          and(
            and(
              eq(ADULT_NEWS.show_on_top, true),
              lt(ADULT_NEWS.created_at, twentyFourHoursAgo)
            )
          )
        )
      )
      .groupBy(ADULT_NEWS.id)
      .orderBy(desc(ADULT_NEWS.created_at))
      .execute();

    // Function to group news by news_group_id
    const groupByNewsGroupId = (newsData) => {
      return newsData.reduce((acc, currentNews) => {
        const { news_group_id } = currentNews;
        if (!acc[news_group_id]) {
          acc[news_group_id] = [];
        }
        acc[news_group_id].push(currentNews);
        return acc;
      }, {});
    };

    // Group top news and normal news by news_group_id
    const groupedNewsTop = groupByNewsGroupId(newsTop);
    const groupedNews = groupByNewsGroupId(news);

    // Format grouped news into arrays
    const groupedNewsTopArray = Object.keys(groupedNewsTop).map((groupId) => ({
      news_group_id: groupId,
      newsItems: groupedNewsTop[groupId],
    }));

    const groupedNewsArray = Object.keys(groupedNews).map((groupId) => ({
      news_group_id: groupId,
      newsItems: groupedNews[groupId],
    }));
console.log("newsTopGroupedByGroupId",groupedNewsTopArray)
console.log("newsGroupedByGroupId",groupedNewsArray[0].newsItems)
    return NextResponse.json({
      categories: newsCategories,
      newsTopGroupedByGroupId: groupedNewsTopArray, // Return grouped top news
      newsGroupedByGroupId: groupedNewsArray, // Return grouped normal news
    });
  } catch (error) {
    console.error("Error fetching news categories or news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news data." },
      { status: 500 }
    );
  }
}