// /api/trending/route.js
import { NextResponse } from "next/server";
import { db } from "@/utils";
import {
  SAVED_NEWS,
  USER_FOLDERS,
  USER_DETAILS,
  ADULT_NEWS,
  EXAM_TYPES,
  NEWS_CATEGORIES,
} from "@/utils/schema";
import { eq, desc, count, and, gte, sql } from "drizzle-orm";
import { authenticate } from "@/lib/jwtMiddleware";
export async function GET(req) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  try {
    // Get user's plan and exam type
    const user = await db
      .select({
        plan: USER_DETAILS.plan,
        exam_type_id: USER_DETAILS.exam_type_id,
        exam_type_name: EXAM_TYPES.name,
      })
      .from(USER_DETAILS)
      .leftJoin(EXAM_TYPES, eq(USER_DETAILS.exam_type_id, EXAM_TYPES.id))
      .where(eq(USER_DETAILS.id, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const userPlan = user[0].plan;
    const userExamTypeId = user[0].exam_type_id;
    const examTypeName = user[0].exam_type_name;

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get("sort") || "most_saved";
    const timeFilter = searchParams.get("time_filter") || "all_time";
    const selectedExamTypeId = searchParams.get("exam_type_id"); // For filtering

    // Always get all available exam types for display
    const availableExamTypes = await db
      .select({
        id: EXAM_TYPES.id,
        name: EXAM_TYPES.name,
      })
      .from(EXAM_TYPES);

    // Determine filtering logic based on plan and selected exam type
    let filterExamTypeId = null;
    let displayExamTypeName = "All Exams";
    let canAccessFilter = true;

    if (selectedExamTypeId && selectedExamTypeId !== "all") {
      const requestedExamTypeId = parseInt(selectedExamTypeId);

      switch (userPlan) {
        case "starter":
          // Starter can only access "All" - reject other filters
          canAccessFilter = false;
          filterExamTypeId = null;
          displayExamTypeName = "All Exams";
          break;

        case "pro":
          // Pro can only access their own exam type or "All"
          if (requestedExamTypeId === userExamTypeId) {
            filterExamTypeId = requestedExamTypeId;
            const examType = availableExamTypes.find(
              (et) => et.id === requestedExamTypeId
            );
            displayExamTypeName = examType?.name || "Unknown Exam";
            canAccessFilter = true;
          } else {
            // Invalid request for Pro user - default to "All"
            canAccessFilter = false;
            filterExamTypeId = null;
            displayExamTypeName = "All Exams";
          }
          break;

        case "elite":
          // Elite can access any exam type
          filterExamTypeId = requestedExamTypeId;
          const examType = availableExamTypes.find(
            (et) => et.id === requestedExamTypeId
          );
          displayExamTypeName = examType?.name || "Unknown Exam";
          canAccessFilter = true;
          break;
      }
    } else {
      // Default to "All" for all plans
      filterExamTypeId = null;
      displayExamTypeName = "All Exams";
      canAccessFilter = true;
    }

    // Calculate date filter for time-based queries
    let dateFilter = null;
    const now = new Date();

    switch (timeFilter) {
      case "today":
        dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "this_week":
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "this_month":
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = null;
    }

    // Build the main query to get trending news with save counts
    let baseQuery = db
      .select({
        news_id: SAVED_NEWS.news_id,
        save_count: count(SAVED_NEWS.id).as("save_count"),
        recent_saves:
          sql`COUNT(CASE WHEN ${SAVED_NEWS.saved_at} >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END)`.as(
            "recent_saves"
          ),
        latest_save: sql`MAX(${SAVED_NEWS.saved_at})`.as("latest_save"),
        group_id: ADULT_NEWS.news_group_id,
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
          group_id: ADULT_NEWS.news_group_id,
        },
      })
      .from(SAVED_NEWS)
      .innerJoin(ADULT_NEWS, eq(SAVED_NEWS.news_id, ADULT_NEWS.id))
      .groupBy(SAVED_NEWS.news_id, ADULT_NEWS.id);

    // Apply filters
    let whereConditions = [];

    // Apply exam type filter if specified (null means all exams)
    if (filterExamTypeId) {
      whereConditions.push(eq(SAVED_NEWS.exam_type_id, filterExamTypeId));
    }

    // Apply date filter if specified
    if (dateFilter) {
      whereConditions.push(gte(SAVED_NEWS.saved_at, dateFilter));
    }

    // Apply where conditions
    if (whereConditions.length > 0) {
      baseQuery = baseQuery.where(and(...whereConditions));
    }

    // Apply sorting
    switch (sortBy) {
      case "recent_trend":
        baseQuery = baseQuery.orderBy(
          desc(sql`recent_saves`),
          desc(sql`save_count`),
          desc(sql`latest_save`)
        );
        break;
      case "most_saved":
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
              group_id: ADULT_NEWS.news_group_id,
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
          all_perspectives: allPerspectives,
        };
      })
    );

    // Determine user's access permissions for each exam type
    const examTypePermissions = availableExamTypes.map((examType) => {
      let canAccess = false;

      switch (userPlan) {
        case "starter":
          canAccess = false; // Starter can't access specific exam filters
          break;
        case "pro":
          canAccess = examType.id === userExamTypeId; // Pro can only access their exam type
          break;
        case "elite":
          canAccess = true; // Elite can access all exam types
          break;
      }

      return {
        ...examType,
        canAccess,
      };
    });

    return NextResponse.json(
      {
        trending_news: newsWithPerspectives,
        user_plan: userPlan,
        user_exam_type_id: userExamTypeId,
        user_exam_type_name: examTypeName,
        current_filter_exam_type_id: filterExamTypeId,
        current_filter_exam_type_name: displayExamTypeName,
        available_exam_types: examTypePermissions,
        can_access_current_filter: canAccessFilter,
        total_count: newsWithPerspectives.length,
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
