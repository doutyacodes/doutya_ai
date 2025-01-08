import { NextResponse } from "next/server";
import { db } from "@/utils";
import { ADULT_NEWS, NEWS_CATEGORIES } from "@/utils/schema";
import { asc, desc, eq, gt, gte, lt } from "drizzle-orm";

export async function POST(req) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "News ID is required." },
      { status: 400 }
    );
  }

  try {
    // Fetch the specific news item to get its news_group_id
    const originalNews = await db
      .select()
      .from(ADULT_NEWS)
      .where(eq(ADULT_NEWS.id, id))
      .execute();

    if (originalNews.length === 0) {
      return NextResponse.json(
        { error: "Original news not found." },
        { status: 404 }
      );
    }

    const { news_group_id } = originalNews[0];

    // Fetch all news with the same news_group_id
    const newsArticle = await db
      .select({
        id: ADULT_NEWS.id,
        title: ADULT_NEWS.title,
        description: ADULT_NEWS.description,
        category: NEWS_CATEGORIES.name,
        news_category_id: ADULT_NEWS.news_category_id,
        image_url: ADULT_NEWS.image_url,
        summary: ADULT_NEWS.summary,
        viewpoint: ADULT_NEWS.viewpoint,
        created_at: ADULT_NEWS.created_at,
        updated_at: ADULT_NEWS.updated_at,
      })
      .from(ADULT_NEWS)
      .leftJoin(NEWS_CATEGORIES, eq(ADULT_NEWS.news_category_id, NEWS_CATEGORIES.id)) // Join with categories
      .where(eq(ADULT_NEWS.news_group_id, news_group_id)) // Filter by news_group_id
      .execute();

    if (newsArticle.length === 0) {
      return NextResponse.json(
        { error: "No related news found for the given group." },
        { status: 404 }
      );
    }

    // Fetch the next news group ID (greater than current news_group_id)
    let nextNewsGroup = await db
    .select({ id: ADULT_NEWS.id, title: ADULT_NEWS.title })
    .from(ADULT_NEWS)
    .where(lt(ADULT_NEWS.news_group_id, news_group_id)) // Looking for the previous group
    .orderBy(desc(ADULT_NEWS.id)) // Get the most recent news in the previous group
    .limit(1)
    .execute();

    // If the next news group doesn't exist, fetch the most recent news (newest article)
    if (nextNewsGroup.length === 0) {
    nextNewsGroup = await db
      .select({ id: ADULT_NEWS.id, title: ADULT_NEWS.title })
      .from(ADULT_NEWS)
      .orderBy(desc(ADULT_NEWS.id)) // Get the most recent news (newest article)
      .limit(1)
      .execute();
    }

    // Fetch the previous news group ID (less than current news_group_id)
    let prevNewsGroup = await db
    .select({ id: ADULT_NEWS.id, title: ADULT_NEWS.title })
    .from(ADULT_NEWS)
    .where(gt(ADULT_NEWS.news_group_id, news_group_id)) // Looking for the next group
    .orderBy(asc(ADULT_NEWS.id)) // Get the first news in the next group
    .limit(1) // Only fetch the first news item
    .execute();

    // If the previous news group doesn't exist, fetch the oldest news (earliest article)
    if (prevNewsGroup.length === 0) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // Calculate 24 hours ago

      prevNewsGroup = await db
        .select({ id: ADULT_NEWS.id, title: ADULT_NEWS.title })
        .from(ADULT_NEWS)
        .where(
          gt(ADULT_NEWS.updated_at, twentyFourHoursAgo)
        ) // Filter by updated_at within the last 24 hours
        .orderBy(asc(ADULT_NEWS.updated_at)) // Get the most recently updated news
        .limit(1) // Only fetch the first news item
        .execute();
      }

    // Extract the next and previous news
    const nextNews = nextNewsGroup.length > 0 ? nextNewsGroup[0] : null;
    const prevNews = prevNewsGroup.length > 0 ? prevNewsGroup[0] : null;

    // Format the response to include the related news, next news, and previous news
    const formattedResponse = {
    newsArticle, // Related news items from the same group
    nextNews,    // Information about the first news in the next group, or the most recent news
    prevNews,    // Information about the last news in the previous group, or the oldest news
    };

  //  // Fetch the next news group ID (greater than current news_group_id)
  //   let nextNewsGroup = await db
  //   .select({ id: ADULT_NEWS.id, title: ADULT_NEWS.title })
  //   .from(ADULT_NEWS)
  //   .where(eq(ADULT_NEWS.news_group_id, news_group_id - 1)) // Looking for the next group
  //   .orderBy(ADULT_NEWS.id) // Get the first news in the next group
  //   .limit(1) // Only fetch the first news item
  //   .execute();

  //   // If the next news group doesn't exist, fetch the most recently updated news from the last 24 hours
  //   if (nextNewsGroup.length === 0) {
  //   const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // Calculate 24 hours ago

  //   nextNewsGroup = await db
  //     .select({ id: ADULT_NEWS.id, title: ADULT_NEWS.title })
  //     .from(ADULT_NEWS)
  //     .where(
  //       gt(ADULT_NEWS.updated_at, twentyFourHoursAgo)
  //     ) // Filter by updated_at within the last 24 hours
  //     .orderBy(asc(ADULT_NEWS.updated_at)) // Get the most recently updated news
  //     .limit(1) // Only fetch the first news item
  //     .execute();
  //   }

  //   // Check if the next news exists
  //   const nextNews = nextNewsGroup.length > 0 ? nextNewsGroup[0] : null;

  //   // Format the response to include the related news and next news group info
  //   const formattedResponse = {
  //     newsArticle, // Related news items from the same group
  //     nextNews, // Information about the first news in the next group, if available
  //   };

    return NextResponse.json({ newsData: formattedResponse }); // Return all related news
  } catch (error) {
    console.error("Error fetching related news:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching news." },
      { status: 500 }
    );
  }
}
