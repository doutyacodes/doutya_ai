import { NextResponse } from "next/server";
import axios from "axios";
import { COURSES } from "@/utils/schema";
import { db } from "@/utils";
import { generateUniqueSlug } from "@/lib/utils";
import { authenticate } from "@/lib/jwtMiddleware";
import { and, eq } from "drizzle-orm";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const authResult = await authenticate(request, true);
    if (!authResult.authenticated) {
      return authResult.response; // Return the response if authentication fails
    }

    const userId = authResult.decoded_Data.id;
    const {
      courseName,
      language,
      difficulty,
      age,
      type,
      childId,
      label,
      genre,
    } = await request.json();

    // Basic validation
    if (![courseName, language, difficulty, age].every(field => field?.toString().trim())) {
      return NextResponse.json(
        { message: "All fields are required and must not be empty." },
        { status: 400 }
      );
    }

    // Check for existing course
    const existingCourse = await db
      .select()
      .from(COURSES)
      .where(
        and(
          eq(COURSES.name, courseName),
          eq(COURSES.age, age),
          eq(COURSES.language, language),
          eq(COURSES.type, type),
          (type=="story" && type=="story") && eq(COURSES.genre, genre)
        )
      );

      console.log("hello",existingCourse)

    if (existingCourse.length > 0) {
      const course = existingCourse[0];
      const courseData = JSON.parse(course.chapter_content || "{}");

      // Structure response based on course type
      let structuredResponse;
      if (["story", "bedtime story", "informative story", "podcast"].includes(type)) {
        structuredResponse = {
          courseName,
          genre,
          label,
          language,
          difficulty,
          age,
          type,
          title: courseData.title,
          introduction: { content: courseData.introduction?.content },
          body: courseData.body?.map(paragraph => ({ content: paragraph.content })) || [],
          conclusion: { content: courseData.conclusion?.content },
        };
      } else if (type === "poem") {
        structuredResponse = {
          courseName,
          language,
          difficulty,
          age,
          type,
          title: courseData.title,
          verses: courseData.verses?.map(verse => ({ line: verse.line })) || [],
        };
      } else if (type === "presentation") {
        structuredResponse = {
          courseName,
          language,
          difficulty,
          age,
          type,
          presentation: {
            title: courseData.presentation?.title,
            slides: courseData.presentation?.slides?.map(slide => ({
              slide_number: slide.slide_number,
              content: slide.content?.map(item => ({
                content: item.content,
                image_suggestion: item.image_suggestion,
                additional_resources: item.additional_resources,
              })) || [],
            })) || [],
          },
        };
      } else if (type === "course") {
        structuredResponse = {
          courseName,
          language,
          difficulty,
          age,
          type,
          courseContent: {
            introduction: { content: courseData.introduction?.content },
            body: {
              modules: courseData.body?.modules?.map(module => ({
                module_number: module.module_number,
                title: module.title,
                subtopics: module.subtopics?.map(subtopic => ({
                  title: subtopic.title,
                })) || [],
              })) || [],
            },
            conclusion: { content: courseData.conclusion?.content },
          },
        };
      } else {
        structuredResponse = {
          courseName,
          language,
          difficulty,
          age,
          type,
          essayContent: {
            introduction: { content: courseData.introduction?.content },
            body: {
              sections: courseData.body?.sections?.map(section => ({
                title: section.title,
                content: section.content,
                subtopics: section.subtopics?.map(subtopic => ({
                  title: subtopic.title,
                  content: subtopic.content,
                })) || [],
              })) || [],
            },
            conclusion: { content: courseData.conclusion?.content },
          },
        };
      }

      return NextResponse.json(
        {
          message: "Course already exists for this user",
          content: structuredResponse,
        },
        { status: 200 }
      );
    }

    // Check for the OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { message: "API Key is missing in environment variables." },
        { status: 500 }
      );
    }

    const prompt = generatePrompt(courseName, language, difficulty, age, type, genre, label);
    let chatGptResponse;

    try {
      chatGptResponse = await axios.post(
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
    } catch (apiError) {
      console.error("API Request Error:", apiError.response ? apiError.response.data : apiError.message);
      return NextResponse.json(
        { message: "Error with OpenAI API request", error: apiError.message },
        { status: 500 }
      );
    }
    
    const responseContent = chatGptResponse.data.choices?.[0]?.message?.content.trim();
    console.log("prompt",responseContent)
    if (!responseContent) {
      return NextResponse.json(
        { message: "No response content from OpenAI API." },
        { status: 500 }
      );
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseContent.replace(/```json|```/g, "").trim());
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError);
      return NextResponse.json(
        {
          message: "Error parsing API response as JSON",
          error: jsonError.message,
        },
        { status: 500 }
      );
    }

    // Insert the new course into the database
    const courseInsert = await db.insert(COURSES).values({
      name: courseName,
      language,
      difficulty,
      age,
      slug: generateUniqueSlug(),
      type,
      genre,
      label,
      chapter_content: JSON.stringify(parsedData),
      user_id: userId,
      child_id: childId, // Pass selected child ID
    });

    const courseId = courseInsert[0]?.insertId;
    if (!courseId) throw new Error("Course insertion did not return an insertId");

    return NextResponse.json(
      { message: "Course created successfully!", content: parsedData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in /api/search:", error);
    return NextResponse.json(
      { message: "Error processing your request", error: error.message },
      { status: 500 }
    );
  }
}
function generatePrompt(courseName, language, difficulty, age, type,genre,label) {
  if (
    ["story", "bedtime story", "poem", "informative story", "podcast"].includes(
      type
    )
  ) {
    return `
      Create a JSON object for a ${
        type === "poem" ? "poem" : type == "podcast" ? "transcript" : type
      } on the topic of "${courseName}" in "${language}" for readers ${age} years old.
      The ${type} should be engaging and age-appropriate${
      type == "informative story" &&
      " with the history and relevant facts about the topic"
    }${type=="story" && genre && genre !="Any" && "The genre should be "+ genre +" and "+ label}.Ensure that the response returning should be a json file without description or comments.
      
      Structure:
      - If it’s a "story" or "bedtime story" or "informative story" or "podcast":
        {"courseName": "${courseName}",
      "language": "${language}",
      "difficulty": "${difficulty}",
      "genre": "${genre}",
      "label": "${label}",
      "age": ${age},
      "type": ${type},
          "title": "${type} Title",
          "introduction": {
            "content": "Introduction to set the scene or introduce main characters."
          },
          "body": [
            {
              "content": "Each main paragraph of the story in sequence."
            }
          ],
          "conclusion": {
            "content": "Ending or moral of the story."
          }
        }

      - If it’s a "poem":
        {
      "courseName": "${courseName}",
      "language": "${language}",
      "difficulty": "${difficulty}",
      "age": ${age},
      "type": ${type},
          "title": "Poem Title",
          "verses": [
            {
              "line": "Each line of the poem."
            }
          ]
        }
    `;
  }
  if (["explanation"].includes(type)) {
    return `
      Create a JSON object for an explanation on the topic of "${courseName}" in "${language}" for readers ${age} years old.
      The ${type} should be age-appropriate.
      
      Structure:
        {"courseName": "${courseName}",
      "language": "${language}",
      "difficulty": "${difficulty}",
      "age": ${age},
      "type": ${type},
          "title": "Explanation Title",
          "introduction": {
            "content": "Introduction to explanation."
          },
          "body": [
            {
              "content": "Each main paragraph of the explanation."
            }
          ],
          "conclusion": {
            "content": "Ending or moral of the story."
          }
        }

      
    `;
  }

  if (type == "presentation") {
    return `
      Generate a detailed and comprehensive JSON object for a presentation on the topic of "${courseName}", written in "${language}" and tailored to a "${difficulty}" level for a reader ${age} years old.
      The presentation should dynamically generate slides relevant to "${courseName}", with each slide tailored to provide a clear and engaging understanding of the subject. The presentation should contain at least 12 slides. Include relevant image suggestions and supporting materials wherever applicable.
  
      JSON Structure Example:
      {
        "courseName": "${courseName}",
        "language": "${language}",
        "difficulty": "${difficulty}",
        "age": ${age},
        "type": "${type}",
        "presentation": {
          "title": "Appropriate title for the presentation",
          "slides": [
            {
              "slide_number": "Slide number",
              "content": [
                {
                  "content": "Detailed content related to the slide.",
                  "image_suggestion": "Image URL or description",
                  "additional_resources": "Links or references for further reading"
                }
                // More content objects if needed
              ]
            }
            // More slides as needed
          ]
        }
      }
    `;
  }

  if (type == "course") {
    return `
     Generate a detailed and comprehensive JSON object for a course on the topic of "${courseName}," written in "${language}" and tailored to a "${difficulty}" level for a reader ${age} years old.
    The ${type} should dynamically generate modules and subtopics relevant to "${courseName}", with each modules and subtopics tailored to provide a clear and engaging understanding of the subject. 
    Structure the ${type} in JSON format with an "introduction," a "body" containing "sections" and dynamically generated "subtopics" based on the modules's depth, and a "conclusion" to summarize key points.Ensure that the number of subtopics generated is not fixed for each module content. 
    
    JSON Structure Example:
    {
      "courseName": "${courseName}",
      "language": "${language}",
      "difficulty": "${difficulty}",
      "age": ${age},
      "type": ${type},
      "courseContent": {
        "introduction": {
          "content": "A brief, age-appropriate introduction to the topic."
        },
        "body": {
          "modules": [
            {
          "module_number":" module number",
              "title": "Dynamic Section Title",
              "subtopics": [
                {
                  "title": "Dynamic Subtopic Title",
                }
              ]
            }
          ]
        },
        "conclusion": {
          "content": "A concise summary of the main points covered in the course."
        }
      }
    }
    `;
  }

  return `
    Generate a detailed and comprehensive JSON object for ${
      type == "essay" ? "an " + type : "a " + type
    } on the topic of "${courseName}," written in "${language}" and tailored to a "${difficulty}" level for a reader ${age} years old, making the tone age-appropriate and ${
    age <= 8
      ? "playful and fun, often using exclamations or questions"
      : age <= 12
      ? "encouraging and informative; can include humor or wit"
      : age <= 17
      ? " reflective and sometimes critical; may address real-world issues"
      : "serious, persuasive, or analytical, depending on the subject matter"
  }.
    The ${type} should dynamically generate topics and subtopics relevant to "${courseName}", with each section and subsection tailored to provide a clear and engaging understanding of the subject. 
    Structure the ${type} in JSON format with an "introduction," a "body" containing "sections" and dynamically generated "subtopics" based on the topic's depth, and a "conclusion" to summarize key points. 
    Each section should have a minimum of 1500 characters, and the entire ${type} must reach at least 7500 characters. Adjust content in each section as needed to meet this requirement, ensuring the content remains informative and accessible.
    
    JSON Structure Example:
    {
      "courseName": "${courseName}",
      "language": "${language}",
      "difficulty": "${difficulty}",
      "age": ${age},
      "type": ${type},
      "essayContent": {
        "introduction": {
          "content": "A brief, age-appropriate introduction to the topic."
        },
        "body": {
          "sections": [
            {
              "title": "Dynamic Section Title",
              "content": "Content for the section, meeting character and age-appropriateness requirements.",
              "subtopics": [
                {
                  "title": "Dynamic Subtopic Title",
                  "content": "Detailed content for the subtopic, focusing on specific aspects with examples for easier understanding."
                }
              ]
            }
          ]
        },
        "conclusion": {
          "content": "A concise summary of the main points covered in the essay."
        }
      }
    }
  `;
}
