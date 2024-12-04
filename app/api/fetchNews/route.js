import { NextResponse } from "next/server";
import { db } from "@/utils";
import { NEWS, NEWS_CATEGORIES } from "@/utils/schema";
import { authenticate } from "@/lib/jwtMiddleware";
import { and, desc, eq, gt } from "drizzle-orm";

export async function POST(req) {
  // const authResult = await authenticate(req,true);
  // if (!authResult.authenticated) {
  //   return authResult.response;
  // }

  // const userId = authResult.decoded_Data.id;
  const { age } = await req.json();

  if (!age) {
    return NextResponse.json({ error: "Age is required." }, { status: 400 });
  }

  try {
    // Fetch news categories
    const newsCategories = await db.select().from(NEWS_CATEGORIES).execute();

    // Calculate 24-hour threshold
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Fetch top news created within the last 24 hours
    const news_top = await db
      .select({
        id: NEWS.id,
        title: NEWS.title,
        description: NEWS.description,
        category: NEWS_CATEGORIES.name,
        age: NEWS.age,
        news_category_id: NEWS.news_category_id,
        image_url: NEWS.image_url, // URL of the featured image
        summary: NEWS.summary, // Brief summary, nullable
        created_at: NEWS.created_at, // Timestamp for record creation
        updated_at: NEWS.updated_at,
      })
      .from(NEWS)
      .leftJoin(NEWS_CATEGORIES, eq(NEWS.news_category_id, NEWS_CATEGORIES.id)) // Join on category ID
      .orderBy(desc(NEWS.created_at))
      .where(
        and(
          eq(NEWS.age, age),
          eq(NEWS.show_on_top, true),
          gt(NEWS.created_at, twentyFourHoursAgo) // Created within the last 24 hours
        )
      )
      .limit(2)
      .execute();

    // Fetch normal news (not marked as "on top")
    const news = await db
      .select({
        id: NEWS.id,
        title: NEWS.title,
        description: NEWS.description,
        category: NEWS_CATEGORIES.name,
        age: NEWS.age,
        news_category_id: NEWS.news_category_id,
        image_url: NEWS.image_url, // URL of the featured image
        summary: NEWS.summary, // Brief summary, nullable
        created_at: NEWS.created_at, // Timestamp for record creation
        updated_at: NEWS.updated_at,
      })
      .from(NEWS)
      .leftJoin(NEWS_CATEGORIES, eq(NEWS.news_category_id, NEWS_CATEGORIES.id)) // Join on category ID
      .orderBy(desc(NEWS.created_at))
      .where(and(eq(NEWS.age, age), eq(NEWS.show_on_top, false)))
      .execute();

    return NextResponse.json({
      categories: newsCategories,
      news,
      news_top,
    });
  } catch (error) {
    console.error("Error fetching news categories or news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news data." },
      { status: 500 }
    );
  }
}
