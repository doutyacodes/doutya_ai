// /api/user/save-news/route.js
import { NextResponse } from 'next/server';
import { db } from '@/utils';
import { USER_FOLDERS, SAVED_NEWS, ADULT_NEWS, USER_DETAILS } from '@/utils/schema';
import { eq, and } from 'drizzle-orm';
import { authenticate } from '@/lib/jwtMiddleware';

// POST - Save news to folder
export async function POST(req) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;

  try {
    const { folderId, newsId, note } = await req.json();

    if (!folderId || !newsId) {
      return NextResponse.json(
        { message: "Folder ID and News ID are required" },
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

    // Check if news exists
    const news = await db
      .select()
      .from(ADULT_NEWS)
      .where(eq(ADULT_NEWS.id, parseInt(newsId)))
      .limit(1);

    if (news.length === 0) {
      return NextResponse.json(
        { message: "News item not found" },
        { status: 404 }
      );
    }

    // Check if news already saved
    const existingSave = await db
      .select()
      .from(SAVED_NEWS)
      .where(
        and(
          eq(SAVED_NEWS.user_folder_id, parseInt(folderId)),
          eq(SAVED_NEWS.news_id, parseInt(newsId))
        )
      )
      .limit(1);

    if (existingSave.length > 0) {
      return NextResponse.json(
        { message: "News already saved in this folder" },
        { status: 400 }
      );
    }

    // ✅ Insert with exam_type_id
    const insertResult = await db
      .insert(SAVED_NEWS)
      .values({
        user_folder_id: parseInt(folderId),
        news_id: parseInt(newsId),
        note: note || null,
        exam_type_id: user.exam_type_id, // ✅ Save exam type
      })
      .execute();

    const [savedNews] = await db
      .select()
      .from(SAVED_NEWS)
      .where(eq(SAVED_NEWS.id, insertResult[0].insertId));

    return NextResponse.json(
      { savedNews, message: "News saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving news:", error);
    return NextResponse.json(
      { message: "Error saving news", details: error.message },
      { status: 500 }
    );
  }
}


// DELETE - Remove news from folder
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
    const newsId = searchParams.get('newsId');
    
    if (!folderId || !newsId) {
      return NextResponse.json(
        { message: "Folder ID and News ID are required" },
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
    
    // Delete saved news
    const result = await db
      .delete(SAVED_NEWS)
      .where(and(
        eq(SAVED_NEWS.user_folder_id, parseInt(folderId)),
        eq(SAVED_NEWS.news_id, parseInt(newsId))
      ));
    
    return NextResponse.json(
      { message: "News removed from folder successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing saved news:", error);
    return NextResponse.json(
      { message: "Error removing saved news", details: error.message },
      { status: 500 }
    );
  }
}
