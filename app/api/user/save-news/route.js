// /api/user/save-news/route.js
import { NextResponse } from 'next/server';
import { db } from '@/utils';
import { USER_FOLDERS, SAVED_NEWS, ADULT_NEWS } from '@/utils/schema';
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
    const { folderId, newsId } = await req.json();
    
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
    
    // Check if news is already saved in this folder
    const existingSave = await db
      .select()
      .from(SAVED_NEWS)
      .where(and(
        eq(SAVED_NEWS.user_folder_id, parseInt(folderId)),
        eq(SAVED_NEWS.news_id, parseInt(newsId))
      ))
      .limit(1);
    
    if (existingSave.length > 0) {
      return NextResponse.json(
        { message: "News already saved in this folder" },
        { status: 400 }
      );
    }
    
    // Save news to folder
    const insertResult = await db
    .insert(SAVED_NEWS)
    .values({
        user_folder_id: parseInt(folderId),
        news_id: parseInt(newsId),
    })
    .execute();

    // Manually fetch the inserted row using insertId
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

// GET - Get saved news in a folder
export async function GET(req) {
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
    
    if (!folderId) {
      return NextResponse.json(
        { message: "Folder ID is required" },
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
    
    // Get saved news with details
    const savedNews = await db
      .select({
        saved_id: SAVED_NEWS.id,
        saved_at: SAVED_NEWS.saved_at,
        news_id: ADULT_NEWS.id,
        title: ADULT_NEWS.title,
        content: ADULT_NEWS.content,
        image_url: ADULT_NEWS.image_url,
        created_at: ADULT_NEWS.created_at,
        source_name: ADULT_NEWS.source_name,
      })
      .from(SAVED_NEWS)
      .innerJoin(ADULT_NEWS, eq(SAVED_NEWS.news_id, ADULT_NEWS.id))
      .where(eq(SAVED_NEWS.user_folder_id, parseInt(folderId)))
      .orderBy(SAVED_NEWS.saved_at);
    
    return NextResponse.json(
      { 
        folder: folder[0],
        savedNews,
        count: savedNews.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching saved news:", error);
    return NextResponse.json(
      { message: "Error fetching saved news", details: error.message },
      { status: 500 }
    );
  }
}