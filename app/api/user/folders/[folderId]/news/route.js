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
    
    // Fetch all saved news in this folder with news details and grouped perspectives
    const savedNews = await db
      .select({
        id: SAVED_NEWS.id,
        saved_at: SAVED_NEWS.saved_at,
        note: SAVED_NEWS.note,
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
          group_id: ADULT_NEWS.news_group_id,
        }
      })
      .from(SAVED_NEWS)
      .innerJoin(ADULT_NEWS, eq(SAVED_NEWS.news_id, ADULT_NEWS.id))
      .where(eq(SAVED_NEWS.user_folder_id, folderId))
      .orderBy(desc(SAVED_NEWS.saved_at));

      console.log("savedNews", savedNews)

    // Get all perspectives for each news item
    const newsWithPerspectives = await Promise.all(
      savedNews.map(async (savedItem) => {
        if (savedItem.news.group_id) {
          // Get all news articles in the same group
          const allPerspectives = await db
            .select({
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
              group_id: ADULT_NEWS.news_group_id,
            })
            .from(ADULT_NEWS)
            .where(eq(ADULT_NEWS.news_group_id, savedItem.news.group_id))
            .orderBy(ADULT_NEWS.viewpoint);
          
          return {
            ...savedItem,
            allPerspectives
          };
        } else {
          // If no group, just return the single news item as the only perspective
          return {
            ...savedItem,
            allPerspectives: [savedItem.news]
          };
        }
      })
    );

    console.log("newsWithPerspectives", newsWithPerspectives)

    return NextResponse.json(
      { 
        folder: folder[0],
        savedNews: newsWithPerspectives 
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
