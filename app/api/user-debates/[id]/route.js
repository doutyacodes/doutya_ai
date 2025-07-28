// /api/user-debates/[id]/route.js - CORRECTED VERSION
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import axios from "axios";
import {
  USER_CUSTOM_DEBATES,
  USER_CUSTOM_DEBATE_MESSAGES,
  USER_CUSTOM_DEBATE_REPORTS,
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, and, asc } from "drizzle-orm";

// Generate AI response to user message
async function generateAIResponse(topic, aiPosition, userPosition, userMessage, conversationHistory) {
  const prompt = `You are in a custom debate about: "${topic}"

Your position: ${aiPosition}
Opponent's position: ${userPosition}

Conversation history:
${conversationHistory.map((msg) => `${msg.sender.toUpperCase()}: ${msg.content}`).join("\n")}

User just said: "${userMessage}"

Respond as the AI debater defending "${aiPosition}". Your response should:
1. Directly address the user's latest point
2. Present a strong counter-argument with evidence or logic
3. Maintain a respectful but competitive debate tone
4. Stay focused on the topic and your assigned position
5. Keep it under 200 characters

Be persuasive, logical, and engaging while staying true to your assigned stance.`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 120,
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
    console.error("Error generating AI response:", error);
    return "That's an interesting point, but I maintain my position based on the evidence supporting my stance.";
  }
}

// Generate debate report
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

