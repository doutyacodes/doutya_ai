// /api/user/folders2/[...params]/route.js
import { NextResponse } from 'next/server';
import { 
  USER_FOLDERS, 
  SAVED_NEWS, 
  SAVED_DEBATES,
  ADULT_NEWS, 
  USER_CUSTOM_DEBATES 
} from '@/utils/schema';
import { eq, and, desc } from 'drizzle-orm';
import { authenticate } from '@/lib/jwtMiddleware';
import { db } from '@/utils';

// GET - Fetch folder details and filtered content based on route params
export async function GET(req, { params }) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  
  const routeParams = await params.params; // This will be an array like ['news', '123'] or ['debates', '123'] or ['123']
  
  let contentType = 'all'; // default
  let folderId;
  
  // Parse route parameters
  if (routeParams.length === 1) {
    // Route: /folders2/123 (show all content)
    folderId = parseInt(routeParams[0]);
    contentType = 'all';
  } else if (routeParams.length === 2) {
    // Route: /folders2/news/123 or /folders2/debates/123
    contentType = routeParams[0]; // 'news' or 'debates'
    folderId = parseInt(routeParams[1]);
  } else {
    return NextResponse.json(
      { message: "Invalid route parameters" },
      { status: 400 }
    );
  }

  if (!folderId || isNaN(folderId)) {
    return NextResponse.json(
      { message: "Invalid folder ID" },
      { status: 400 }
    );
  }

  if (!['all', 'news', 'debates'].includes(contentType)) {
    return NextResponse.json(
      { message: "Invalid content type. Must be 'all', 'news', or 'debates'" },
      { status: 400 }
    );
  }
  
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
    
    let allContent = [];
    let stats = { total: 0, news: 0, debates: 0 };

    // Fetch content based on contentType filter
    if (contentType === 'all' || contentType === 'news') {
      // Fetch saved news
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

      // Get all perspectives for news items
      const newsWithPerspectives = await Promise.all(
        savedNews.map(async (savedItem) => {
          const newsWithType = {
            ...savedItem,
            type: 'news'
          };

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
              ...newsWithType,
              allPerspectives
            };
          } else {
            // If no group, just return the single news item as the only perspective
            return {
              ...newsWithType,
              allPerspectives: [savedItem.news]
            };
          }
        })
      );

      allContent = [...allContent, ...newsWithPerspectives];
      stats.news = newsWithPerspectives.length;
    }

    if (contentType === 'all' || contentType === 'debates') {
      // Fetch saved debates
      const savedDebates = await db
        .select({
          id: SAVED_DEBATES.id,
          saved_at: SAVED_DEBATES.saved_at,
          note: SAVED_DEBATES.note,
          debate: {
            id: USER_CUSTOM_DEBATES.id,
            title: USER_CUSTOM_DEBATES.title,
            user_position_title: USER_CUSTOM_DEBATES.user_position_title,
            ai_position_title: USER_CUSTOM_DEBATES.ai_position_title,
            status: USER_CUSTOM_DEBATES.status,
            conversation_count: USER_CUSTOM_DEBATES.conversation_count,
            max_conversations: USER_CUSTOM_DEBATES.max_conversations,
            created_at: USER_CUSTOM_DEBATES.created_at,
            updated_at: USER_CUSTOM_DEBATES.updated_at,
            completed_at: USER_CUSTOM_DEBATES.completed_at,
          }
        })
        .from(SAVED_DEBATES)
        .innerJoin(USER_CUSTOM_DEBATES, eq(SAVED_DEBATES.debate_id, USER_CUSTOM_DEBATES.id))
        .where(eq(SAVED_DEBATES.user_folder_id, folderId))
        .orderBy(desc(SAVED_DEBATES.saved_at));

      // Add progress calculation for debates
      const debatesWithProgress = savedDebates.map(savedItem => ({
        ...savedItem,
        type: 'debate',
        debate: {
          ...savedItem.debate,
          progress_percentage: Math.round((savedItem.debate.conversation_count / savedItem.debate.max_conversations) * 100),
          is_completed: savedItem.debate.status === 'completed',
          can_continue: savedItem.debate.status === 'active' && savedItem.debate.conversation_count < savedItem.debate.max_conversations
        }
      }));

      allContent = [...allContent, ...debatesWithProgress];
      stats.debates = debatesWithProgress.length;
    }

    // Sort all content by saved_at
    allContent.sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at));
    
    stats.total = allContent.length;

    return NextResponse.json(
      { 
        folder: folder[0],
        content: allContent,
        contentType: contentType,
        stats: stats
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching folder content:", error);
    return NextResponse.json(
      { message: "Error fetching folder content", details: error.message },
      { status: 500 }
    );
  }
}