// /api/ai-debate/[debateId]/message/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import axios from "axios";
import {
  AI_DEBATE_ROOMS,
  AI_DEBATE_MESSAGES,
  AI_DEBATE_REPORTS,
  MC_DEBATE_OPTIONS,
  MC_DEBATE_RESPONSES,
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, and, asc } from "drizzle-orm";

async function generateAIResponse(topic, userPosition, aiPosition, userMessage, conversationHistory) {
  const prompt = `You are in a formal debate about: "${topic}"

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
5. Keep it under 400 characters

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

async function generateDebateReport(debateRoom, messages) {
  const userMessages = messages.filter((m) => m.sender === "user");
  const aiMessages = messages.filter((m) => m.sender === "ai");

  const prompt = `
    Analyze this formal debate and provide a comprehensive report:
    
    Topic: "${debateRoom.topic}"
    User's Position: "${debateRoom.user_position}"
    AI's Position: "${debateRoom.ai_position}"
    
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
      overall_analysis: "You engaged in a thoughtful debate, presenting your arguments clearly and responding to counterpoints.",
      strengths: "You demonstrated good engagement with the topic and showed commitment to your position throughout the debate.",
      improvements: "Consider incorporating more specific examples and evidence to strengthen your arguments in future debates.",
      insights: "Your debate style shows potential. Continue practicing to develop even stronger analytical and persuasive skills.",
      argument_quality_score: 7,
      persuasiveness_score: 6,
      factual_accuracy_score: 7,
      logical_consistency_score: 7,
      winner: "tie",
    };
  }
}

// Function to get the next real MCQ question from database
async function getRealNextMCQQuestion(selectedOptionId, currentLevel) {
  try {
    // Get the selected option details
    const selectedOption = await db
      .select()
      .from(MC_DEBATE_OPTIONS)
      .where(eq(MC_DEBATE_OPTIONS.id, selectedOptionId))
      .limit(1)
      .execute();

    if (!selectedOption.length) {
      throw new Error("Selected option not found");
    }

    const option = selectedOption[0];

    // Check if this is a terminal option (end of conversation)
    if (option.is_terminal) {
      return null; // No next question
    }

    // Get the next response that this option leads to
    if (option.leads_to_response_id) {
      const nextResponse = await db
        .select()
        .from(MC_DEBATE_RESPONSES)
        .where(eq(MC_DEBATE_RESPONSES.id, option.leads_to_response_id))
        .limit(1)
        .execute();

      if (nextResponse.length) {
        const response = nextResponse[0];

        // Get options for this next response
        const nextOptions = await db
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
          options: nextOptions.map((opt, index) => ({
            id: opt.id,
            option_text: opt.option_text,
            option_letter: opt.option_letter || String.fromCharCode(65 + index), // A, B, C...
            option_position: opt.option_position,
            leads_to_response_id: opt.leads_to_response_id,
            is_terminal: opt.is_terminal
          }))
        };
      }
    } else {
      // If no specific leads_to_response_id, find next level responses based on path logic
      // Get the current response to find its children
      const currentResponse = await db
        .select()
        .from(MC_DEBATE_RESPONSES)
        .where(eq(MC_DEBATE_RESPONSES.id, option.mc_response_id))
        .limit(1)
        .execute();

      if (currentResponse.length) {
        const current = currentResponse[0];
        
        // Find responses at the next level that are children of current response
        const nextLevelResponses = await db
          .select()
          .from(MC_DEBATE_RESPONSES)
          .where(
            and(
              eq(MC_DEBATE_RESPONSES.debate_topic_id, current.debate_topic_id),
              eq(MC_DEBATE_RESPONSES.level, currentLevel + 1),
              eq(MC_DEBATE_RESPONSES.parent_response_id, current.id)
            )
          )
          .limit(1)
          .execute();

        if (nextLevelResponses.length) {
          const response = nextLevelResponses[0];

          const nextOptions = await db
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
            options: nextOptions.map((opt, index) => ({
              id: opt.id,
              option_text: opt.option_text,
              option_letter: opt.option_letter || String.fromCharCode(65 + index),
              option_position: opt.option_position,
              leads_to_response_id: opt.leads_to_response_id,
              is_terminal: opt.is_terminal
            }))
          };
        }
      }
    }

    return null; // No next question found
  } catch (error) {
    console.error("Error fetching next MCQ question:", error);
    return null;
  }
}