// GET - Get specific debate with messages and report
export async function GET(request, { params }) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  
  const { id } = await params;

  try {
    // Get debate and verify ownership
    const debate = await db
      .select()
      .from(USER_CUSTOM_DEBATES)
      .where(and(eq(USER_CUSTOM_DEBATES.id, id), eq(USER_CUSTOM_DEBATES.user_id, userId)))
      .limit(1)
      .execute();

    if (debate.length === 0) {
      return NextResponse.json({ error: "Debate not found." }, { status: 404 });
    }

    const debateData = debate[0];

    // Get all messages for this debate
    const messages = await db
      .select()
      .from(USER_CUSTOM_DEBATE_MESSAGES)
      .where(eq(USER_CUSTOM_DEBATE_MESSAGES.debate_id, id))
      .orderBy(asc(USER_CUSTOM_DEBATE_MESSAGES.created_at))
      .execute();

    // Get report if exists
    let report = null;
    if (debateData.status === 'completed') {
      const reportData = await db
        .select()
        .from(USER_CUSTOM_DEBATE_REPORTS)
        .where(eq(USER_CUSTOM_DEBATE_REPORTS.debate_id, id))
        .limit(1)
        .execute();

      if (reportData.length > 0) {
        report = reportData[0];
      }
    }

    // Calculate progress correctly - conversation_count should represent completed rounds
    const progress = {
      current: debateData.conversation_count,
      max: debateData.max_conversations,
      percentage: Math.round((debateData.conversation_count / debateData.max_conversations) * 100),
      is_completed: debateData.status === 'completed',
      // User can continue if debate is active AND they haven't reached max conversations
      can_continue: debateData.status === 'active' && debateData.conversation_count < debateData.max_conversations
    };

    console.log(`Debate ${id} progress:`, progress);

    return NextResponse.json({
      success: true,
      data: {
        debate: debateData,
        messages: messages,
        report: report,
        progress: progress
      }
    });

  } catch (error) {
    console.error("Error fetching debate:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch debate",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - Send message in debate
export async function POST(request, { params }) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  
  const { id } = await params;
  const { content } = await request.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "Message content is required." }, { status: 400 });
  }

  if (content.length > 500) {
    return NextResponse.json({ error: "Message must be 500 characters or less." }, { status: 400 });
  }

  try {
    // Get debate and verify ownership
    const debate = await db
      .select()
      .from(USER_CUSTOM_DEBATES)
      .where(and(eq(USER_CUSTOM_DEBATES.id, id), eq(USER_CUSTOM_DEBATES.user_id, userId)))
      .limit(1)
      .execute();

    if (debate.length === 0) {
      return NextResponse.json({ error: "Debate not found." }, { status: 404 });
    }

    const debateData = debate[0];
    
    console.log(`POST to debate ${id} - Current state:`, {
      conversation_count: debateData.conversation_count,
      max_conversations: debateData.max_conversations,
      status: debateData.status
    });

    if (debateData.status !== "active") {
      return NextResponse.json({ error: "This debate has already been completed." }, { status: 400 });
    }

    // Check if user has reached max conversations (complete rounds)
    if (debateData.conversation_count >= debateData.max_conversations) {
      return NextResponse.json({ 
        error: `Maximum conversation limit reached. You have completed ${debateData.conversation_count}/${debateData.max_conversations} rounds.` 
      }, { status: 400 });
    }

    // The current conversation round we're starting (1-based)
    const currentConversationRound = debateData.conversation_count + 1;

    console.log(`Processing conversation round ${currentConversationRound} of ${debateData.max_conversations}`);

    // Get conversation history for AI context
    const conversationHistory = await db
      .select()
      .from(USER_CUSTOM_DEBATE_MESSAGES)
      .where(eq(USER_CUSTOM_DEBATE_MESSAGES.debate_id, id))
      .orderBy(asc(USER_CUSTOM_DEBATE_MESSAGES.created_at))
      .execute();

    // Save user message
    const userMessage = {
      debate_id: parseInt(id),
      sender: "user",
      content: content.trim(),
      conversation_turn: currentConversationRound,
    };

    const userMessageResult = await db.insert(USER_CUSTOM_DEBATE_MESSAGES).values(userMessage).execute();
    console.log(`Saved user message for round ${currentConversationRound}`);

    // Generate AI response
    const aiResponse = await generateAIResponse(
      debateData.title,
      debateData.ai_position_title,
      debateData.user_position_title,
      content,
      conversationHistory
    );

    const aiMessage = {
      debate_id: parseInt(id),
      sender: "ai",
      content: aiResponse,
      conversation_turn: currentConversationRound,
    };

    const aiMessageResult = await db.insert(USER_CUSTOM_DEBATE_MESSAGES).values(aiMessage).execute();
    console.log(`Saved AI message for round ${currentConversationRound}`);

    // Now update conversation count - this represents completed conversation rounds
    // Only increment after BOTH user and AI messages are saved
    await db
      .update(USER_CUSTOM_DEBATES)
      .set({ 
        conversation_count: currentConversationRound, // This round is now complete
        updated_at: new Date()
      })
      .where(eq(USER_CUSTOM_DEBATES.id, id))
      .execute();

    console.log(`Updated debate ${id} conversation_count to ${currentConversationRound}`);

    let debateCompleted = false;
    let report = null;

    // Check if debate should be completed (user has completed all their rounds)
    if (currentConversationRound >= debateData.max_conversations) {
      console.log(`Completing debate ${id}: User has completed ${currentConversationRound}/${debateData.max_conversations} rounds`);
      
      await db
        .update(USER_CUSTOM_DEBATES)
        .set({ 
          status: "completed",
          completed_at: new Date(),
          updated_at: new Date()
        })
        .where(eq(USER_CUSTOM_DEBATES.id, id))
        .execute();

      // Get all messages for report generation
      const allMessages = await db
        .select()
        .from(USER_CUSTOM_DEBATE_MESSAGES)
        .where(eq(USER_CUSTOM_DEBATE_MESSAGES.debate_id, id))
        .orderBy(asc(USER_CUSTOM_DEBATE_MESSAGES.created_at))
        .execute();

      const reportData = await generateDebateReport(debateData, allMessages);

      // Create debate report
      const debateReport = {
        debate_id: parseInt(id),
        user_id: userId,
        ...reportData,
        openai_response: JSON.stringify(reportData),
      };

      await db.insert(USER_CUSTOM_DEBATE_REPORTS).values(debateReport).execute();

      debateCompleted = true;
      report = reportData;

      console.log(`Generated report for completed debate ${id}`);
    }

    // Calculate progress based on completed rounds
    const progress = {
      current: currentConversationRound,
      max: debateData.max_conversations,
      remaining: debateData.max_conversations - currentConversationRound,
      percentage: Math.round((currentConversationRound / debateData.max_conversations) * 100),
      is_completed: debateCompleted,
      can_continue: !debateCompleted && currentConversationRound < debateData.max_conversations
    };

    console.log(`Debate ${id} new progress:`, progress);

    return NextResponse.json(
      {
        success: true,
        userMessage: {
          id: userMessageResult[0].insertId,
          ...userMessage,
          created_at: new Date(),
        },
        aiResponse: {
          id: aiMessageResult[0].insertId,
          ...aiMessage,
          created_at: new Date(),
        },
        debateCompleted,
        report,
        progress
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error processing debate message:", error);
    return NextResponse.json(
      {
        error: "Failed to process message",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}