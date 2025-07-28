// /api/user/saved-debates/[id]/route.js
import { authenticate } from "@/lib/jwtMiddleware";
import { db } from "@/utils";
import { SAVED_DEBATES, USER_FOLDERS } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// PUT - Update note for saved debate
export async function PUT(req, { params }) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const savedDebateId = await params.id;
  
  try {
    const { note } = await req.json();
    
    // Verify the saved debate belongs to the user
    const savedDebate = await db
      .select()
      .from(SAVED_DEBATES)
      .innerJoin(USER_FOLDERS, eq(SAVED_DEBATES.user_folder_id, USER_FOLDERS.id))
      .where(
        and(
          eq(SAVED_DEBATES.id, parseInt(savedDebateId)),
          eq(USER_FOLDERS.user_id, userId)
        )
      )
      .limit(1);
    
    if (savedDebate.length === 0) {
      return NextResponse.json(
        { message: "Saved debate not found or unauthorized" },
        { status: 404 }
      );
    }
    
    // Update the note
    await db
      .update(SAVED_DEBATES)
      .set({ note: note || null })
      .where(eq(SAVED_DEBATES.id, parseInt(savedDebateId)));
    
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

// DELETE - Remove saved debate from folder
export async function DELETE(req, { params }) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const savedDebateId = await params.id;
  
  try {
    // Verify the saved debate belongs to the user
    const savedDebate = await db
      .select()
      .from(SAVED_DEBATES)
      .innerJoin(USER_FOLDERS, eq(SAVED_DEBATES.user_folder_id, USER_FOLDERS.id))
      .where(
        and(
          eq(SAVED_DEBATES.id, parseInt(savedDebateId)),
          eq(USER_FOLDERS.user_id, userId)
        )
      )
      .limit(1);
    
    if (savedDebate.length === 0) {
      return NextResponse.json(
        { message: "Saved debate not found or unauthorized" },
        { status: 404 }
      );
    }
    
    // Delete the saved debate
    await db
      .delete(SAVED_DEBATES)
      .where(eq(SAVED_DEBATES.id, parseInt(savedDebateId)));
    
    return NextResponse.json(
      { message: "Debate removed from folder successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error removing saved debate:", error);
    return NextResponse.json(
      { message: "Error removing saved debate", details: error.message },
      { status: 500 }
    );
  }
}