// /api/user-debates/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import axios from "axios";
import {
  USER_CUSTOM_DEBATES,
  USER_CUSTOM_DEBATE_MESSAGES,
  USER_CUSTOM_DEBATE_REPORTS,
  USER_CUSTOM_DEBATE_USAGE,
  USER_DETAILS,
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, and, desc, count } from "drizzle-orm";

// Generate AI opening statement for new debate
async function generateAIOpeningStatement(topic, aiPosition, userPosition) {
  const prompt = `You are participating in a custom debate about: "${topic}"

Your position: ${aiPosition}
Opponent's position: ${userPosition}

As the AI debater taking the "${aiPosition}" stance, provide a strong opening statement (2-3 sentences) that:
1. Clearly states your position
2. Presents your strongest initial argument
3. Challenges the opposing view professionally
4. Sets an engaging tone for the debate

Keep it under 300 characters and be persuasive but respectful.`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating AI opening statement:", error);
    return `I strongly believe in the ${aiPosition} position on ${topic}. Let me present compelling evidence for why this perspective is correct.`;
  }
}

// Generate debate report using OpenAI
async function generateDebateReport(debate, messages) {
  const userMessages = messages.filter((m) => m.sender === "user");
  const aiMessages = messages.filter((m) => m.sender === "ai");

  const prompt = `
    Analyze this custom debate and provide a comprehensive report:
    
    Topic: "${debate.title}"
    User's Position: "${debate.user_position_title}"
    AI's Position: "${debate.ai_position_title}"
    
    User's arguments:
    ${userMessages.map((m, i) => `${i + 1}. ${m.content}`).join("\n")}
    
    AI's arguments:
    ${aiMessages.map((m, i) => `${i + 1}. ${m.content}`).join("\n")}
    
    Please provide a detailed analysis in the following JSON format:
    {
      "overall_analysis": "Comprehensive overview of the debate performance and quality (3-4 sentences)",
      "strengths": "Specific strengths in argumentation, evidence use, and debate tactics (2-3 sentences)", 
      "improvements": "Areas for improvement in debate skills and argument construction (2-3 sentences)",
      "insights": "Key insights about debate style and recommendations for future debates (2-3 sentences)",
      "argument_quality_score": <number between 1-10>,
      "persuasiveness_score": <number between 1-10>,
      "factual_accuracy_score": <number between 1-10>,
      "logical_consistency_score": <number between 1-10>,
      "winner": "<user|ai|tie> - who presented the stronger case overall"
    }
    
    Focus on constructive feedback that helps improve debate and critical thinking skills.
  `;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
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

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error generating debate report:", error);
    return {
      overall_analysis: "You engaged in a thoughtful custom debate, presenting your arguments clearly and responding to counterpoints on your chosen topic.",
      strengths: "You demonstrated good engagement with your chosen topic and showed commitment to your position throughout the debate.",
      improvements: "Consider incorporating more specific examples and evidence to strengthen your arguments in future custom debates.",
      insights: "Your debate style shows potential. Continue practicing with various topics to develop even stronger analytical and persuasive skills.",
      argument_quality_score: 7,
      persuasiveness_score: 6,
      factual_accuracy_score: 7,
      logical_consistency_score: 7,
      winner: "tie",
    };
  }
}

