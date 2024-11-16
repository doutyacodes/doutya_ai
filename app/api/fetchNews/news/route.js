import { NextResponse } from "next/server";
import { db } from "@/utils";
import { NEWS } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const { id } = await req.json(); // Extract 'id' from the request body

  if (!id) {
    return NextResponse.json(
      { error: "News ID is required." },
      { status: 400 }
    );
  }

  try {
    // Fetch the specific news based on the provided id
    const news = await db
      .select()
      .from(NEWS)
      .where(eq(NEWS.id, id))
      .execute();

    if (news.length === 0) {
      return NextResponse.json(
        { error: "News not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(news[0]); // Return the first (and only) news item
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch news." },
      { status: 500 }
    );
  }
}
