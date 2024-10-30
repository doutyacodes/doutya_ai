import { NextResponse } from "next/server";
import { db } from "@/utils";
import { COURSES } from "@/utils/schema";
import { authenticate } from "@/lib/jwtMiddleware";
import { and, asc, desc, eq } from "drizzle-orm";
import { count } from "drizzle-orm"; // Import count function

export async function POST(req) {
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userId = authResult.decoded_Data.id;
  const { childId, page, limit, type, sortBy } = await req.json();

  if (!userId || !childId) {
    return NextResponse.json(
      { error: "user_id and child_id are required." },
      { status: 400 }
    );
  }

  const offset = (page - 1) * limit;

  try {
    let query = db
      .select()
      .from(COURSES)
      .where(and(eq(COURSES.user_id, userId), eq(COURSES.child_id, childId)))
      .limit(limit)
      .offset(offset);

    if (type) {
      query = query.where(eq(COURSES.type, type));
    }

    if (sortBy === "latest") {
      query = query.orderBy(desc(COURSES.created_at));
    } else if (sortBy === "oldest") {
      query = query.orderBy(asc(COURSES.created_at));
    }

    const courses = await query.execute();

    const [{ count: totalCount }] = await db
      .select({ count: count(COURSES.child_id) }) // Counts only non-NULL child_id
      .from(COURSES)
      .where(and(eq(COURSES.user_id, userId), eq(COURSES.child_id, childId)))
      .execute();

    return NextResponse.json({
      courses,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses." },
      { status: 500 }
    );
  }
}
