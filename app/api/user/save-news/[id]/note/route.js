import { authenticate } from "@/lib/jwtMiddleware";
import { db } from "@/utils";
import { SAVED_NEWS, USER_FOLDERS } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// PUT - Update note for saved news
export async function PUT(req, { params }) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const savedNewsId = params.id;
  
  try {
    const { note } = await req.json();
    
    // Verify the saved news belongs to the user
    const savedNews = await db
      .select()
      .from(SAVED_NEWS)
      .innerJoin(USER_FOLDERS, eq(SAVED_NEWS.user_folder_id, USER_FOLDERS.id))
      .where(
        and(
          eq(SAVED_NEWS.id, parseInt(savedNewsId)),
          eq(USER_FOLDERS.user_id, userId)
        )
      )
      .limit(1);
    
    if (savedNews.length === 0) {
      return NextResponse.json(
        { message: "Saved news not found or unauthorized" },
        { status: 404 }
      );
    }
    
    // Update the note
    await db
      .update(SAVED_NEWS)
      .set({ note: note || null })
      .where(eq(SAVED_NEWS.id, parseInt(savedNewsId)));
    
    return NextResponse.json(
      { message: "Note updated successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { message: "Error updating note", details: error.message },
      { status: 500 }
    );
  }
}