export async function POST(request, { params }) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  
  // FIX: Await params before accessing debateId
  const { debateId } = await params;
  
  const { content, action, selectedOptionId } = await request.json();

  try {
    // Get debate room and verify ownership
    const debateRoom = await db
      .select()
      .from(AI_DEBATE_ROOMS)
      .where(and(eq(AI_DEBATE_ROOMS.id, debateId), eq(AI_DEBATE_ROOMS.user_id, userId)))
      .limit(1)
      .execute();

    if (debateRoom.length === 0) {
      return NextResponse.json({ error: "Debate room not found." }, { status: 404 });
    }

    const room = debateRoom[0];

    if (room.status !== "active") {
      return NextResponse.json({ error: "This debate has already been completed." }, { status: 400 });
    }

    // Handle User vs AI debate messages
    if (!action && content) {
      return await handleUserVsAI(room, content, userId, debateId);
    }
    
    // Handle AI vs AI next conversation
    if (action === "show_next") {
      return await handleAIvsAI(room, userId, debateId);
    }
    
    // Handle MCQ answer submission
    if (selectedOptionId) {
      return await handleMCQ(room, selectedOptionId, userId, debateId);
    }

    return NextResponse.json({ error: "Invalid request parameters." }, { status: 400 });
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

async function handleUserVsAI(room, content, userId, debateId) {
  if (!content?.trim()) {
    return NextResponse.json({ error: "Message content is required." }, { status: 400 });
  }

  if (content.length > 500) {
    return NextResponse.json({ error: "Message must be 500 characters or less." }, { status: 400 });
  }

  if (room.conversation_count >= room.max_conversations) {
    return NextResponse.json({ error: "Maximum conversation limit reached for this debate." }, { status: 400 });
  }

  const newConversationTurn = room.conversation_count + 1;

  // Get conversation history
  const conversationHistory = await db
    .select()
    .from(AI_DEBATE_MESSAGES)
    .where(eq(AI_DEBATE_MESSAGES.debate_room_id, debateId))
    .orderBy(asc(AI_DEBATE_MESSAGES.created_at))
    .execute();

  // Save user message
  const userMessage = {
    debate_room_id: debateId,
    sender: "user",
    content: content.trim(),
    conversation_turn: newConversationTurn,
  };

  const userMessageResult = await db.insert(AI_DEBATE_MESSAGES).values(userMessage).execute();

  // Generate AI response
  const aiResponse = await generateAIResponse(
    room.topic,
    room.user_position,
    room.ai_position,
    content,
    conversationHistory
  );

  const aiMessage = {
    debate_room_id: debateId,
    sender: "ai",
    content: aiResponse,
    conversation_turn: newConversationTurn,
  };

  const aiMessageResult = await db.insert(AI_DEBATE_MESSAGES).values(aiMessage).execute();

  // Update conversation count
  await db
    .update(AI_DEBATE_ROOMS)
    .set({ conversation_count: newConversationTurn })
    .where(eq(AI_DEBATE_ROOMS.id, debateId))
    .execute();

  let debateCompleted = false;
  let report = null;

  // Check if debate is completed
  if (newConversationTurn >= room.max_conversations) {
    await db.update(AI_DEBATE_ROOMS).set({ status: "completed" }).where(eq(AI_DEBATE_ROOMS.id, debateId)).execute();

    const allMessages = await db
      .select()
      .from(AI_DEBATE_MESSAGES)
      .where(eq(AI_DEBATE_MESSAGES.debate_room_id, debateId))
      .orderBy(asc(AI_DEBATE_MESSAGES.created_at))
      .execute();

    const reportData = await generateDebateReport(room, allMessages);

    // Create debate report object without choice_count for User vs AI
    const debateReport = {
      debate_room_id: debateId,
      user_id: userId,
      debate_type: "user_vs_ai", // Add debate_type
      ...reportData,
      openai_response: JSON.stringify(reportData),
    };

    await db.insert(AI_DEBATE_REPORTS).values(debateReport).execute();

    debateCompleted = true;
    report = reportData;
  }

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
      conversationTurn: newConversationTurn,
      remainingTurns: room.max_conversations - newConversationTurn,
    },
    { status: 200 }
  );
}

