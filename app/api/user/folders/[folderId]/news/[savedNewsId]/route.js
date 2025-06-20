// /api/user/folders/[folderId]/news/[savedNewsId]/route.js
import { NextResponse } from 'next/server';
import { USER_FOLDERS, SAVED_NEWS } from '@/utils/schema';
import { eq, and } from 'drizzle-orm';
import { authenticate } from '@/lib/jwtMiddleware';
import { db } from '@/utils';

// DELETE - Remove specific saved news from folder
export async function DELETE(req, { params }) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const folderId = parseInt(params.folderId);
  const savedNewsId = parseInt(params.savedNewsId);
  
  try {
    // Check if folder exists and belongs to user
    const folder = await db
      .select()
      .from(USER_FOLDERS)
      .where(
        and(
          eq(USER_FOLDERS.id, folderId),
          eq(USER_FOLDERS.user_id, userId)
        )
      )
      .limit(1);
    
    if (folder.length === 0) {
      return NextResponse.json(
        { message: "Folder not found" },
        { status: 404 }
      );
    }
    
    // Check if saved news exists in this folder
    const savedNews = await db
      .select()
      .from(SAVED_NEWS)
      .where(
        and(
          eq(SAVED_NEWS.id, savedNewsId),
          eq(SAVED_NEWS.user_folder_id, folderId)
        )
      )
      .limit(1);
    
    if (savedNews.length === 0) {
      return NextResponse.json(
        { message: "Saved news not found in this folder" },
        { status: 404 }
      );
    }
    
    // Remove saved news from folder
    await db
      .delete(SAVED_NEWS)
      .where(
        and(
          eq(SAVED_NEWS.id, savedNewsId),
          eq(SAVED_NEWS.user_folder_id, folderId)
        )
      );
    
    return NextResponse.json(
      { message: "News removed from folder successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing news from folder:", error);
    return NextResponse.json(
      { message: "Error removing news from folder", details: error.message },
      { status: 500 }
    );
  }
}