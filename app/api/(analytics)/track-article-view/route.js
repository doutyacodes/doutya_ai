import { db } from "@/utils";
import { ARTICLE_VIEWS } from "@/utils/analyticsSchema"; // Import your table definition
import { and, eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { articleId, timeOnPage, sessionId } = await req.json();

    // Check if the session already exists for the article
    const [existingView] = await db
      .select()
      .from(ARTICLE_VIEWS)
      .where(
        and(
          eq(ARTICLE_VIEWS.article_id, articleId),
          eq(ARTICLE_VIEWS.session_id, sessionId)
        )
      );

    if (existingView) {
      // Update the record
      await db
        .update(ARTICLE_VIEWS)
        .set({
          views: existingView.views + 1,
          engagement_time: existingView.engagement_time + timeOnPage,
        })
        .where(eq(ARTICLE_VIEWS.id, existingView.id));
    } else {
      // Insert a new record
      await db.insert(ARTICLE_VIEWS).values({
        article_id: articleId,
        session_id: sessionId,
        views: 1,
        engagement_time: timeOnPage,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error tracking article view:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
