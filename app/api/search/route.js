import { NextResponse } from "next/server";
import axios from "axios";
import { COURSES, MODULES, SUBTOPICS } from "@/utils/schema";
import { db } from "@/utils";
import { generateUniqueSlug } from "@/lib/utils";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { courseName, language, difficulty, age, type } = await request.json();

    // Basic validation
    if (![courseName, language, difficulty, age].every((field) => field?.toString().trim())) {
      return NextResponse.json({ message: "All fields are required and must not be empty." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ message: "API Key is missing in environment variables." }, { status: 500 });
    }

    const prompt = generatePrompt(courseName, language, difficulty, age, type);

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
      return NextResponse.json({ message: "Error with OpenAI API request", error: apiError.message }, { status: 500 });
    }

    const responseContent = chatGptResponse.data.choices?.[0]?.message?.content.trim();
    if (!responseContent) {
      return NextResponse.json({ message: "No response content from OpenAI API." }, { status: 500 });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseContent.replace(/```json|```/g, "").trim());
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError);
      return NextResponse.json({ message: "Error parsing API response as JSON", error: jsonError.message }, { status: 500 });
    }

    let courseId;
    try {
      const courseInsert = await db.insert(COURSES).values({
        name: courseName,
        language,
        difficulty,
        age,
        type,
        chapter_content: JSON.stringify(parsedData),
      });
      courseId = courseInsert[0].insertId;
      if (!courseId) throw new Error("Course insertion did not return an insertId");
    } catch (dbError) {
      console.error("Database Insertion Error:", dbError);
      return NextResponse.json({ message: "Error inserting course into database", error: dbError.message }, { status: 500 });
    }

    // Insert Modules and Subtopics if type is "course"
    // if (type === "course" && parsedData.courseContent?.body?.modules) {
    //   for (const module of parsedData.courseContent.body.modules) {
    //     let moduleId;
    //     try {
    //       const moduleInsert = await db.insert(MODULES).values({
    //         course_id: courseId,
    //         module_number: module.module_number,
    //         title: module.title,
    //         content: JSON.stringify(module.content || ''),
    //       });
    //       moduleId = moduleInsert[0].insertId;
    //       module.module_id = moduleId; // Add module_id to parsedData
    //     } catch (dbError) {
    //       console.error("Module Insertion Error:", dbError);
    //       return NextResponse.json({ message: "Error inserting module into database", error: dbError.message }, { status: 500 });
    //     }

    //     if (module.subtopics && module.subtopics.length > 0) {
    //       for (const subtopic of module.subtopics) {
    //         try {
    //           const slug_value=generateUniqueSlug()
    //           const subtopicInsert = await db.insert(SUBTOPICS).values({
    //             module_id: moduleId,
    //             title: subtopic.title,
    //             slug:slug_value,
    //             content: JSON.stringify(subtopic.content || ''),
    //           });
    //           const subtopicId = subtopicInsert[0].insertId;
    //           subtopic.subtopic_id = subtopicId; // Add subtopic_id to parsedData
    //           subtopic.subtopic_slug = slug_value; // Add subtopic_id to parsedData
    //         } catch (dbError) {
    //           console.error("Subtopic Insertion Error:", dbError);
    //           return NextResponse.json({ message: "Error inserting subtopic into database", error: dbError.message }, { status: 500 });
    //         }
    //       }
    //     }
    //   }
    // }

    return NextResponse.json({ message: "Course created successfully!", content: parsedData }, { status: 201 });
  } catch (error) {
    console.error("Error in /api/search:", error);
    return NextResponse.json({ message: "Error processing your request", error: error.message }, { status: 500 });
  }
}

function generatePrompt(courseName, language, difficulty, age, type) {
  if (["story", "Bedtime story", "poem", "informative story"].includes(type)) {
    return `
      Create a JSON object for a ${
        type === "poem" ? "poem" : type
      } on the theme of "${courseName}" in "${language}" and at a "${difficulty}" level for readers around ${age} years old.
      The ${type} should be engaging and age-appropriate, using tone and language suitable for the age group.
      
      Structure:
      - If it’s a "story" or "bedtime story" or "informative story":
        {"courseName": "${courseName}",
      "language": "${language}",
      "difficulty": "${difficulty}",
      "age": ${age},
      "type": ${type},
          "title": "Story Title",
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
      Create a JSON object for an explanation on the theme of "${courseName}" in "${language}" and at a "${difficulty}" level for readers around ${age} years old.
      The ${type} should be engaging and age-appropriate, using tone and language suitable for the age group.
      
      Structure:
        {"courseName": "${courseName}",
      "language": "${language}",
      "difficulty": "${difficulty}",
      "age": ${age},
      "type": ${type},
          "title": "Story Title",
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

      
    `;
  }

  if (type == "presentation") {
    return `
      Generate a detailed and comprehensive JSON object for a presentation on the topic of "${courseName}", written in "${language}" and tailored to a "${difficulty}" level for a reader around ${age} years old.
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
     Generate a detailed and comprehensive JSON object for a course on the topic of "${courseName}," written in "${language}" and tailored to a "${difficulty}" level for a reader around ${age} years old.
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
    } on the topic of "${courseName}," written in "${language}" and tailored to a "${difficulty}" level for a reader around ${age} years old, making the tone age-appropriate and ${
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