async function handleAIvsAI(room, userId, debateId) {
  const newRound = room.conversation_count + 1;

  // Update conversation count
  await db
    .update(AI_DEBATE_ROOMS)
    .set({ conversation_count: newRound })
    .where(eq(AI_DEBATE_ROOMS.id, debateId))
    .execute();

  let debateCompleted = false;
  let report = null;

  // Check if all conversations are shown
  if (newRound >= room.max_conversations) {
    await db.update(AI_DEBATE_ROOMS).set({ status: "completed" }).where(eq(AI_DEBATE_ROOMS.id, debateId)).execute();

    // Generate completion report for AI vs AI
    const reportData = {
      overall_analysis: "You observed a structured debate between two AI perspectives, gaining insights into different approaches to argumentation.",
      strengths: "You demonstrated patience and engagement by following the entire debate sequence.",
      improvements: "Consider taking notes during future AI debates to better analyze the argumentation techniques used.",
      insights: "Watching structured debates helps develop critical thinking skills. Notice how each side builds upon previous points.",
      argument_quality_score: 8,
      persuasiveness_score: 7,
      factual_accuracy_score: 8,
      logical_consistency_score: 8,
      winner: "tie",
    };

    // Create debate report object without choice_count for AI vs AI
    const debateReport = {
      debate_room_id: debateId,
      user_id: userId,
      debate_type: "ai_vs_ai", // Add debate_type
      ...reportData,
      openai_response: JSON.stringify(reportData),
    };

    await db.insert(AI_DEBATE_REPORTS).values(debateReport).execute();

    debateCompleted = true;
    report = reportData;
  }

  return NextResponse.json(
    {
      success: true,
      debateCompleted,
      report,
      conversationTurn: newRound,
      remainingTurns: room.max_conversations - newRound,
    },
    { status: 200 }
  );
}

async function handleMCQ(room, selectedOptionId, userId, debateId) {
  const currentLevel = room.conversation_count + 1;

  try {
    // Get the selected option to understand the choice made
    const selectedOption = await db
      .select()
      .from(MC_DEBATE_OPTIONS)
      .where(eq(MC_DEBATE_OPTIONS.id, selectedOptionId))
      .limit(1)
      .execute();

    if (!selectedOption.length) {
      throw new Error("Selected option not found");
    }

    const option = selectedOption[0];
    
    // Get the next question based on the selected option
    const nextQuestion = await getRealNextMCQQuestion(selectedOptionId, currentLevel);

    // Update conversation count
    await db
      .update(AI_DEBATE_ROOMS)
      .set({ conversation_count: currentLevel })
      .where(eq(AI_DEBATE_ROOMS.id, debateId))
      .execute();

    let isCompleted = false;
    let report = null;

    // Check if this was a terminal option or we've reached max level
    if (!nextQuestion || option.is_terminal || currentLevel >= 5) {
      // Mark as completed
      await db
        .update(AI_DEBATE_ROOMS)
        .set({ status: "completed" })
        .where(eq(AI_DEBATE_ROOMS.id, debateId))
        .execute();

      // Generate completion report
      const reportData = {
        overall_analysis: "You navigated through a complex decision tree, making thoughtful choices at each step of the debate.",
        strengths: "You demonstrated careful consideration of options and showed engagement with the different perspectives presented.",
        improvements: "Consider spending more time analyzing the implications of each choice and how they build upon previous decisions.",
        insights: "Decision tree exercises help develop systematic thinking and consequence evaluation skills. Each choice shapes the direction of the debate.",
        argument_quality_score: 7,
        persuasiveness_score: 6,
        factual_accuracy_score: 7,
        logical_consistency_score: 7,
        choice_count: currentLevel,
      };

      // Create debate report
      const debateReport = {
        debate_room_id: debateId,
        user_id: userId,
        debate_type: "mcq",
        ...reportData,
        openai_response: JSON.stringify(reportData),
      };

      await db.insert(AI_DEBATE_REPORTS).values(debateReport).execute();

      isCompleted = true;
      report = reportData;
    }

    return NextResponse.json(
      {
        success: true,
        nextQuestion: nextQuestion ? {
          ...nextQuestion,
          level: nextQuestion.level,
          ai_persona: nextQuestion.ai_persona
        } : null,
        isCompleted,
        report,
        currentLevel: currentLevel,
        remainingLevels: Math.max(0, 5 - currentLevel),
        selectedChoice: {
          option_text: option.option_text,
          option_position: option.option_position
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in handleMCQ:", error);
    throw error;
  }
}