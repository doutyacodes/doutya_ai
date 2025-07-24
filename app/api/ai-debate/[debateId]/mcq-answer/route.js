// /api/ai-debate/[debateId]/mcq-answer/route.js
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import axios from "axios";
import {
  AI_DEBATE_ROOMS,
  AI_DEBATE_QUESTIONS,
  AI_DEBATE_MCQ_OPTIONS,
  AI_DEBATE_MCQ_RESPONSES,
  AI_DEBATE_REPORTS,
} from "@/utils/schema";
import { db } from "@/utils";
import { eq, and } from "drizzle-orm";

async function generateMCQReport(debateRoom, questions, responses) {
  const userAnswers = responses.map((response, index) => {
    const question = questions.find(q => q.id === response.question_id);
    const selectedOption = question?.options?.find(opt => opt.id === response.selected_option_id);
    
    return {
      question: question?.question_text || "",
      ai_answer: question?.ai_answer || "",
      user_choice: selectedOption?.option_text || "",
      option_letter: selectedOption?.option_letter || ""
    };
  });

  const prompt = `
    Analyze this MCQ debate session and provide a comprehensive report:
    
    Topic: "${debateRoom.topic}"
    
    Questions and Responses:
    ${userAnswers.map((answer, i) => `
    Question ${i + 1}: ${answer.question}
    AI's Answer: ${answer.ai_answer}
    User chose (${answer.option_letter}): ${answer.user_choice}
    `).join('\n')}
    
    Please provide a detailed analysis in the following JSON format:
    {
      "overall_analysis": "Comprehensive overview of the user's understanding and critical thinking (3-4 sentences)",
      "strengths": "Specific strengths in reasoning and perspective-taking (2-3 sentences)", 
      "improvements": "Areas for improvement in analysis and decision-making (2-3 sentences)",
      "insights": "Key insights about thinking patterns and recommendations (2-3 sentences)",
      "argument_quality_score": <number between 1-10 based on reasoning depth>,
      "persuasiveness_score": <number between 1-10 based on choice consistency>,
      "factual_accuracy_score": <number between 1-10 based on realistic choices>,
      "logical_consistency_score": <number between 1-10 based on answer patterns>,
      "mcq_score": <number of questions where user showed good reasoning>,
      "knowledge_depth_score": <number between 1-10 based on understanding shown>
    }
    
    Focus on constructive feedback that helps improve critical thinking and decision-making skills.
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
    console.error("Error generating MCQ report:", error);
    return {
      overall_analysis:
        "You engaged thoughtfully with the questions, demonstrating consideration for multiple perspectives on complex topics.",
      strengths:
        "You showed good engagement with the material and willingness to consider different viewpoints in your responses.",
      improvements:
        "Consider spending more time analyzing the nuances of each option and their potential implications.",
      insights:
        "Your choices reflect thoughtful consideration. Continue practicing critical analysis to strengthen decision-making skills.",
      argument_quality_score: 7,
      persuasiveness_score: 6,
      factual_accuracy_score: 7,
      logical_consistency_score: 7,
      mcq_score: Math.floor(responses.length * 0.7),
      knowledge_depth_score: 7,
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
  const { questionId, selectedOptionId } = await request.json();

  if (!questionId || !selectedOptionId) {
    return NextResponse.json(
      { error: "Question ID and selected option ID are required." },
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
          eq(AI_DEBATE_ROOMS.user_id, userId),
          eq(AI_DEBATE_ROOMS.debate_type, "mcq")
        )
      )
      .limit(1)
      .execute();

    if (debateRoom.length === 0) {
      return NextResponse.json(
        { error: "MCQ debate room not found." },
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

    // Verify the question belongs to this debate
    const question = await db
      .select()
      .from(AI_DEBATE_QUESTIONS)
      .where(
        and(
          eq(AI_DEBATE_QUESTIONS.id, questionId),
          eq(AI_DEBATE_QUESTIONS.debate_room_id, debateId)
        )
      )
      .limit(1)
      .execute();

    if (question.length === 0) {
      return NextResponse.json(
        { error: "Question not found for this debate." },
        { status: 404 }
      );
    }

    // Verify the selected option belongs to this question
    const selectedOption = await db
      .select()
      .from(AI_DEBATE_MCQ_OPTIONS)
      .where(
        and(
          eq(AI_DEBATE_MCQ_OPTIONS.id, selectedOptionId),
          eq(AI_DEBATE_MCQ_OPTIONS.question_id, questionId)
        )
      )
      .limit(1)
      .execute();

    if (selectedOption.length === 0) {
      return NextResponse.json(
        { error: "Selected option not found for this question." },
        { status: 404 }
      );
    }

    // Check if user already answered this question
    const existingResponse = await db
      .select()
      .from(AI_DEBATE_MCQ_RESPONSES)
      .where(
        and(
          eq(AI_DEBATE_MCQ_RESPONSES.user_id, userId),
          eq(AI_DEBATE_MCQ_RESPONSES.question_id, questionId)
        )
      )
      .limit(1)
      .execute();

    if (existingResponse.length > 0) {
      return NextResponse.json(
        { error: "You have already answered this question." },
        { status: 400 }
      );
    }

    // Save user's response
    await db.insert(AI_DEBATE_MCQ_RESPONSES).values({
      debate_room_id: debateId,
      question_id: questionId,
      user_id: userId,
      selected_option_id: selectedOptionId,
    }).execute();

    // Update current question index
    const newQuestionIndex = room.current_question_index + 1;
    
    await db
      .update(AI_DEBATE_ROOMS)
      .set({ 
        current_question_index: newQuestionIndex,
        conversation_count: newQuestionIndex 
      })
      .where(eq(AI_DEBATE_ROOMS.id, debateId))
      .execute();

    let isCompleted = false;
    let nextQuestion = null;
    let report = null;

    // Check if all questions are answered
    if (newQuestionIndex >= room.total_questions) {
      // Mark debate as completed
      await db
        .update(AI_DEBATE_ROOMS)
        .set({ status: "completed" })
        .where(eq(AI_DEBATE_ROOMS.id, debateId))
        .execute();

      // Get all questions and responses for report generation
      const allQuestions = await db
        .select()
        .from(AI_DEBATE_QUESTIONS)
        .where(eq(AI_DEBATE_QUESTIONS.debate_room_id, debateId))
        .execute();

      const allResponses = await db
        .select()
        .from(AI_DEBATE_MCQ_RESPONSES)
        .where(eq(AI_DEBATE_MCQ_RESPONSES.debate_room_id, debateId))
        .execute();

      // Add options to questions
      for (let question of allQuestions) {
        const options = await db
          .select()
          .from(AI_DEBATE_MCQ_OPTIONS)
          .where(eq(AI_DEBATE_MCQ_OPTIONS.question_id, question.id))
          .execute();
        question.options = options;
      }

      // Generate report
      const reportData = await generateMCQReport(room, allQuestions, allResponses);

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
    } else {
      // Get next question
      const nextQuestionData = await db
        .select()
        .from(AI_DEBATE_QUESTIONS)
        .where(
          and(
            eq(AI_DEBATE_QUESTIONS.debate_room_id, debateId),
            eq(AI_DEBATE_QUESTIONS.question_index, newQuestionIndex + 1)
          )
        )
        .limit(1)
        .execute();

      if (nextQuestionData.length > 0) {
        const nextQ = nextQuestionData[0];
        const nextOptions = await db
          .select()
          .from(AI_DEBATE_MCQ_OPTIONS)
          .where(eq(AI_DEBATE_MCQ_OPTIONS.question_id, nextQ.id))
          .execute();

        nextQuestion = {
          ...nextQ,
          options: nextOptions,
        };
      }
    }

    return NextResponse.json(
      {
        success: true,
        isCompleted,
        nextQuestion,
        report,
        currentQuestionIndex: newQuestionIndex,
        remainingQuestions: room.total_questions - newQuestionIndex,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing MCQ answer:", error);
    return NextResponse.json(
      {
        error: "Failed to process answer",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}