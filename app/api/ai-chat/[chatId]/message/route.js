// /api/ai-chat/[chatId]/message/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import axios from "axios";
import { 
  AI_CHAT_ROOMS, 
  AI_CHAT_MESSAGES,
  AI_CHAT_REPORTS,
  AI_PERSONALITIES,
  USER_DETAILS
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, and, desc } from "drizzle-orm";

// AI Personality system prompts for OpenAI
const AI_PERSONALITY_PROMPTS = {
  1: { // Scholar
    name: "Scholar",
    systemPrompt: `You are Scholar, an evidence-based analytical AI with a methodical approach to discussions. Your personality traits:
    - Always cite research, studies, and empirical evidence
    - Use methodical and systematic reasoning
    - Question assumptions and seek peer-reviewed sources
    - Speak in an academic but accessible tone
    - Focus on facts, data, and proven methodologies
    - Ask for sources and evidence when claims are made
    - Prefer measured, careful conclusions over bold statements
    
    Respond in 2-3 sentences maximum. Always maintain your scholarly, evidence-focused perspective.`
  },
  2: { // Advocate
    name: "Advocate", 
    systemPrompt: `You are Advocate, a passionate social justice AI focused on ethical implications and human rights. Your personality traits:
    - Always consider the impact on vulnerable and marginalized communities
    - Use persuasive, emotionally resonant language
    - Focus on ethical imperatives and moral obligations
    - Challenge systems of oppression and inequality
    - Speak with conviction about justice and fairness
    - Highlight voices of those most affected by issues
    - Push for progressive change and reform
    
    Respond in 2-3 sentences maximum. Always maintain your passionate, justice-focused perspective.`
  },
  3: { // Skeptic
    name: "Skeptic",
    systemPrompt: `You are Skeptic, a critical thinking AI that questions assumptions and challenges conventional wisdom. Your personality traits:
    - Always question underlying assumptions and biases
    - Point out logical fallacies and weak reasoning
    - Ask probing questions that expose problems
    - Consider alternative explanations and counterarguments
    - Use cautious, measured language
    - Identify potential flaws in logic or methodology
    - Remain neutral but intellectually rigorous
    
    Respond in 2-3 sentences maximum. Always maintain your questioning, analytically skeptical perspective.`
  },
  4: { // Visionary
    name: "Visionary",
    systemPrompt: `You are Visionary, a future-focused AI that thinks creatively about innovative solutions and possibilities. Your personality traits:
    - Always look toward future potential and transformative possibilities
    - Use optimistic, forward-thinking language
    - Propose creative combinations and breakthrough solutions
    - Focus on innovation, disruption, and paradigm shifts
    - Think big picture and long-term impact
    - Embrace emerging technologies and novel approaches
    - Inspire others to imagine new possibilities
    
    Respond in 2-3 sentences maximum. Always maintain your optimistic, future-focused perspective.`
  }
};

async function generateAIResponseWithOpenAI(topic, userMessage, aiPersonalityId, conversationHistory) {
  const personality = AI_PERSONALITY_PROMPTS[aiPersonalityId];
  
  if (!personality) {
    throw new Error(`AI personality ${aiPersonalityId} not found`);
  }

  // Build conversation context
  const contextMessages = [];
  
  // Add system prompt
  contextMessages.push({
    role: "system",
    content: personality.systemPrompt
  });

  // Add conversation history for context (last 6 messages for efficiency)
  const recentHistory = conversationHistory.slice(-6);
  recentHistory.forEach(msg => {
    if (msg.sender === 'user') {
      contextMessages.push({
        role: "user", 
        content: msg.content
      });
    } else if (msg.ai_personality_id === aiPersonalityId) {
      contextMessages.push({
        role: "assistant",
        content: msg.content
      });
    }
  });

  // Add current user message with topic context
  contextMessages.push({
    role: "user",
    content: `Topic: "${topic}"\n\nUser's message: ${userMessage}\n\nRespond as ${personality.name} with your unique perspective on this topic.`
  });

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: contextMessages,
        max_tokens: 150, // Keep responses concise
        temperature: 0.8, // Allow for personality variation
        presence_penalty: 0.1, // Encourage diverse responses
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
    console.error(`Error generating AI response for personality ${aiPersonalityId}:`, error);
    
    // Fallback to simple contextual response if OpenAI fails
    const fallbacks = {
      1: `From an analytical perspective on "${topic}", I'd need to examine the available evidence before drawing conclusions about your point.`,
      2: `This aspect of "${topic}" raises important questions about fairness and impact on communities that we must address.`, 
      3: `I'm curious about the assumptions underlying your view on "${topic}". What evidence supports this position?`,
      4: `Your perspective on "${topic}" opens up fascinating possibilities for how we might reimagine this entire domain.`
    };
    
    return fallbacks[aiPersonalityId] || "That's an interesting perspective worth exploring further.";
  }
}

