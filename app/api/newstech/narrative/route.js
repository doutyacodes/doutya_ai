// import { NextResponse } from 'next/server';
// import axios from 'axios';

// export async function POST(request) {
//   try {
//     // Parse the request body
//     const requestBody = await request.json();
//     const { biasList, ageRange, location, audienceType, originalArticle } = requestBody;

//     // Format the bias list for the prompt template
//     const formattedBiasList = biasList.map(bias => ({
//       biasType: bias.type,
//       entity: bias.entity,
//       percentage: bias.percentage
//     }));
// console.log(formattedBiasList.map(bias => `- ${bias.biasType}: "${bias.entity}" — ${bias.percentage}%`).join('\n'))
//     // Create the prompt using the template
//     const prompt = `
// You are an expert journalist and political writer. Your task is to rewrite the given news article according to the custom instructions below.
// -----------------------------
// 🔵 Bias Configuration:
// - Rewrite the article to reflect the following bias levels.
// - Apply each bias naturally and contextually. Do not force names if they don't fit.
// ${formattedBiasList.map(bias => `- ${bias.biasType}: "${bias.entity}" — ${bias.percentage}%`).join('\n')}
// -----------------------------
// 🟢 Target Age Group:
// Write the article for readers aged ${ageRange}. Use vocabulary, tone, and references appropriate for this age group.
// -----------------------------
// 🟣 Target Location:
// Assume the article is intended for people in ${location}. Tailor cultural or regional references to this area if relevant.
// -----------------------------
// 🟡 Audience Type:
// The audience is: ${audienceType}.
// Adjust language and tone to be relevant and relatable to this group.
// -----------------------------
// 📰 Original Article:
// ${originalArticle}
// -----------------------------
// 🎯 Guidelines:
// - Maintain the core facts of the article.
// - Use natural, subtle framing to apply bias — do not alter or fabricate facts.
// - Bias should be reflected through tone, emphasis, or omission, not through lies.
// - The final article should feel like a natural news piece written for the specified group and location.
// - Provide ONLY the rewritten article with no additional explanation or commentary.
// `;

//     console.log("Sending request to OpenAI...");
    
//     // Call the OpenAI API
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-4o-mini", 
//         messages: [{ role: "user", content: prompt }],
//         max_tokens: 5000,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
    
//     console.log("API request completed.");
    
//     // Extract the response text
//     const responseText = response.data.choices[0].message.content.trim();
    
//     // Return the rewritten article
//     return NextResponse.json({ 
//       rewrittenArticle: responseText,
//       status: "success" 
//     });
    
//   } catch (error) {
//     console.error("Error in article rewrite API:", error);
    
//     // Return a proper error response
//     return NextResponse.json(
//       { 
//         error: "Failed to rewrite article", 
//         message: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';
import axios from 'axios';
import { authenticate } from '@/lib/jwtMiddleware';
import { NARRATIVES, NARRATIVE_BIASES } from '@/utils/schema'; // adjust paths
import { desc, eq } from 'drizzle-orm';
import { db } from '@/utils';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Authenticate the request
    const authResult = await authenticate(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const userData = authResult.decoded_Data;
    const userId = userData.id;

    // Parse the request body
    const requestBody = await request.json();
    const { biasList, ageRange, location, audienceType, originalArticle } = requestBody;

    const formattedBiasList = biasList.map(bias => ({
      biasType: bias.type,
      entity: bias.entity,
      percentage: bias.percentage,
    }));

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

    // Send to OpenAI
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

    const rewrittenArticle = response.data.choices[0].message.content.trim();

    // Save narrative to database
    const insertNarrative = await db
      .insert(NARRATIVES)
      .values({
        originalArticle,
        rewrittenArticle,
        ageRange,
        location,
        audienceType,
        createdBy: userId,
      });

    // Get the inserted narrative's ID
    const [inserted] = await db
      .select({ id: NARRATIVES.id })
      .from(NARRATIVES)
      .orderBy(desc(NARRATIVES.id))
      .limit(1);

    const narrativeId = inserted.id;

    // Insert all related biases
    const biasesToInsert = formattedBiasList.map(bias => ({
      narrativeId,
      biasType: bias.biasType,
      entity: bias.entity,
      percentage: bias.percentage,
    }));

    await db.insert(NARRATIVE_BIASES).values(biasesToInsert);

    return NextResponse.json({
      status: "success",
      message: "Narrative generated and saved successfully",
      data: {
        narrativeId,
        rewrittenArticle,
      },
    });

  } catch (error) {
    console.error("Error in narrative generation API:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to process request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
