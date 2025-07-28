// /api/user/saved-debates/count/route.js
import { NextResponse } from "next/server";
import { db } from "@/utils";
import { SAVED_DEBATES, USER_FOLDERS, USER_DETAILS } from "@/utils/schema";
import { eq, count } from "drizzle-orm";
import { authenticate } from "@/lib/jwtMiddleware";

export async function GET(req) {
  try {
    // Authenticate user
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response;
    }
    const userData = authResult.decoded_Data;
    const userId = userData.id;

    // Get count of saved debates for the user
    const savedDebatesCount = await db
      .select({
        count: count(SAVED_DEBATES.id),
      })
      .from(SAVED_DEBATES)
      .innerJoin(USER_FOLDERS, eq(SAVED_DEBATES.user_folder_id, USER_FOLDERS.id))
      .where(eq(USER_FOLDERS.user_id, userId))
      .limit(1);

    const totalCount = savedDebatesCount[0]?.count || 0;

    return NextResponse.json({ count: totalCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching saved debates count:", error);
    return NextResponse.json(
      { message: "Error fetching saved debates count", details: error.message },
      { status: 500 }
    );
  }
}