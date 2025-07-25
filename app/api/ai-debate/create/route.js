// /api/ai-debate/create/route.js - Updated without simulated fallbacks
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
import { eq, and, isNull } from "drizzle-orm";

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
        timeout: 30000, // 30 second timeout
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
  try {
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
  } catch (error) {
    console.error("Error resolving news group ID:", error);
    throw new Error("Failed to resolve news group ID");
  }
}

// Function to get real AI vs AI conversations from database
async function getRealAIvsAI(newsGroupId) {
  console.log(`Fetching AI vs AI conversations for news group: ${newsGroupId}`);
  
  // Find the debate topic associated with this news group
  const debateTopics = await db
    .select()
    .from(DEBATE_TOPICS)
    .where(eq(DEBATE_TOPICS.news_group_id, newsGroupId))
    .limit(1)
    .execute();

  if (!debateTopics.length) {
    console.log(`No debate topic found for news group: ${newsGroupId}`);
    throw new Error("No debate topic found for this news group");
  }

  const debateTopicId = debateTopics[0].id;
  console.log(`Found debate topic ID: ${debateTopicId}`);

  // Get all AI conversations for this debate topic
  const conversations = await db
    .select()
    .from(AI_CONVERSATIONS)
    .where(eq(AI_CONVERSATIONS.debate_topic_id, debateTopicId))
    .execute();

  if (!conversations.length) {
    console.log(`No AI conversations found for debate topic: ${debateTopicId}`);
    throw new Error("No AI conversations found for this debate topic");
  }

  console.log(`Found ${conversations.length} AI conversations`);

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

  console.log(`Returning ${formattedConversations.length} formatted conversations`);
  return formattedConversations;
}

