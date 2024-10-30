import { db } from "@/utils";
import { CHILDREN } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { authenticate } from "@/lib/jwtMiddleware";

export async function GET(req) {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response; // Return the response if authentication fails
    }
    
    const userId = authResult.decoded_Data.id;
  try {
    const children = await db
      .select()
      .from(CHILDREN)
      .where(eq(CHILDREN.user_id, userId))
      .execute();
// console.log(children)
    return NextResponse.json({ data: children });
  } catch (error) {
    console.error("Fetch Children Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
