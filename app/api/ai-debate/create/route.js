// /api/ai-debate/create/route.js - Updated to handle both newsId and groupId
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import axios from "axios";
import {
  AI_DEBATE_ROOMS,
  AI_DEBATE_USAGE,
  AI_DEBATE_MESSAGES,
  USER_DETAILS,
  DEBATE_TOPICS,
  MC_DEBATE_RESPONSES,
  MC_DEBATE_OPTIONS,
  AI_CONVERSATIONS,
  ADULT_NEWS,
  ADULT_NEWS_GROUP,
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, and } from "drizzle-orm";

async function generateOpeningStatement(topic, aiPosition, userPosition) {
  const prompt = `You are participating in a formal debate about: "${topic}"

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
    console.error("Error generating opening statement:", error);
    return `I strongly believe in the ${aiPosition} position on ${topic}. Let me present compelling evidence for why this perspective is correct.`;
  }
}

// Function to resolve news group ID from either newsId or groupId
async function resolveNewsGroupId(newsId, groupId) {
  if (groupId) {
    // Direct group ID provided
    return parseInt(groupId);
  }
  
  if (newsId) {
    // Get group ID from news ID
    const newsArticle = await db
      .select({ news_group_id: ADULT_NEWS.news_group_id })
      .from(ADULT_NEWS)
      .where(eq(ADULT_NEWS.id, parseInt(newsId)))
      .limit(1)
      .execute();
    
    if (newsArticle.length > 0) {
      return newsArticle[0].news_group_id;
    }
  }
  
  throw new Error("Unable to determine news group ID");
}

// Function to get real AI vs AI conversations from database
async function getRealAIvsAI(newsGroupId) {
  try {
    // Find the debate topic associated with this news group
    const debateTopics = await db
      .select()
      .from(DEBATE_TOPICS)
      .where(eq(DEBATE_TOPICS.news_group_id, newsGroupId))
      .limit(1)
      .execute();

    if (!debateTopics.length) {
      throw new Error("No debate topic found for this news group");
    }

    const debateTopicId = debateTopics[0].id;

    // Get all AI conversations for this debate topic
    const conversations = await db
      .select()
      .from(AI_CONVERSATIONS)
      .where(eq(AI_CONVERSATIONS.debate_topic_id, debateTopicId))
      .execute();

    if (!conversations.length) {
      throw new Error("No AI conversations found for this debate topic");
    }

    // Transform the data to match your expected format
    const formattedConversations = [];
    
    conversations.forEach(conv => {
      // Add "for" message
      formattedConversations.push({
        id: `${conv.id}_for`,
        sender: "ai_1",
        content: conv.for_message,
        conversation_round: conv.conversation_round,
        ai_persona: conv.for_ai_persona
      });
      
      // Add "against" message
      formattedConversations.push({
        id: `${conv.id}_against`,
        sender: "ai_2",
        content: conv.against_message,
        conversation_round: conv.conversation_round,
        ai_persona: conv.against_ai_persona
      });
    });

    // Sort by conversation round and sender to maintain proper order
    formattedConversations.sort((a, b) => {
      if (a.conversation_round !== b.conversation_round) {
        return a.conversation_round - b.conversation_round;
      }
      return a.sender.localeCompare(b.sender);
    });

    return formattedConversations;
  } catch (error) {
    console.error("Error fetching real AI vs AI conversations:", error);
    // Fallback to simulated data if real data fails
    return generateSimulatedAIvsAI("this topic");
  }
}

// Function to get real MCQ question from database
async function getRealMCQQuestion(newsGroupId, level = 1, parentResponseId = null) {
  try {
    // First, find the debate topic associated with this news group
    const debateTopics = await db
      .select()
      .from(DEBATE_TOPICS)
      .where(eq(DEBATE_TOPICS.news_group_id, newsGroupId))
      .limit(1)
      .execute();

    if (!debateTopics.length) {
      throw new Error("No debate topic found for this news group");
    }

    const debateTopicId = debateTopics[0].id;

    // Get the appropriate MCQ response based on level and parent
    let mcqResponse;
    
    if (level === 1) {
      // Get root level question
      mcqResponse = await db
        .select()
        .from(MC_DEBATE_RESPONSES)
        .where(
          and(
            eq(MC_DEBATE_RESPONSES.debate_topic_id, debateTopicId),
            eq(MC_DEBATE_RESPONSES.level, 1),
            eq(MC_DEBATE_RESPONSES.parent_response_id, null)
          )
        )
        .limit(1)
        .execute();
    } else {
      // Get specific response by ID for subsequent levels
      mcqResponse = await db
        .select()
        .from(MC_DEBATE_RESPONSES)
        .where(eq(MC_DEBATE_RESPONSES.id, parentResponseId))
        .limit(1)
        .execute();
    }

    if (!mcqResponse.length) {
      throw new Error(`No MCQ question found for level ${level}`);
    }

    const response = mcqResponse[0];

    // Get the options for this response
    const options = await db
      .select()
      .from(MC_DEBATE_OPTIONS)
      .where(eq(MC_DEBATE_OPTIONS.mc_response_id, response.id))
      .execute();

    return {
      id: response.id,
      question_text: `AI Response - Level ${response.level}`,
      ai_message: response.ai_message,
      ai_persona: response.ai_persona,
      level: response.level,
      debate_topic_id: debateTopicId,
      options: options.map((option, index) => ({
        id: option.id,
        option_text: option.option_text,
        option_letter: option.option_letter || String.fromCharCode(65 + index), // A, B, C...
        option_position: option.option_position,
        leads_to_response_id: option.leads_to_response_id,
        is_terminal: option.is_terminal
      }))
    };
  } catch (error) {
    console.error("Error fetching real MCQ question:", error);
    // Fallback to simulated data if real data fails
    return generateSimulatedMCQ("this topic");
  }
}

// Simulated AI vs AI conversations for demo (fallback)
function generateSimulatedAIvsAI(topic) {
  return [
    {
      id: 1,
      sender: "ai_1",
      content: `I believe ${topic} presents significant opportunities that we should embrace thoughtfully.`,
      conversation_round: 1,
      ai_persona: "Progressive Analyst"
    },
    {
      id: 2,
      sender: "ai_2", 
      content: `While I understand that perspective, we must consider the potential risks and unintended consequences.`,
      conversation_round: 1,
      ai_persona: "Conservative Analyst"
    },
    {
      id: 3,
      sender: "ai_1",
      content: `The historical data shows that similar innovations have consistently led to positive outcomes when properly managed.`,
      conversation_round: 2,
      ai_persona: "Progressive Analyst"
    },
    {
      id: 4,
      sender: "ai_2",
      content: `However, we cannot ignore the cases where rapid adoption led to significant societal disruption.`,
      conversation_round: 2,
      ai_persona: "Conservative Analyst"
    },
    {
      id: 5,
      sender: "ai_1",
      content: `That's precisely why gradual implementation with proper safeguards is the optimal approach.`,
      conversation_round: 3,
      ai_persona: "Progressive Analyst"
    },
    {
      id: 6,
      sender: "ai_2",
      content: `I agree that safeguards are crucial, but we must ensure they are robust before proceeding.`,
      conversation_round: 3,
      ai_persona: "Conservative Analyst"
    }
  ];
}

