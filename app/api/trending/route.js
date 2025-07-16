// /api/trending/route.js
import { NextResponse } from 'next/server';
import { db } from '@/utils';
import { 
  SAVED_NEWS, 
  USER_FOLDERS, 
  USER_DETAILS, 
  ADULT_NEWS, 
  EXAM_TYPES,
  NEWS_CATEGORIES 
} from '@/utils/schema';
import { eq, desc, count, and, gte, sql } from 'drizzle-orm';
import { authenticate } from '@/lib/jwtMiddleware';

export async function GET(req) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  
  try {
    // Get user's exam type
    const user = await db
      .select({
        exam_type_id: USER_DETAILS.exam_type_id,
        exam_type_name: EXAM_TYPES.name
      })
      .from(USER_DETAILS)
      .leftJoin(EXAM_TYPES, eq(USER_DETAILS.exam_type_id, EXAM_TYPES.id))
      .where(eq(USER_DETAILS.id, userId))
      .limit(1);

    if (!user.length || !user[0].exam_type_id) {
      return NextResponse.json(
        { message: "User exam type not found" },
        { status: 400 }
      );
    }

    const userExamTypeId = user[0].exam_type_id;
    const examTypeName = user[0].exam_type_name;

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get('sort') || 'most_saved';
    const timeFilter = searchParams.get('time_filter') || 'all_time';

    // Calculate date filter for time-based queries
    let dateFilter = null;
    const now = new Date();
    
    switch (timeFilter) {
      case 'today':
        dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'this_week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'this_month':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = null;
    }

    // Build the main query to get trending news with save counts
    let baseQuery = db
      .select({
        news_id: SAVED_NEWS.news_id,
        save_count: count(SAVED_NEWS.id).as('save_count'),
        recent_saves: sql`COUNT(CASE WHEN ${SAVED_NEWS.saved_at} >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END)`.as('recent_saves'),
        latest_save: sql`MAX(${SAVED_NEWS.saved_at})`.as('latest_save'),
        group_id: ADULT_NEWS.news_group_id, // Add group_id for fetching perspectives
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
          group_id: ADULT_NEWS.news_group_id
        }
      })
      .from(SAVED_NEWS)
      .innerJoin(ADULT_NEWS, eq(SAVED_NEWS.news_id, ADULT_NEWS.id))
      .where(eq(SAVED_NEWS.exam_type_id, userExamTypeId))
      .groupBy(SAVED_NEWS.news_id, ADULT_NEWS.id);

    // Apply date filter if specified
    if (dateFilter) {
      baseQuery = baseQuery.where(
        and(
          eq(SAVED_NEWS.exam_type_id, userExamTypeId),
          gte(SAVED_NEWS.saved_at, dateFilter)
        )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent_trend':
        baseQuery = baseQuery.orderBy(
          desc(sql`recent_saves`),
          desc(sql`save_count`),
          desc(sql`latest_save`)
        );
        break;
      case 'most_saved':
      default:
        baseQuery = baseQuery.orderBy(
          desc(sql`save_count`),
          desc(sql`recent_saves`),
          desc(sql`latest_save`)
        );
        break;
    }

    // Limit to top 100
    baseQuery = baseQuery.limit(100);

    const trendingNews = await baseQuery;

    // Get all perspectives for each news group
    const newsWithPerspectives = await Promise.all(
      trendingNews.map(async (item) => {
        let allPerspectives = [item.news];
        
        // If the news has a group_id, fetch all perspectives in that group
        if (item.news.group_id) {
          const perspectivesQuery = await db
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
              group_id: ADULT_NEWS.news_group_id
            })
            .from(ADULT_NEWS)
            .where(eq(ADULT_NEWS.news_group_id, item.news.group_id))
            .orderBy(ADULT_NEWS.viewpoint);
          
          if (perspectivesQuery.length > 1) {
            allPerspectives = perspectivesQuery;
          }
        }

        return {
          news: item.news,
          save_count: item.save_count,
          recent_saves: item.recent_saves,
          latest_save: item.latest_save,
          all_perspectives: allPerspectives
        };
      })
    );

    return NextResponse.json(
      { 
        trending_news: newsWithPerspectives,
        exam_type: examTypeName,
        total_count: newsWithPerspectives.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching trending news:", error);
    return NextResponse.json(
      { message: "Error fetching trending news", details: error.message },
      { status: 500 }
    );
  }
}