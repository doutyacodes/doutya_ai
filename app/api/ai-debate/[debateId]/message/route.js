// /api/ai-debate/[debateId]/message/route.js - Updated with tree type support
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import axios from "axios";
import {
  AI_DEBATE_ROOMS,
  AI_DEBATE_MESSAGES,
  AI_DEBATE_REPORTS,
  MC_DEBATE_OPTIONS,
  MC_DEBATE_RESPONSES,
  DEBATE_POSITIONS,
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

// Enhanced function to get the next real MCQ question from database with tree type support
async function getRealNextMCQQuestion(selectedOptionId, currentLevel, treeType) {
  try {
    console.log(`Getting next MCQ question for option ${selectedOptionId}, level ${currentLevel}, tree type ${treeType}`);
    
    // Get the selected option details
    const selectedOption = await db
      .select()
      .from(MC_DEBATE_OPTIONS)
      .where(eq(MC_DEBATE_OPTIONS.id, selectedOptionId))
      .limit(1)
      .execute();

    if (!selectedOption.length) {
      console.log("Selected option not found");
      throw new Error("Selected option not found");
    }

    const option = selectedOption[0];
    console.log("Selected option:", option);

    // Check if this is a terminal option (end of conversation)
    if (option.is_terminal) {
      console.log("Option is terminal, ending conversation");
      return null; // No next question
    }

    let nextResponse = null;

    // Primary path: Check if option has a direct link to next response
    if (option.leads_to_response_id) {
      console.log(`Following leads_to_response_id: ${option.leads_to_response_id}`);
      
      const responses = await db
        .select()
        .from(MC_DEBATE_RESPONSES)
        .where(
          and(
            eq(MC_DEBATE_RESPONSES.id, option.leads_to_response_id),
            eq(MC_DEBATE_RESPONSES.tree_type, treeType) // Ensure we stay in the same tree
          )
        )
        .limit(1)
        .execute();

      if (responses.length) {
        nextResponse = responses[0];
        console.log("Found next response via leads_to_response_id:", nextResponse);
      }
    }

    // Fallback path: Look for child responses based on current response and tree type
    if (!nextResponse) {
      console.log("No leads_to_response_id, looking for child responses");
      
      // Get the current response this option belongs to
      const currentResponses = await db
        .select()
        .from(MC_DEBATE_RESPONSES)
        .where(
          and(
            eq(MC_DEBATE_RESPONSES.id, option.mc_response_id),
            eq(MC_DEBATE_RESPONSES.tree_type, treeType)
          )
        )
        .limit(1)
        .execute();

      if (currentResponses.length) {
        const currentResponse = currentResponses[0];
        console.log("Current response:", currentResponse);
        
        // Look for child responses at the next level within the same tree
        const childResponses = await db
          .select()
          .from(MC_DEBATE_RESPONSES)
          .where(
            and(
              eq(MC_DEBATE_RESPONSES.debate_topic_id, currentResponse.debate_topic_id),
              eq(MC_DEBATE_RESPONSES.parent_response_id, currentResponse.id),
              eq(MC_DEBATE_RESPONSES.level, currentLevel + 1),
              eq(MC_DEBATE_RESPONSES.tree_type, treeType)
            )
          )
          .limit(1)
          .execute();

        if (childResponses.length) {
          nextResponse = childResponses[0];
          console.log("Found next response via child lookup:", nextResponse);
        }
      }
    }

    // Alternative fallback: Look for any response at the next level within the same tree
    if (!nextResponse) {
      console.log("Looking for any response at next level in same tree");
      
      // Get current response to get debate_topic_id
      const currentResponses = await db
        .select()
        .from(MC_DEBATE_RESPONSES)
        .where(eq(MC_DEBATE_RESPONSES.id, option.mc_response_id))
        .limit(1)
        .execute();

      if (currentResponses.length) {
        const currentResponse = currentResponses[0];
        
        const nextLevelResponses = await db
          .select()
          .from(MC_DEBATE_RESPONSES)
          .where(
            and(
              eq(MC_DEBATE_RESPONSES.debate_topic_id, currentResponse.debate_topic_id),
              eq(MC_DEBATE_RESPONSES.level, currentLevel + 1),
              eq(MC_DEBATE_RESPONSES.tree_type, treeType)
            )
          )
          .limit(1)
          .execute();

        if (nextLevelResponses.length) {
          nextResponse = nextLevelResponses[0];
          console.log("Found next response at next level:", nextResponse);
        }
      }
    }

    if (!nextResponse) {
      console.log("No next response found, ending conversation");
      return null;
    }

    // Get options for the next response
    const nextOptions = await db
      .select()
      .from(MC_DEBATE_OPTIONS)
      .where(eq(MC_DEBATE_OPTIONS.mc_response_id, nextResponse.id))
      .execute();

    console.log(`Found ${nextOptions.length} options for next response`);

    const formattedNextQuestion = {
      id: nextResponse.id,
      question_text: `AI Response - Round ${nextResponse.level}`,
      ai_message: nextResponse.ai_message,
      ai_persona: nextResponse.ai_persona,
      level: nextResponse.level,
      tree_type: nextResponse.tree_type,
      options: nextOptions.map((opt, index) => ({
        id: opt.id,
        option_text: opt.option_text,
        option_letter: opt.option_letter || String.fromCharCode(65 + index), // A, B, C...
        option_position: opt.option_position,
        leads_to_response_id: opt.leads_to_response_id,
        is_terminal: opt.is_terminal
      }))
    };

    console.log("Returning formatted next question:", formattedNextQuestion);
    return formattedNextQuestion;

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
  
  // Await params before accessing debateId
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
      debate_type: "user_vs_ai",
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
  
  console.log(`AI vs AI: Current round ${room.conversation_count}, new round ${newRound}, max rounds ${room.max_conversations}`);

  // Update conversation count
  await db
    .update(AI_DEBATE_ROOMS)
    .set({ conversation_count: newRound })
    .where(eq(AI_DEBATE_ROOMS.id, debateId))
    .execute();

  let debateCompleted = false;
  let report = null;

  // Check if all conversations are shown - when we reach max_conversations
  if (newRound >= room.max_conversations) {
    console.log("AI vs AI debate completed");
    await db.update(AI_DEBATE_ROOMS).set({ status: "completed" }).where(eq(AI_DEBATE_ROOMS.id, debateId)).execute();

    // Generate completion report for AI vs AI
    const reportData = {
      overall_analysis: "You observed a structured debate between two AI perspectives, gaining insights into different approaches to argumentation and critical thinking. The debate showcased how different viewpoints can be presented logically and persuasively.",
      strengths: "You demonstrated patience and engagement by following the entire debate sequence, observing how arguments develop and counter-arguments are formed. Your attention to the complete discussion shows good analytical engagement.",
      improvements: "Consider taking notes during future AI debates to better analyze the argumentation techniques, logical structures, and persuasion strategies used by each side. This will help you develop your own debate skills.",
      insights: "Watching structured debates helps develop critical thinking skills. Notice how each side builds upon previous points, addresses counterarguments, and maintains logical consistency throughout the discussion. This observation can improve your own argumentation abilities.",
      argument_quality_score: 8,
      persuasiveness_score: 7,
      factual_accuracy_score: 8,
      logical_consistency_score: 8,
      winner: "tie",
    };

    // Create debate report object for AI vs AI
    const debateReport = {
      debate_room_id: debateId,
      user_id: userId,
      debate_type: "ai_vs_ai",
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
      remainingTurns: Math.max(0, room.max_conversations - newRound),
    },
    { status: 200 }
  );
}

async function handleMCQ(room, selectedOptionId, userId, debateId) {
  const currentLevel = room.conversation_count + 1;
  
  console.log(`MCQ: Current level ${room.conversation_count}, new level ${currentLevel}, selected option ${selectedOptionId}`);
  console.log(`MCQ: Room tree_type = ${room.tree_type}, selected_user_stance = ${room.selected_user_stance}`);

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
    console.log("Selected option details:", option);
    
    // Get the tree type from the room (this was set during creation)
    const treeType = room.tree_type || 'ai_for'; // Default fallback
    
    // Get the next question based on the selected option and tree type
    const nextQuestion = await getRealNextMCQQuestion(selectedOptionId, currentLevel, treeType);

    // Update conversation count
    await db
      .update(AI_DEBATE_ROOMS)
      .set({ conversation_count: currentLevel })
      .where(eq(AI_DEBATE_ROOMS.id, debateId))
      .execute();

    let isCompleted = false;
    let report = null;

    // Check completion - should only complete if no next question OR terminal OR exceed max level
    if (!nextQuestion || option.is_terminal || currentLevel >= 5) {
      console.log("MCQ debate completed - no next question or terminal or max level reached");
      
      // Mark as completed
      await db
        .update(AI_DEBATE_ROOMS)
        .set({ status: "completed" })
        .where(eq(AI_DEBATE_ROOMS.id, debateId))
        .execute();

      // Generate completion report with user stance information
      const userStanceText = room.selected_user_stance === 'for' ? 'supporting' : 'opposing';
      const aiPositionText = treeType === 'ai_for' ? 'supporting' : 'opposing';
      
      const reportData = {
        overall_analysis: `You navigated through a complex decision tree, making thoughtful choices at each step of the debate. Your selections demonstrate engagement with different perspectives while consistently ${userStanceText} the main position against AI arguments ${aiPositionText} it.`,
        strengths: `You maintained a consistent ${userStanceText} stance throughout the decision tree while carefully considering each response option. Your choices reflect analytical thinking and willingness to explore nuanced aspects of the topic through structured decision-making.`,
        improvements: "Consider spending more time analyzing the implications of each choice and how they build upon previous decisions. Think about how your choices might lead to different outcomes and conclusions in future scenarios, and explore alternative reasoning paths.",
        insights: `Decision tree exercises help develop systematic thinking and consequence evaluation skills. By consistently ${userStanceText} the position, you practiced defending a viewpoint while navigating AI counter-arguments, which strengthens your ability to maintain logical consistency in debates.`,
        argument_quality_score: 7,
        persuasiveness_score: 6,
        factual_accuracy_score: 7,
        logical_consistency_score: 8,
        choice_count: currentLevel,
        user_stance: userStanceText,
        tree_type: treeType,
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

    console.log(`MCQ result: isCompleted=${isCompleted}, nextQuestion exists=${!!nextQuestion}`);

    return NextResponse.json(
      {
        success: true,
        nextQuestion: nextQuestion ? {
          ...nextQuestion,
          level: nextQuestion.level,
          ai_persona: nextQuestion.ai_persona,
          tree_type: nextQuestion.tree_type
        } : null,
        isCompleted,
        report,
        currentLevel: currentLevel,
        remainingLevels: Math.max(0, 5 - currentLevel),
        selectedChoice: {
          option_text: option.option_text,
          option_position: option.option_position
        },
        treeType: treeType,
        userStance: room.selected_user_stance
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in handleMCQ:", error);
    throw error;
  }
}