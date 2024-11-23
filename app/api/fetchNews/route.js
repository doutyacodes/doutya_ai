import { NextResponse } from "next/server";
import { db } from "@/utils";
import { NEWS, NEWS_CATEGORIES } from "@/utils/schema";
import { authenticate } from "@/lib/jwtMiddleware";
import { eq } from "drizzle-orm";

export async function POST(req) {
  // const authResult = await authenticate(req,true);
  // if (!authResult.authenticated) {
  //   return authResult.response;
  // }

  // const userId = authResult.decoded_Data.id;
  const { age } = await req.json();

  // if (!userId) {
  //   return NextResponse.json(
  //     { error: "User ID is required." },
  //     { status: 400 }
  //   );
  // }

  if (!age) {
    return NextResponse.json(
      { error: "Age is required." },
      { status: 400 }
    );
  }

  try {
    // Fetch news categories
    const newsCategories = await db.select().from(NEWS_CATEGORIES).execute();

    // Fetch news based on the provided age
    const news = await db
      .select()
      .from(NEWS)
      .where(eq(NEWS.age, age))
      .execute();

    return NextResponse.json({
      categories: newsCategories,
      news,
    });
  } catch (error) {
    console.error("Error fetching news categories or news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news data." },
      { status: 500 }
    );
  }
}
