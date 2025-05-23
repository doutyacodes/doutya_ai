import { NextResponse } from 'next/server';
import axios from 'axios';
import { authenticate } from '@/lib/jwtMiddleware';
import { ARTICLE_ANALYSIS } from '@/utils/schema';
import { db } from '@/utils';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

const ANALYSIS_PROMPT = `You are a professional media analyst bot integrated into an application backend. Analyze the following news article thoroughly and return a comprehensive, structured JSON report. Return ONLY valid JSON without any markdown formatting or code blocks.

Structure your response as a JSON object with these exact keys. Only respond with JSON in the following structure:

{
  "politicalLeaning": "string - left/right/center/neutral with explanation",
  "framingBias": "string - detailed description of story presentation and angle",
  "omissionBias": "string - list notable missing elements or counterpoints",
  "toneAnalysis": "string - emotional temperature and descriptive phrasing",
  "quoteBalance": "string - analysis of quoted voices and representation balance",
  "overallSentiment": "string - positive/negative/neutral with explanation",
  "emotionalTone": "string - underlying emotions with text examples",
  "headlineVsBodyConsistency": "string - alignment analysis between headline and content",
  "readabilityScore": number - Flesch-Kincaid Grade Level (numeric value),
  "jargonDetected": "string - industry-specific language and accessibility impact",
  "writingStyle": "string - formal/sensational/technical/plain description",
  "passiveVoiceUsage": "string - identification of passive constructions",
  "numCitedSources": number - count of sources (named, anonymous, official, public),
  "sourceReputation": "string - trustworthiness assessment of sources",
  "factCheckItems": "string - claims that could be fact-checked",
  "timeToClarity": "string - how quickly core message is presented",
  "insightRatio": "string - value vs length evaluation", 
  "ambiguityScore": "string - assessment of vague language and unclear definitions",
  "predictedDwellTime": "string - estimated reading time based on complexity",
  "scrollDepthPrediction": "string - likelihood of readers reaching the end",
  "expectedBounceRetention": "string - prediction of user engagement",
  "headlineViralityScore": number - score from 1-10 based on emotional impact,
  "socialBiasRisk": "string - potential for misinterpretation or polarized reactions",
  "clickbaitRisk": "string - assessment of headline exaggeration or misleading nature"
}

News Article Title: "{TITLE}"
News Article Content: "{ARTICLE}"

Return only the JSON object, no additional text or formatting.`;

export async function POST(request) {
  try {
    // Authenticate the request
    const authResult = await authenticate(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const userData = authResult.decoded_Data;
    const userId = userData.id;

    // Parse request body
    const { title, article } = await request.json();

    if (!title || !article) {
      return NextResponse.json(
        { error: 'Title and article content are required' },
        { status: 400 }
      );
    }

    // Create the analysis prompt
    const prompt = ANALYSIS_PROMPT
      .replace('{TITLE}', title)
      .replace('{ARTICLE}', article);

    console.log("prompt", prompt);
    
    // Call OpenAI API with retry logic
    let responseText = '';
    let parsedData = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts && !parsedData) {
      attempts++;
      
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              { 
                role: "system", 
                content: "You are a professional media analyst. Always return complete, valid JSON responses. Never truncate your response." 
              },
              { role: "user", content: prompt }
            ],
            max_tokens: 6000, // Increased token limit
            temperature: 0.2, // Lower temperature for more consistent responses
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 60000, // 60 second timeout
          }
        );

        responseText = response.data.choices[0].message.content.trim();
        
        // More aggressive cleanup
        responseText = responseText
          .replace(/```json|```/g, "")
          .replace(/^[^{]*({.*})[^}]*$/s, '$1') // Extract only the JSON object
          .trim();
        
        console.log(`AI Response (Attempt ${attempts}):`, responseText.substring(0, 200) + "...");

        // Validate it's proper JSON before parsing
        if (!responseText.startsWith('{') || !responseText.endsWith('}')) {
          throw new Error('Response is not a valid JSON object');
        }

        // Check if response seems complete (has closing brace)
        const openBraces = (responseText.match(/{/g) || []).length;
        const closeBraces = (responseText.match(/}/g) || []).length;
        
        if (openBraces !== closeBraces) {
          throw new Error('Incomplete JSON response - mismatched braces');
        }

        // Try to parse
        parsedData = JSON.parse(responseText);
        
        // Validate required fields are present
        const requiredFields = ['politicalLeaning', 'overallSentiment', 'readabilityScore'];
        const missingFields = requiredFields.filter(field => !parsedData[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Incomplete response - missing fields: ${missingFields.join(', ')}`);
        }

        console.log(`Successfully parsed response on attempt ${attempts}`);
        break;

      } catch (parseError) {
        console.error(`Parse Error on attempt ${attempts}:`, parseError.message);
        console.error("Raw Response:", responseText);
        
        if (attempts >= maxAttempts) {
          return NextResponse.json(
            { 
              error: 'Failed to get valid analysis after multiple attempts. Please try again.',
              details: parseError.message 
            },
            { status: 500 }
          );
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    // Prepare data for database insertion
    const analysisData = {
      originalArticle: `${title}\n\n${article}`,
      politicalLeaning: parsedData.politicalLeaning || null,
      framingBias: parsedData.framingBias || null,
      omissionBias: parsedData.omissionBias || null,
      toneAnalysis: parsedData.toneAnalysis || null,
      quoteBalance: parsedData.quoteBalance || null,
      overallSentiment: parsedData.overallSentiment || null,
      emotionalTone: parsedData.emotionalTone || null,
      headlineVsBodyConsistency: parsedData.headlineVsBodyConsistency || null,
      readabilityScore: parsedData.readabilityScore || null,
      jargonDetected: parsedData.jargonDetected || null,
      writingStyle: parsedData.writingStyle || null,
      passiveVoiceUsage: parsedData.passiveVoiceUsage || null,
      numCitedSources: parsedData.numCitedSources || 0,
      sourceReputation: parsedData.sourceReputation || null,
      factCheckItems: parsedData.factCheckItems || null,
      timeToClarity: parsedData.timeToClarity || null,
      insightRatio: parsedData.insightRatio || null,
      ambiguityScore: parsedData.ambiguityScore || null,
      predictedDwellTime: parsedData.predictedDwellTime || null,
      scrollDepthPrediction: parsedData.scrollDepthPrediction || null,
      expectedBounceRetention: parsedData.expectedBounceRetention || null,
      headlineViralityScore: parsedData.headlineViralityScore || null,
      socialBiasRisk: parsedData.socialBiasRisk || null,
      clickbaitRisk: parsedData.clickbaitRisk || null,
      createdBy: userId,
    };

    // Insert into database
    const [result] = await db
      .insert(ARTICLE_ANALYSIS)
      .values(analysisData)

    const analysisId = result.insertId;

    // Return success response with analysis data
    return NextResponse.json({
      status: "success",
      message: "Article analysis completed successfully",
      analysisId,
      data: {
        ...parsedData,
        title,
        createdAt: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Analysis Error:', error);
    
    // Handle specific error types
    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze article. Please try again.' },
      { status: 500 }
    );
  }
}