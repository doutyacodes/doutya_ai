import { NextResponse } from "next/server";
import { db } from "@/utils";
import { ADULT_NEWS, NEWS_CATEGORIES } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const { id } = await req.json();
console.log(id)
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

    

    return NextResponse.json({ newsData: originalNews[0] }); // Return all related news
  } catch (error) {
    console.error("Error fetching related news:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching news." },
      { status: 500 }
    );
  }
}