async function generateChatReport(chatRoom, messages) {
  const userMessages = messages.filter(m => m.sender === 'user');
  const aiMessages = messages.filter(m => m.sender === 'ai');
  
  const prompt = `
    Analyze this debate conversation and provide a comprehensive report:
    
    Topic: "${chatRoom.topic}"
    
    User's arguments:
    ${userMessages.map((m, i) => `${i + 1}. ${m.content}`).join('\n')}
    
    AI responses included perspectives from: Scholar, Advocate, Skeptic, and Visionary viewpoints.
    
    Please provide a detailed analysis in the following format:
    {
      "overall_analysis": "A comprehensive overview of the user's debate performance, argument quality, and engagement level (2-3 sentences)",
      "strengths": "Specific strengths demonstrated in their argumentation, evidence use, and reasoning (2-3 sentences)", 
      "improvements": "Areas where the user could strengthen their debate skills and argument construction (2-3 sentences)",
      "insights": "Key insights about their debate style, perspective, and recommendations for future discussions (2-3 sentences)",
      "argument_quality_score": <number between 1-10>,
      "persuasiveness_score": <number between 1-10>,
      "logical_consistency_score": <number between 1-10>
    }
    
    Focus on constructive feedback that helps them improve their debate and critical thinking skills.
  `;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
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
    console.error("Error generating chat report:", error);
    // Fallback report
    return {
      overall_analysis: "You engaged thoughtfully in this debate, presenting your viewpoints clearly and responding to different perspectives.",
      strengths: "You demonstrated good engagement with the topic and showed willingness to consider multiple angles of the discussion.",
      improvements: "Consider incorporating more specific examples and evidence to strengthen your arguments in future debates.",
      insights: "Your debate style shows promise. Continue practicing to develop even stronger analytical and persuasive skills.",
      argument_quality_score: 7,
      persuasiveness_score: 6,
      logical_consistency_score: 7
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
  const chatId = params.chatId;
  const { content } = await request.json();

  if (!content?.trim()) {
    return NextResponse.json(
      { error: "Message content is required." },
      { status: 400 }
    );
  }

  try {
    // Get chat room and verify ownership
    const chatRoom = await db
      .select()
      .from(AI_CHAT_ROOMS)
      .where(and(
        eq(AI_CHAT_ROOMS.id, chatId),
        eq(AI_CHAT_ROOMS.user_id, userId)
      ))
      .limit(1)
      .execute();

    if (chatRoom.length === 0) {
      return NextResponse.json(
        { error: "Chat room not found." },
        { status: 404 }
      );
    }

    const room = chatRoom[0];

    if (room.status !== 'active') {
      return NextResponse.json(
        { error: "This chat has already been completed." },
        { status: 400 }
      );
    }

    if (room.conversation_count >= room.max_conversations) {
      return NextResponse.json(
        { error: "Maximum conversations reached for this chat." },
        { status: 400 }
      );
    }

    const newConversationTurn = room.conversation_count + 1;

    // Get conversation history for context
    const conversationHistory = await db
      .select()
      .from(AI_CHAT_MESSAGES)
      .where(eq(AI_CHAT_MESSAGES.chat_room_id, chatId))
      .orderBy(AI_CHAT_MESSAGES.created_at)
      .execute();

    // Save user message
    const userMessage = {
      chat_room_id: chatId,
      sender: 'user',
      content: content.trim(),
      conversation_turn: newConversationTurn,
    };

    const userMessageResult = await db
      .insert(AI_CHAT_MESSAGES)
      .values(userMessage)
      .execute();

    // Generate AI responses using OpenAI
    const aiPersonalities = JSON.parse(room.ai_personalities);
    const aiResponses = [];

    // Generate responses for each AI personality
    for (const aiId of aiPersonalities) {
      try {
        const aiResponse = await generateAIResponseWithOpenAI(
          room.topic, 
          content, 
          aiId, 
          conversationHistory
        );
        
        const aiMessage = {
          chat_room_id: chatId,
          sender: 'ai',
          content: aiResponse,
          ai_personality_id: aiId,
          conversation_turn: newConversationTurn,
        };

        const aiMessageResult = await db
          .insert(AI_CHAT_MESSAGES)
          .values(aiMessage)
          .execute();

        aiResponses.push({
          id: aiMessageResult[0].insertId,
          ...aiMessage,
          timestamp: new Date()
        });

        // Add small delay between AI responses to seem more natural
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error generating response for AI ${aiId}:`, error);
        
        // Add fallback response if OpenAI fails for this personality
        const fallbackMessage = {
          chat_room_id: chatId,
          sender: 'ai',
          content: "I'm processing your perspective and will respond shortly with my analysis.",
          ai_personality_id: aiId,
          conversation_turn: newConversationTurn,
        };

        const fallbackResult = await db
          .insert(AI_CHAT_MESSAGES)
          .values(fallbackMessage)
          .execute();

        aiResponses.push({
          id: fallbackResult[0].insertId,
          ...fallbackMessage,
          timestamp: new Date()
        });
      }
    }

    // Update conversation count
    await db
      .update(AI_CHAT_ROOMS)
      .set({ conversation_count: newConversationTurn })
      .where(eq(AI_CHAT_ROOMS.id, chatId))
      .execute();

    let chatCompleted = false;
    let report = null;

    // Check if chat is completed
    if (newConversationTurn >= room.max_conversations) {
      // Mark chat as completed
      await db
        .update(AI_CHAT_ROOMS)
        .set({ status: 'completed' })
        .where(eq(AI_CHAT_ROOMS.id, chatId))
        .execute();

      // Get all messages for report generation
      const allMessages = await db
        .select()
        .from(AI_CHAT_MESSAGES)
        .where(eq(AI_CHAT_MESSAGES.chat_room_id, chatId))
        .orderBy(AI_CHAT_MESSAGES.created_at)
        .execute();

      // Generate report using OpenAI
      const reportData = await generateChatReport(room, allMessages);
      
      const chatReport = {
        chat_room_id: chatId,
        user_id: userId,
        ...reportData,
        openai_response: JSON.stringify(reportData)
      };

      await db
        .insert(AI_CHAT_REPORTS)
        .values(chatReport)
        .execute();

      chatCompleted = true;
      report = reportData;
    }

    return NextResponse.json(
      {
        success: true,
        aiResponses,
        chatCompleted,
        report,
        conversationTurn: newConversationTurn,
        remainingTurns: room.max_conversations - newConversationTurn
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error processing message:", error);
    
    // Handle specific OpenAI API errors
    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: "AI service temporarily busy. Please try again in a moment." },
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
        error: "Failed to process message", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}