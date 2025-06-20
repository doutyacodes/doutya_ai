// /api/user/folders/[folderId]/news/route.js
import { NextResponse } from 'next/server';
import { USER_FOLDERS, SAVED_NEWS, ADULT_NEWS, NEWS_CATEGORIES } from '@/utils/schema';
import { eq, and, desc } from 'drizzle-orm';
import { authenticate } from '@/lib/jwtMiddleware';
import { db } from '@/utils';

// GET - Fetch folder details and all saved news in the folder
export async function GET(req, { params }) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const folderId = parseInt(params.folderId);
  
  try {
    // First check if folder exists and belongs to user
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
    
    // Fetch all saved news in this folder with news details
    const savedNews = await db
      .select({
        id: SAVED_NEWS.id,
        saved_at: SAVED_NEWS.saved_at,
        news: {
          id: ADULT_NEWS.id,
          title: ADULT_NEWS.title,
          image_url: ADULT_NEWS.image_url,
          summary: ADULT_NEWS.summary,
          description: ADULT_NEWS.description,
          viewpoint: ADULT_NEWS.viewpoint,
          show_date: ADULT_NEWS.show_date,
          media_type: ADULT_NEWS.media_type,
          created_at: ADULT_NEWS.created_at,
          updated_at: ADULT_NEWS.updated_at,
        }
      })
      .from(SAVED_NEWS)
      .innerJoin(ADULT_NEWS, eq(SAVED_NEWS.news_id, ADULT_NEWS.id))
      .where(eq(SAVED_NEWS.user_folder_id, folderId))
      .orderBy(desc(SAVED_NEWS.saved_at));
    
    return NextResponse.json(
      { 
        folder: folder[0],
        savedNews 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching folder news:", error);
    return NextResponse.json(
      { message: "Error fetching folder news", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Add news to folder (for future use)
export async function POST(req, { params }) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const folderId = parseInt(params.folderId);
  
  try {
    const { newsId } = await req.json();
    
    // Validate input
    if (!newsId) {
      return NextResponse.json(
        { message: "News ID is required" },
        { status: 400 }
      );
    }
    
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
    
    // Check if news exists
    const news = await db
      .select()
      .from(ADULT_NEWS)
      .where(eq(ADULT_NEWS.id, newsId))
      .limit(1);
    
    if (news.length === 0) {
      return NextResponse.json(
        { message: "News article not found" },
        { status: 404 }
      );
    }
    
    // Check if news is already saved in this folder
    const existingSave = await db
      .select()
      .from(SAVED_NEWS)
      .where(
        and(
          eq(SAVED_NEWS.user_folder_id, folderId),
          eq(SAVED_NEWS.news_id, newsId)
        )
      )
      .limit(1);
    
    if (existingSave.length > 0) {
      return NextResponse.json(
        { message: "News article is already saved in this folder" },
        { status: 409 }
      );
    }
    
    // Save news to folder
    const [savedNews] = await db
      .insert(SAVED_NEWS)
      .values({
        user_folder_id: folderId,
        news_id: newsId,
      })
      .returning();
    
    return NextResponse.json(
      { 
        message: "News saved to folder successfully",
        savedNews 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving news to folder:", error);
    return NextResponse.json(
      { message: "Error saving news to folder", details: error.message },
      { status: 500 }
    );
  }
}