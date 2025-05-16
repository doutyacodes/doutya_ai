import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    // Parse the request body
    const requestBody = await request.json();
    const { biasList, ageRange, location, audienceType, originalArticle } = requestBody;

    // Format the bias list for the prompt template
    const formattedBiasList = biasList.map(bias => ({
      biasType: bias.type,
      entity: bias.entity,
      percentage: bias.percentage
    }));
console.log(formattedBiasList.map(bias => `- ${bias.biasType}: "${bias.entity}" — ${bias.percentage}%`).join('\n'))
    // Create the prompt using the template
    const prompt = `
You are an expert journalist and political writer. Your task is to rewrite the given news article according to the custom instructions below.
-----------------------------
🔵 Bias Configuration:
- Rewrite the article to reflect the following bias levels.
- Apply each bias naturally and contextually. Do not force names if they don't fit.
${formattedBiasList.map(bias => `- ${bias.biasType}: "${bias.entity}" — ${bias.percentage}%`).join('\n')}
-----------------------------
🟢 Target Age Group:
Write the article for readers aged ${ageRange}. Use vocabulary, tone, and references appropriate for this age group.
-----------------------------
🟣 Target Location:
Assume the article is intended for people in ${location}. Tailor cultural or regional references to this area if relevant.
-----------------------------
🟡 Audience Type:
The audience is: ${audienceType}.
Adjust language and tone to be relevant and relatable to this group.
-----------------------------
📰 Original Article:
${originalArticle}
-----------------------------
🎯 Guidelines:
- Maintain the core facts of the article.
- Use natural, subtle framing to apply bias — do not alter or fabricate facts.
- Bias should be reflected through tone, emphasis, or omission, not through lies.
- The final article should feel like a natural news piece written for the specified group and location.
- Provide ONLY the rewritten article with no additional explanation or commentary.
`;

    console.log("Sending request to OpenAI...");
    
    // Call the OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", 
        messages: [{ role: "user", content: prompt }],
        max_tokens: 5000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log("API request completed.");
    
    // Extract the response text
    const responseText = response.data.choices[0].message.content.trim();
    
    // Return the rewritten article
    return NextResponse.json({ 
      rewrittenArticle: responseText,
      status: "success" 
    });
    
  } catch (error) {
    console.error("Error in article rewrite API:", error);
    
    // Return a proper error response
    return NextResponse.json(
      { 
        error: "Failed to rewrite article", 
        message: error.message 
      },
      { status: 500 }
    );
  }
}