// Simulated MCQ questions for demo (fallback)
function generateSimulatedMCQ(topic) {
  return {
    id: 1,
    question_text: `What is your primary concern regarding ${topic}?`,
    ai_message: `From my analysis, ${topic} presents both opportunities and challenges that require careful consideration.`,
    ai_persona: "Neutral Analyst",
    level: 1,
    options: [
      {
        id: 1,
        option_text: "The economic implications are most important",
        option_letter: "A",
        option_position: "economic"
      },
      {
        id: 2,
        option_text: "Social impacts should be our primary focus",
        option_letter: "B", 
        option_position: "social"
      },
      {
        id: 3,
        option_text: "Environmental considerations must come first",
        option_letter: "C",
        option_position: "environmental"
      }
    ]
  };
}

export async function POST(request) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const { 
    topic, 
    debateType = "user_vs_ai", 
    userPosition, 
    aiPosition, 
    newsId,
    groupId // New parameter for direct group ID
  } = await request.json();

  if (!topic?.trim()) {
    return NextResponse.json(
      { error: "Topic is required." },
      { status: 400 }
    );
  }

  try {
    // Check user plan - only Elite users can access debates
    const userInfo = await db
      .select({ plan: USER_DETAILS.plan })
      .from(USER_DETAILS)
      .where(eq(USER_DETAILS.id, userId))
      .limit(1)
      .execute();

    const userPlan = userInfo[0]?.plan || "starter";

    if (userPlan !== "elite") {
      return NextResponse.json(
        { error: "AI Debate feature is only available for Elite members." },
        { status: 403 }
      );
    }

    // Resolve news group ID
    const newsGroupId = await resolveNewsGroupId(newsId, groupId);

    // Check usage limits
    const dailyLimit = 5;
    const now = new Date();

    let usage = await db
      .select()
      .from(AI_DEBATE_USAGE)
      .where(eq(AI_DEBATE_USAGE.user_id, userId))
      .limit(1)
      .execute();

    if (usage.length === 0) {
      await db.insert(AI_DEBATE_USAGE).values({
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
      //     { error: `Daily limit reached. Elite members can create ${dailyLimit} debates per day.` },
      //     { status: 429 }
      //   );
      // }

      await db
        .update(AI_DEBATE_USAGE)
        .set({
          debates_created_today: isToday ? usage[0].debates_created_today + 1 : 1,
          debates_created_this_month: isToday ? (usage[0].debates_created_this_month || 0) + 1 : 1,
          last_reset_date: now,
        })
        .where(eq(AI_DEBATE_USAGE.id, usage[0].id))
        .execute();
    }

    let responseData = {
      success: true,
    };

    // Handle different debate types
    if (debateType === "user_vs_ai") {
      // Live generation for User vs AI
      if (!userPosition?.trim() || !aiPosition?.trim()) {
        return NextResponse.json(
          { error: "User position and AI position are required for user vs AI debates." },
          { status: 400 }
        );
      }

      const debateRoomData = {
        user_id: userId,
        topic: topic.trim(),
        debate_type: "user_vs_ai",
        user_position: userPosition.trim(),
        ai_position: aiPosition.trim(),
        status: "active",
        conversation_count: 0,
        max_conversations: 7,
        news_id: newsId || null,
      };

      const insertResult = await db.insert(AI_DEBATE_ROOMS).values(debateRoomData).execute();
      const debateRoomId = insertResult[0].insertId;

      // Generate AI's opening statement
      const openingStatement = await generateOpeningStatement(topic, aiPosition, userPosition);

      // Save AI's opening message
      const aiOpeningMessage = {
        debate_room_id: debateRoomId,
        sender: "ai",
        content: openingStatement,
        conversation_turn: 0,
      };

      await db.insert(AI_DEBATE_MESSAGES).values(aiOpeningMessage).execute();

      responseData.debate = {
        id: debateRoomId,
        ...debateRoomData,
        created_at: new Date(),
      };
      responseData.messages = [{ ...aiOpeningMessage, id: "opening", created_at: new Date() }];

    } else if (debateType === "ai_vs_ai") {
      // Use real AI vs AI content from database
      const debateRoomData = {
        user_id: userId,
        topic: topic.trim(),
        debate_type: "ai_vs_ai",
        user_position: "Observer", // Required field - set as observer
        ai_position: "Progressive stance", // Required field
        ai_position_2: "Conservative stance", // Optional but good to have
        status: "active",
        conversation_count: 0,
        max_conversations: 3, // This will be updated based on actual data
        news_id: newsId || null,
      };

      const insertResult = await db.insert(AI_DEBATE_ROOMS).values(debateRoomData).execute();
      const debateRoomId = insertResult[0].insertId;

      const realConversations = await getRealAIvsAI(newsGroupId);
      
      // Update max_conversations based on actual data
      const maxRounds = Math.max(...realConversations.map(c => c.conversation_round), 1);
      await db
        .update(AI_DEBATE_ROOMS)
        .set({ max_conversations: maxRounds })
        .where(eq(AI_DEBATE_ROOMS.id, debateRoomId))
        .execute();

      responseData.debate = {
        id: debateRoomId,
        ...debateRoomData,
        max_conversations: maxRounds,
        created_at: new Date(),
      };
      responseData.conversations = realConversations;

    } else if (debateType === "mcq") {
      // Use real MCQ content from database
      const debateRoomData = {
        user_id: userId,
        topic: topic.trim(),
        debate_type: "mcq",
        user_position: "Participant", // Required field - set as participant
        ai_position: "Decision Tree Guide", // Required field - descriptive name
        status: "active",
        conversation_count: 0,
        max_conversations: 5,
        total_questions: 5,
        news_id: newsId || null,
      };

      const insertResult = await db.insert(AI_DEBATE_ROOMS).values(debateRoomData).execute();
      const debateRoomId = insertResult[0].insertId;

      const realMCQQuestion = await getRealMCQQuestion(newsGroupId, 1);

      responseData.debate = {
        id: debateRoomId,
        ...debateRoomData, 
        created_at: new Date(),
      };
      responseData.currentQuestion = realMCQQuestion;
    }

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error creating AI debates:", error);
    return NextResponse.json(
      {
        error: "Failed to create debate room",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}