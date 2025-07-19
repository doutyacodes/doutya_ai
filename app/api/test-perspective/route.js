import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const { baseTitle, baseDescription, customViewpoint } = await request.json();

    if (!baseTitle || !baseDescription) {
      return NextResponse.json(
        { error: "Base title and description are required." },
        { status: 400 }
      );
    }

    if (!customViewpoint || !customViewpoint.trim()) {
      return NextResponse.json(
        { error: "Custom viewpoint is required." },
        { status: 400 }
      );
    }

    const selectedViewpoint = customViewpoint.trim();

    // Create OpenAI prompt for the test perspective
    const prompt = `
      Based on the following news:
      Title: "${baseTitle}"
      Description: "${baseDescription}"

      Rewrite this news from the perspective of: ${selectedViewpoint}.
      
      The perspective should have:
        1. A unique and engaging title tailored to that specific viewpoint.
        2. A rewritten description in the third person, following a structured news reporting format with multiple paragraphs.
        3. Focus on how this news specifically impacts or relates to the viewpoint's area of expertise/concern.
        4. Use professional journalistic tone while maintaining the perspective's unique angle.
        5. The description should be approximately 1800-2000 characters to ensure depth and detail.
        6. Maintain factual accuracy throughout.

      Respond in JSON format:
      {
        "viewpoint": "${selectedViewpoint}",
        "title": "<title for this viewpoint>",
        "description": "<detailed description from this viewpoint>"
      }
    `;

    // Make OpenAI API call
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

    console.log("OpenAI Response for test perspective:", responseText);

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      return NextResponse.json(
        { error: "Failed to generate test perspective content. Please try again." },
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

    // Return the generated perspective
    return NextResponse.json(
      {
        success: true,
        perspective: {
          viewpoint: parsedData.viewpoint,
          title: parsedData.title,
          description: parsedData.description
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error generating test perspective:", error);
    
    // Handle specific OpenAI API errors
    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: "Service temporarily busy. Please try again in a moment." },
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
        error: "Failed to generate test perspective", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}