// GET - List user's debates
export async function GET(request) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;

  try {
    // Get user's debates with message counts
    const debates = await db
      .select({
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
      })
      .from(USER_CUSTOM_DEBATES)
      .where(eq(USER_CUSTOM_DEBATES.user_id, userId))
      .orderBy(desc(USER_CUSTOM_DEBATES.updated_at))
      .execute();

    // Get report status for each debate
    const debatesWithReports = await Promise.all(debates.map(async (debate) => {
      const reportExists = await db
        .select({ count: count() })
        .from(USER_CUSTOM_DEBATE_REPORTS)
        .where(eq(USER_CUSTOM_DEBATE_REPORTS.debate_id, debate.id))
        .execute();

      return {
        ...debate,
        has_report: reportExists[0].count > 0,
        progress_percentage: Math.round((debate.conversation_count / debate.max_conversations) * 100),
        is_completed: debate.status === 'completed',
        can_continue: debate.status === 'active' && debate.conversation_count < debate.max_conversations
      };
    }));

    return NextResponse.json({
      success: true,
      data: debatesWithReports,
      count: debates.length
    });

  } catch (error) {
    console.error("Error fetching user debates:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch debates",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - Create new debate
export async function POST(request) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;

  const { title, user_position_title, ai_position_title } = await request.json();

  if (!title?.trim() || !user_position_title?.trim() || !ai_position_title?.trim()) {
    return NextResponse.json(
      { error: "Title, user position, and AI position are required." },
      { status: 400 }
    );
  }

  try {
    // Check user plan - only Elite users can create custom debates
    const userInfo = await db
      .select({ plan: USER_DETAILS.plan })
      .from(USER_DETAILS)
      .where(eq(USER_DETAILS.id, userId))
      .limit(1)
      .execute();

    const userPlan = userInfo[0]?.plan || "starter";

    if (userPlan !== "elite") {
      return NextResponse.json(
        { error: "Custom Debate feature is only available for Elite members." },
        { status: 403 }
      );
    }

    // Check usage limits (optional - can implement daily limits)
    const dailyLimit = 10; // Elite users can create 10 custom debates per day
    const now = new Date();

    let usage = await db
      .select()
      .from(USER_CUSTOM_DEBATE_USAGE)
      .where(eq(USER_CUSTOM_DEBATE_USAGE.user_id, userId))
      .limit(1)
      .execute();

    if (usage.length === 0) {
      await db.insert(USER_CUSTOM_DEBATE_USAGE).values({
        user_id: userId,
        debates_created_today: 1,
        debates_created_this_month: 1,
        last_reset_date: now,
      });
    } else {
      const lastResetDate = new Date(usage[0].last_reset_date);
      const isToday = lastResetDate.getFullYear() === now.getFullYear() &&
                     lastResetDate.getMonth() === now.getMonth() &&
                     lastResetDate.getDate() === now.getDate();

      // Uncomment this to enforce daily limits
      // if (isToday && usage[0].debates_created_today >= dailyLimit) {  
      //   return NextResponse.json(
      //     { error: `Daily limit reached. Elite members can create ${dailyLimit} custom debates per day.` },
      //     { status: 429 }
      //   );
      // }

      await db
        .update(USER_CUSTOM_DEBATE_USAGE)
        .set({
          debates_created_today: isToday ? usage[0].debates_created_today + 1 : 1,
          debates_created_this_month: isToday ? (usage[0].debates_created_this_month || 0) + 1 : 1,
          last_reset_date: now,
        })
        .where(eq(USER_CUSTOM_DEBATE_USAGE.id, usage[0].id))
        .execute();
    }

    // Create new debate
    const debateData = {
      user_id: userId,
      title: title.trim(),
      user_position_title: user_position_title.trim(),
      ai_position_title: ai_position_title.trim(),
      status: "active",
      conversation_count: 0,
      max_conversations: 5,
    };

    const insertResult = await db.insert(USER_CUSTOM_DEBATES).values(debateData).execute();
    const debateId = insertResult[0].insertId;

    // Generate AI's opening statement
    const openingStatement = await generateAIOpeningStatement(
      title,
      ai_position_title,
      user_position_title
    );

    // Save AI's opening message
    const aiOpeningMessage = {
      debate_id: debateId,
      sender: "ai",
      content: openingStatement,
      conversation_turn: 0,
    };

    const messageResult = await db.insert(USER_CUSTOM_DEBATE_MESSAGES).values(aiOpeningMessage).execute();

    return NextResponse.json({
      success: true,
      data: {
        debate: {
          id: debateId,
          ...debateData,
          created_at: new Date(),
          updated_at: new Date(),
          completed_at: null,
        },
        opening_message: {
          id: messageResult[0].insertId,
          ...aiOpeningMessage,
          created_at: new Date(),
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating custom debate:", error);
    return NextResponse.json(
      {
        error: "Failed to create debate",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}