// Function to get real MCQ question from database with tree type support
async function getRealMCQQuestion(newsGroupId, treeType, level = 1, parentResponseId = null) {
  {console.log("data received",[newsGroupId, treeType, level , parentResponseId ])}
  console.log(`Getting real MCQ question for newsGroupId: ${newsGroupId}, treeType: ${treeType}, level: ${level}`);
  
  // First, find the debate topic associated with this news group
  const debateTopics = await db
    .select()
    .from(DEBATE_TOPICS)
    .where(eq(DEBATE_TOPICS.news_group_id, newsGroupId))
    .limit(1)
    .execute();

  if (!debateTopics.length) {
    console.log(`No debate topic found for news group: ${newsGroupId}`);
    throw new Error("No debate topic found for this news group");
  }

  const debateTopicId = debateTopics[0].id;
  console.log(`Found debate topic ID: ${debateTopicId}`);

  // Get the appropriate MCQ response based on level, tree type and parent
  let mcqResponse;
  
  if (level === 1) {
    // Get root level question for the specific tree type
    mcqResponse = await db
      .select()
      .from(MC_DEBATE_RESPONSES)
      .where(
        and(
          eq(MC_DEBATE_RESPONSES.debate_topic_id, debateTopicId),
          eq(MC_DEBATE_RESPONSES.level, 1),
          isNull(MC_DEBATE_RESPONSES.parent_response_id),
          eq(MC_DEBATE_RESPONSES.tree_type, treeType)
        )
      )
      .limit(1)
      .execute();
  } else {
    // Get specific response by ID for subsequent levels
    mcqResponse = await db
      .select()
      .from(MC_DEBATE_RESPONSES)
      .where(
        and(
          eq(MC_DEBATE_RESPONSES.id, parentResponseId),
          eq(MC_DEBATE_RESPONSES.tree_type, treeType)
        )
      )
      .limit(1)
      .execute();
  }
console.log("mcqResponse",mcqResponse)
console.log("mcqResponse",parentResponseId)
console.log("mcqResponse",treeType)
  if (!mcqResponse.length) {
    console.log(`No MCQ question found for level ${level}, tree type ${treeType}`);
    throw new Error(`No MCQ question found for level ${level} and tree type ${treeType}`);
  }

  const response = mcqResponse[0];

  // Get the options for this response
  const options = await db
    .select()
    .from(MC_DEBATE_OPTIONS)
    .where(eq(MC_DEBATE_OPTIONS.mc_response_id, response.id))
    .execute();

  if (!options.length) {
    console.log(`No options found for MCQ response ${response.id}`);
    throw new Error(`No options found for this MCQ question`);
  }

  console.log(`Found MCQ response with ${options.length} options for tree type ${treeType}`);

  return {
    id: response.id,
    question_text: `AI Response - Level ${response.level}`,
    ai_message: response.ai_message,
    ai_persona: response.ai_persona,
    level: response.level,
    tree_type: response.tree_type,
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
}

export async function POST(request) {
  let authResult;
  
  try {
    // Authenticate user
    authResult = await authenticate(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  
  let requestData;
  try {
    requestData = await request.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { 
    topic, 
    debateType = "user_vs_ai", 
    userPosition, 
    aiPosition, 
    newsId,
    groupId,
    selectedUserStance,
    preferredTreeType
  } = requestData;

  if (!topic?.trim()) {
    return NextResponse.json(
      { error: "Topic is required." },
      { status: 400 }
    );
  }

  try {
    console.log(`Creating ${debateType} debate for user ${userId}`);
    
    // Check user plan - only Elite users can access debates
    let userInfo;
    try {
      userInfo = await db
        .select({ plan: USER_DETAILS.plan })
        .from(USER_DETAILS)
        .where(eq(USER_DETAILS.id, userId))
        .limit(1)
        .execute();
    } catch (dbError) {
      console.error("Database error checking user plan:", dbError);
      return NextResponse.json(
        { error: "Database connection error. Please try again." },
        { status: 503 }
      );
    }

    const userPlan = userInfo[0]?.plan || "starter";

    if (userPlan !== "elite") {
      return NextResponse.json(
        { error: "AI Debate feature is only available for Elite members." },
        { status: 403 }
      );
    }

    // Resolve news group ID
    let newsGroupId;
    try {
      newsGroupId = await resolveNewsGroupId(newsId, groupId);
      console.log(`Resolved news group ID: ${newsGroupId}`);
    } catch (error) {
      console.error("Error resolving news group ID:", error);
      return NextResponse.json(
        { error: "Invalid news group or article reference" },
        { status: 400 }
      );
    }

    // Check and update usage limits
    const dailyLimit = 5;
    const now = new Date();

    let usage;
    try {
      usage = await db
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
    } catch (dbError) {
      console.error("Database error checking usage limits:", dbError);
      // Don't fail the request for usage tracking errors
      console.log("Continuing without usage tracking due to DB error");
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

      try {
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
      } catch (dbError) {
        console.error("Database error creating user vs AI debate:", dbError);
        return NextResponse.json(
          { error: "Failed to create debate room. Database error." },
          { status: 503 }
        );
      }

    } else if (debateType === "ai_vs_ai") {
      // Use real AI vs AI content from database
      try {
        const realConversations = await getRealAIvsAI(newsGroupId);
        
        const debateRoomData = {
          user_id: userId,
          topic: topic.trim(),
          debate_type: "ai_vs_ai",
          user_position: "Observer",
          ai_position: "Progressive stance",
          ai_position_2: "Conservative stance",
          status: "active",
          conversation_count: 0,
          max_conversations: 3,
          news_id: newsId || null,
        };

        const insertResult = await db.insert(AI_DEBATE_ROOMS).values(debateRoomData).execute();
        const debateRoomId = insertResult[0].insertId;
        
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
      } catch (dbError) {
        console.error("Database error creating AI vs AI debate:", dbError);
        return NextResponse.json(
          { error: "Failed to create AI vs AI debate. No debate content available for this topic." },
          { status: 404 }
        );
      }

    } else if (debateType === "mcq") {
      // Handle MCQ with tree type selection
      if (!selectedUserStance) {
        return NextResponse.json(
          { error: "User stance selection is required for MCQ debates." },
          { status: 400 }
        );
      }

      try {
        // Determine tree type based on user's stance
        const treeType = preferredTreeType || (selectedUserStance === 'for' ? 'ai_against' : 'ai_for');
        
        console.log(`MCQ Debug: selectedUserStance=${selectedUserStance}, determined treeType=${treeType}`);

        // Get the first MCQ question from the appropriate tree
        const realMCQQuestion = await getRealMCQQuestion(newsGroupId, treeType, 1);

        const debateRoomData = {
          user_id: userId,
          topic: topic.trim(),
          debate_type: "mcq",
          user_position: selectedUserStance === 'for' ? 'Supporting Position' : 'Opposing Position',
          ai_position: treeType === 'ai_for' ? 'Supporting Position' : 'Opposing Position',
          status: "active",
          conversation_count: 0,
          max_conversations: 5,
          total_questions: 5,
          tree_type: treeType,
          selected_user_stance: selectedUserStance,
          news_id: newsId || null,
        };

        const insertResult = await db.insert(AI_DEBATE_ROOMS).values(debateRoomData).execute();
        const debateRoomId = insertResult[0].insertId;

        responseData.debate = {
          id: debateRoomId,
          ...debateRoomData, 
          created_at: new Date(),
        };
        responseData.currentQuestion = realMCQQuestion;
      } catch (dbError) {
        console.error("Database error creating MCQ debate:", dbError);
        return NextResponse.json(
          { error: "Failed to create MCQ debate. No MCQ content available for this topic." },
          { status: 404 }
        );
      }
    }

    console.log(`Successfully created ${debateType} debate with ID: ${responseData.debate?.id}`);
    return NextResponse.json(responseData, { status: 201 });
    
  } catch (error) {
    console.error("Unexpected error creating AI debates:", error);
    
    // Determine if this is a database connection error
    if (error.code === 'ER_CON_COUNT_ERROR' || error.code === 'ECONNREFUSED' || error.errno === 1040) {
      return NextResponse.json(
        { 
          error: "Database connection error. Please try again in a moment.",
          details: process.env.NODE_ENV === "development" ? "Too many database connections" : undefined
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      {
        error: "Failed to create debate room",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}