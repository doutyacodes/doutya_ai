// /api/ai-debate/[debateId]/message/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import axios from "axios";
import {
  AI_DEBATE_ROOMS,
  AI_DEBATE_MESSAGES,
  AI_DEBATE_REPORTS,
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, and, asc } from "drizzle-orm";

async function generateAIResponse(
  topic,
  userPosition,
  aiPosition,
  userMessage,
  conversationHistory
) {
  const prompt = `You are in a formal debate about: "${topic}"

Your position: ${aiPosition}
Opponent's position: ${userPosition}

Conversation history:
${conversationHistory
  .map((msg) => `${msg.sender.toUpperCase()}: ${msg.content}`)
  .join("\n")}

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
      overall_analysis:
        "You engaged in a thoughtful debate, presenting your arguments clearly and responding to counterpoints.",
      strengths:
        "You demonstrated good engagement with the topic and showed commitment to your position throughout the debate.",
      improvements:
        "Consider incorporating more specific examples and evidence to strengthen your arguments in future debates.",
      insights:
        "Your debate style shows potential. Continue practicing to develop even stronger analytical and persuasive skills.",
      argument_quality_score: 7,
      persuasiveness_score: 6,
      factual_accuracy_score: 7,
      logical_consistency_score: 7,
      winner: "tie",
    };
  }
}

export async function POST(request, { params }) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const debateId = params.debateId;
  const { content } = await request.json();

  if (!content?.trim()) {
    return NextResponse.json(
      { error: "Message content is required." },
      { status: 400 }
    );
  }

  if (content.length > 500) {
    return NextResponse.json(
      { error: "Message must be 500 characters or less." },
      { status: 400 }
    );
  }

  try {
    // Get debate room and verify ownership
    const debateRoom = await db
      .select()
      .from(AI_DEBATE_ROOMS)
      .where(
        and(
          eq(AI_DEBATE_ROOMS.id, debateId),
          eq(AI_DEBATE_ROOMS.user_id, userId)
        )
      )
      .limit(1)
      .execute();

    if (debateRoom.length === 0) {
      return NextResponse.json(
        { error: "Debate room not found." },
        { status: 404 }
      );
    }

    const room = debateRoom[0];

    if (room.status !== "active") {
      return NextResponse.json(
        { error: "This debate has already been completed." },
        { status: 400 }
      );
    }

    if (room.conversation_count >= room.max_conversations) {
      return NextResponse.json(
        { error: "Maximum conversation limit reached for this debate." },
        { status: 400 }
      );
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
      character_count: content.trim().length,
      conversation_turn: newConversationTurn,
    };

    const userMessageResult = await db
      .insert(AI_DEBATE_MESSAGES)
      .values(userMessage)
      .execute();

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
      character_count: aiResponse.length,
      conversation_turn: newConversationTurn,
    };

    const aiMessageResult = await db
      .insert(AI_DEBATE_MESSAGES)
      .values(aiMessage)
      .execute();

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
      // Mark debate as completed
      await db
        .update(AI_DEBATE_ROOMS)
        .set({ status: "completed" })
        .where(eq(AI_DEBATE_ROOMS.id, debateId))
        .execute();

      // Get all messages for report generation
      const allMessages = await db
        .select()
        .from(AI_DEBATE_MESSAGES)
        .where(eq(AI_DEBATE_MESSAGES.debate_room_id, debateId))
        .orderBy(asc(AI_DEBATE_MESSAGES.created_at))
        .execute();

      // Generate report
      const reportData = await generateDebateReport(room, allMessages);

      const debateReport = {
        debate_room_id: debateId,
        user_id: userId,
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
  } catch (error) {
    console.error("Error processing debate message:", error);
    return NextResponse.json(
      {
        error: "Failed to process message",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
