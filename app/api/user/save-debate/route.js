// /api/user/save-debate/route.js
import { NextResponse } from 'next/server';
import { db } from '@/utils';
import { USER_FOLDERS, SAVED_DEBATES, USER_CUSTOM_DEBATES, USER_DETAILS } from '@/utils/schema';
import { eq, and } from 'drizzle-orm';
import { authenticate } from '@/lib/jwtMiddleware';

// POST - Save debate to folder
export async function POST(req) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;

  try {
    const { folderId, debateId, note } = await req.json();

    if (!folderId || !debateId) {
      return NextResponse.json(
        { message: "Folder ID and Debate ID are required" },
        { status: 400 }
      );
    }

    // ✅ Get user's exam_type_id
    const [user] = await db
      .select({ exam_type_id: USER_DETAILS.exam_type_id })
      .from(USER_DETAILS)
      .where(eq(USER_DETAILS.id, userId));

    if (!user?.exam_type_id) {
      return NextResponse.json(
        { message: "User's exam type not found. Please complete profile." },
        { status: 400 }
      );
    }

    // Check if folder belongs to user
    const folder = await db
      .select()
      .from(USER_FOLDERS)
      .where(eq(USER_FOLDERS.id, parseInt(folderId)))
      .where(eq(USER_FOLDERS.user_id, userId))
      .limit(1);

    if (folder.length === 0) {
      return NextResponse.json(
        { message: "Folder not found or unauthorized" },
        { status: 404 }
      );
    }

    // Check if debate exists and belongs to user
    const debate = await db
      .select()
      .from(USER_CUSTOM_DEBATES)
      .where(and(
        eq(USER_CUSTOM_DEBATES.id, parseInt(debateId)),
        eq(USER_CUSTOM_DEBATES.user_id, userId)
      ))
      .limit(1);

    if (debate.length === 0) {
      return NextResponse.json(
        { message: "Debate not found or unauthorized" },
        { status: 404 }
      );
    }

    // Check if debate already saved
    const existingSave = await db
      .select()
      .from(SAVED_DEBATES)
      .where(
        and(
          eq(SAVED_DEBATES.user_folder_id, parseInt(folderId)),
          eq(SAVED_DEBATES.debate_id, parseInt(debateId))
        )
      )
      .limit(1);

    if (existingSave.length > 0) {
      return NextResponse.json(
        { message: "Debate already saved in this folder" },
        { status: 400 }
      );
    }

    // ✅ Insert with exam_type_id
    const insertResult = await db
      .insert(SAVED_DEBATES)
      .values({
        user_folder_id: parseInt(folderId),
        debate_id: parseInt(debateId),
        note: note || null,
        exam_type_id: user.exam_type_id, // ✅ Save exam type
      })
      .execute();

    const [savedDebate] = await db
      .select()
      .from(SAVED_DEBATES)
      .where(eq(SAVED_DEBATES.id, insertResult[0].insertId));

    return NextResponse.json(
      { savedDebate, message: "Debate saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving debate:", error);
    return NextResponse.json(
      { message: "Error saving debate", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove debate from folder
export async function DELETE(req) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  
  try {
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get('folderId');
    const debateId = searchParams.get('debateId');
    
    if (!folderId || !debateId) {
      return NextResponse.json(
        { message: "Folder ID and Debate ID are required" },
        { status: 400 }
      );
    }
    
    // Check if folder belongs to user
    const folder = await db
      .select()
      .from(USER_FOLDERS)
      .where(eq(USER_FOLDERS.id, parseInt(folderId)))
      .where(eq(USER_FOLDERS.user_id, userId))
      .limit(1);
    
    if (folder.length === 0) {
      return NextResponse.json(
        { message: "Folder not found or unauthorized" },
        { status: 404 }
      );
    }
    
    // Delete saved debate
    const result = await db
      .delete(SAVED_DEBATES)
      .where(and(
        eq(SAVED_DEBATES.user_folder_id, parseInt(folderId)),
        eq(SAVED_DEBATES.debate_id, parseInt(debateId))
      ));
    
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