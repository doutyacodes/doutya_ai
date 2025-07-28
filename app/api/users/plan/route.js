// /api/user/plan/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import { USER_DETAILS } from "@/utils/schema";
import { db } from "@/utils";
import { eq } from "drizzle-orm";

export async function GET(request) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;

  try {
    // Get user plan from database
    const userInfo = await db
      .select({ 
        plan: USER_DETAILS.plan,
        name: USER_DETAILS.name,
        username: USER_DETAILS.username
      })
      .from(USER_DETAILS)
      .where(eq(USER_DETAILS.id, userId))
      .limit(1)
      .execute();

    if (!userInfo.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = userInfo[0];

    return NextResponse.json({
      success: true,
      data: {
        plan: user.plan,
        name: user.name,
        username: user.username,
        is_elite: user.plan === 'elite',
        can_create_custom_debates: user.plan === 'elite'
      }
    });

  } catch (error) {
    console.error("Error fetching user plan:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch user plan",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}