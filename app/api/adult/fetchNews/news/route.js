import { NextResponse } from "next/server";
import { db } from "@/utils";
import { 
  ADULT_NEWS, 
  NEWS_CATEGORIES, 
  USER_NEWS, 
  USER_DETAILS 
} from "@/utils/schema";
import { and, asc, desc, eq, gt, gte, lt, ne, sql } from "drizzle-orm";
import { authenticate } from "@/lib/jwtMiddleware";

export async function POST(req) {
  // Try to authenticate user, but don't require it
  let userId = null;
  let userPlan = 'starter';
  
  try {
    const authResult = await authenticate(req);
    if (authResult.authenticated) {
      const userData = authResult.decoded_Data;
      userId = userData.id;
      
      // Get user plan info if authenticated
      const userInfo = await db
        .select({ plan: USER_DETAILS.plan })
        .from(USER_DETAILS)
        .where(eq(USER_DETAILS.id, userId))
        .limit(1)
        .execute();

      userPlan = userInfo[0]?.plan || 'starter';
    }
  } catch (error) {
    // If authentication fails, continue as guest user
    console.log("No authentication or invalid token, continuing as guest");
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "News ID is required." },
      { status: 400 }
    );
  }

  try {
    // Fetch the specific news item to get its news_group_id
    const originalNews = await db
      .select()
      .from(ADULT_NEWS)
      .where(eq(ADULT_NEWS.id, id))
      .execute();

    if (originalNews.length === 0) {
      return NextResponse.json(
        { error: "Original news not found." },
        { status: 404 }
      );
    }

    const { news_group_id } = originalNews[0];

    // Fetch all news with the same news_group_id
    const newsArticleResults = await db
      .select()
      .from(ADULT_NEWS)
      .leftJoin(NEWS_CATEGORIES, eq(ADULT_NEWS.news_category_id, NEWS_CATEGORIES.id))
      .where(eq(ADULT_NEWS.news_group_id, news_group_id))
      .execute();

    if (newsArticleResults.length === 0) {
      return NextResponse.json(
        { error: "No related news found for the given group." },
        { status: 404 }
      );
    }

    // Process regular news articles manually to avoid circular references
    const regularNewsArticles = newsArticleResults.map(result => ({
      id: result.adult_news.id,
      title: result.adult_news.title,
      description: result.adult_news.description,
      category: result.news_categories?.name || 'General',
      news_category_id: result.adult_news.news_category_id,
      image_url: result.adult_news.image_url,
      summary: result.adult_news.summary,
      viewpoint: result.adult_news.viewpoint,
      media_type: result.adult_news.media_type,
      created_at: result.adult_news.created_at,
      updated_at: result.adult_news.updated_at,
      user_created: false,
    }));

    // Fetch user's custom viewpoints if Elite user and authenticated
    let customNewsArticles = [];
    let userNewsCount = 0;
    
    if (userId && userPlan === 'elite') {
      try {
        const userCustomNewsResults = await db
          .select()
          .from(USER_NEWS)
          .leftJoin(NEWS_CATEGORIES, eq(USER_NEWS.news_category_id, NEWS_CATEGORIES.id))
          .where(and(
            eq(USER_NEWS.news_group_id, news_group_id),
            eq(USER_NEWS.user_id, userId)
          ))
          .execute();

        // Process user custom news articles manually
        customNewsArticles = userCustomNewsResults.map(result => ({
          id: result.user_news.id,
          title: result.user_news.title,
          description: result.user_news.description,
          category: result.news_categories?.name || 'General',
          news_category_id: result.user_news.news_category_id,
          image_url: result.user_news.image_url,
          summary: result.user_news.summary,
          viewpoint: result.user_news.viewpoint,
          media_type: 'image', // User news is always image for now
          created_at: result.user_news.created_at,
          updated_at: result.user_news.updated_at,
          user_created: true,
          is_relevant: result.user_news.is_relevant,
          relevance_reason: result.user_news.relevance_reason,
        }));

        userNewsCount = customNewsArticles.length;
      } catch (error) {
        console.error("Error fetching user custom news:", error);
        // Continue without custom news if there's an error
      }
    }

    // Combine all articles (regular + custom)
    const allArticles = [...regularNewsArticles, ...customNewsArticles];

    // Your existing navigation logic for next/previous news
    // Fetch the next news group ID (greater than current news_group_id)
    let nextNewsGroup = await db
      .select({ id: ADULT_NEWS.id, title: ADULT_NEWS.title })
      .from(ADULT_NEWS)
      .where(lt(ADULT_NEWS.news_group_id, news_group_id)) // Looking for the previous group
      .orderBy(desc(ADULT_NEWS.id)) // Get the most recent news in the previous group
      .limit(1)
      .execute();

    // If the next news group doesn't exist, fetch the most recent news (newest article)
    if (nextNewsGroup.length === 0) {
      nextNewsGroup = await db
        .select({ id: ADULT_NEWS.id, title: ADULT_NEWS.title })
        .from(ADULT_NEWS)
        .orderBy(desc(ADULT_NEWS.id)) // Get the most recent news (newest article)
        .limit(1)
        .execute();
    }

    // Fetch the previous news group ID (less than current news_group_id)
    let prevNewsGroup = await db
      .select({ id: ADULT_NEWS.id, title: ADULT_NEWS.title })
      .from(ADULT_NEWS)
      .where(gt(ADULT_NEWS.news_group_id, news_group_id)) // Looking for the next group
      .orderBy(asc(ADULT_NEWS.id)) // Get the first news in the next group
      .limit(1) // Only fetch the first news item
      .execute();

    console.log("previousgroup", prevNewsGroup);

    // Step 2: If still no article, find the earliest article from the most recent day
    if (prevNewsGroup.length === 0) {
      console.log("No news in the last 24 hours. Fetching the earliest article from the most recent day...");

      // Get the latest update day excluding the current article
      const latestUpdateDayResult = await db
        .select({ latest_date: sql`DATE(MAX(${ADULT_NEWS.updated_at}))` })
        .from(ADULT_NEWS)
        .where(
          and(
            ne(ADULT_NEWS.news_group_id, news_group_id) // Exclude the current group
          )
        )
        .execute();

      const latestUpdateDay = latestUpdateDayResult[0]?.latest_date;

      console.log("Latest update day:", latestUpdateDay);

      // Fetch the first article from that day
      if (latestUpdateDay) {
        prevNewsGroup = await db
          .select({ id: ADULT_NEWS.id, title: ADULT_NEWS.title, updated_at: ADULT_NEWS.updated_at })
          .from(ADULT_NEWS)
          .where(
            and(
              sql`DATE(${ADULT_NEWS.updated_at}) = ${latestUpdateDay}`, // Match the date
              ne(ADULT_NEWS.news_group_id, news_group_id) // Exclude the current group
            )
          )
          .orderBy(asc(ADULT_NEWS.updated_at)) // Get the earliest article
          .limit(1)
          .execute();
      }

      console.log("Second fallback result (earliest article from latest update day):", prevNewsGroup);
    }

    // Extract the next and previous news
    const nextNews = nextNewsGroup.length > 0 ? nextNewsGroup[0] : null;
    const prevNews = prevNewsGroup.length > 0 ? prevNewsGroup[0] : null;

    // Get category names for showNames
    const categoryNames = [...new Set(regularNewsArticles.map(article => article.category))]
      .filter(Boolean)
      .join(', ');

    // Format the response to include the related news, next news, and previous news
    const formattedResponse = {
      newsArticle: allArticles, // Combined regular and custom articles
      nextNews,    // Information about the first news in the next group, or the most recent news
      prevNews,    // Information about the last news in the previous group, or the oldest news
      // Elite user specific data
      userPlan: userPlan,
      userNewsCount: userNewsCount,
      hasElitePlan: userPlan === 'elite',
      news_group_id: news_group_id,
      isAuthenticated: userId !== null,
    };

    return NextResponse.json({ 
      newsData: formattedResponse,
      showNames: categoryNames 
    });
  } catch (error) {
    console.error("Error fetching related news:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching news." },
      { status: 500 }
    );
  }
}