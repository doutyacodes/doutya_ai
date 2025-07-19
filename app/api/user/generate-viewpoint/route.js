import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import axios from "axios";
import { 
  PROMPT_HISTORY, 
  USER_NEWS, 
  USER_DETAILS, 
  ADULT_NEWS
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, and, desc } from "drizzle-orm";

export async function POST(request) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const { newsId, viewpoint } = await request.json();

  if (!newsId || !viewpoint?.trim()) {
    return NextResponse.json(
      { error: "News ID and viewpoint are required." },
      { status: 400 }
    );
  }

  try {
    // Get news group ID from the news ID
    const newsResult = await db
      .select({ news_group_id: ADULT_NEWS.news_group_id })
      .from(ADULT_NEWS)
      .where(eq(ADULT_NEWS.id, newsId))
      .limit(1)
      .execute();

    if (newsResult.length === 0) {
      return NextResponse.json(
        { error: "News article not found." },
        { status: 404 }
      );
    }

    const newsGroupId = newsResult[0].news_group_id;

    if (!newsGroupId) {
      return NextResponse.json(
        { error: "Invalid news group." },
        { status: 400 }
      );
    }

    // Check if user has Elite plan
    const userInfo = await db
      .select({ plan: USER_DETAILS.plan })
      .from(USER_DETAILS)
      .where(eq(USER_DETAILS.id, userId))
      .limit(1)
      .execute();

    const userPlan = userInfo[0]?.plan || 'starter';

    if (userPlan !== 'elite') {
      return NextResponse.json(
        { error: "Elite plan required to create custom viewpoints." },
        { status: 403 }
      );
    }

    // Check current user viewpoint count for this news group
    const existingUserNews = await db
      .select()
      .from(USER_NEWS)
      .where(and(
        eq(USER_NEWS.news_group_id, newsGroupId),
        eq(USER_NEWS.user_id, userId)
      ))
      .execute();

    if (existingUserNews.length >= 3) {
      return NextResponse.json(
        { error: "Maximum of 3 custom viewpoints allowed per article." },
        { status: 400 }
      );
    }

    // Check if viewpoint already exists for this user and news group
    const existingViewpoint = existingUserNews.find(
      item => item.viewpoint?.toLowerCase() === viewpoint.trim().toLowerCase()
    );

    if (existingViewpoint) {
      return NextResponse.json(
        { error: "You already have a viewpoint with this name for this article." },
        { status: 400 }
      );
    }

    // Find existing prompt history for this news group
    const promptHistory = await db
      .select()
      .from(PROMPT_HISTORY)
      .where(eq(PROMPT_HISTORY.news_id, newsGroupId))
      .orderBy(desc(PROMPT_HISTORY.created_at))
      .limit(1)
      .execute();

    if (promptHistory.length === 0) {
      return NextResponse.json(
        { error: "No prompt history found for this article." },
        { status: 404 }
      );
    }

    const promptData = promptHistory[0];
    const { original_title, original_description } = promptData;

    // Create OpenAI prompt for single viewpoint
    const prompt = `
      Based on the following news:
      Title: "${original_title}"
      Description: "${original_description}"

      Rewrite this news for the specified viewpoint: ${viewpoint.trim()}.
      The viewpoint should have:
        1. A unique and engaging title tailored to that perspective.
        2. A rewritten description in the third person, composed of multiple paragraphs, following a structured news reporting format:
          - Provide a clear and concise summary of the news, highlighting the most important details.
          - Expand on the details, presenting background information, context, and relevant perspectives aligned with the specified viewpoint. Use an engaging tone while maintaining objectivity and cultural relevance.
          - Use the data provided in the input as the primary source, but if any details appear missing or incomplete, fill them in using your broader knowledge of the topic. Ensure these additions are minimal, relevant, and only included if necessary to enhance the description.
        3. Think like a journalist when crafting the description, ensuring the language and details reflect the style of professional reporting.
        4. Align the tone, focus, and language to suit the cultural, social, or contextual nuances of the viewpoint, ensuring relevance and resonance with the intended audience.
        5. The description must contain approximately 2100 characters to ensure depth and detail.
        6. Maintain factual accuracy and objectivity throughout the description.

      Respond in JSON format:
      {
        "viewpoint": "${viewpoint.trim()}",
        "title": "<title for viewpoint>",
        "description": "<description for viewpoint>"
      }
    `;

    // Make OpenAI API call
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let responseText = response.data.choices[0].message.content.trim();
    responseText = responseText.replace(/```json|```/g, "").trim();

    console.log("OpenAI Response:", responseText);

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      return NextResponse.json(
        { error: "Failed to generate viewpoint content. Please try again." },
        { status: 500 }
      );
    }

    // Validate response structure
    if (!parsedData.title || !parsedData.description || !parsedData.viewpoint) {
      return NextResponse.json(
        { error: "Invalid response from AI. Please try again." },
        { status: 500 }
      );
    }

    // Get the first category ID from the original prompt history
    const categoryIds = Array.isArray(promptData.category_ids) 
      ? promptData.category_ids 
      : JSON.parse(promptData.category_ids || '[]');
    
    const firstCategoryId = categoryIds[0] || 1; // Default category if none found

    // Get image URL from existing news in the group
    const existingNews = await db
      .select({ image_url: ADULT_NEWS.image_url })
      .from(ADULT_NEWS)
      .where(eq(ADULT_NEWS.news_group_id, newsGroupId))
      .limit(1)
      .execute();

    const imageUrl = existingNews[0]?.image_url || 'default-news.jpg';

    // Save to USER_NEWS table
    const userNewsData = {
      news_category_id: firstCategoryId,
      title: parsedData.title,
      image_url: imageUrl,
      summary: parsedData.description.substring(0, 200) + '...', // Create summary from description
      description: parsedData.description,
      viewpoint: parsedData.viewpoint,
      news_group_id: newsGroupId,
      user_id: userId,
      show_date: new Date(),
    };

    const insertResult = await db
      .insert(USER_NEWS)
      .values(userNewsData)
      .execute();

    const userNewsId = insertResult[0].insertId;

    return NextResponse.json(
      {
        success: true,
        message: "Custom viewpoint created successfully",
        data: {
          id: userNewsId,
          ...userNewsData,
          user_created: true
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error generating custom viewpoint:", error);
    
    // Handle specific OpenAI API errors
    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again in a moment." },
        { status: 429 }
      );
    }
    
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: "AI service configuration error. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to generate custom viewpoint", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}