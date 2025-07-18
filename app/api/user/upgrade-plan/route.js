import { USER_DETAILS } from "@/utils/schema"; 
import { db } from "@/utils"; 
import { NextResponse } from "next/server"; 
import { eq } from "drizzle-orm"; 
import jwt from "jsonwebtoken";  

const JWT_SECRET = process.env.JWT_SECRET;  

export async function POST(req) {   
  try {     
    const { plan } = await req.json();
    
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify and decode JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token. Please login again." },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    // Validate plan
    const validPlans = ["starter", "pro", "elite"];
    if (!plan || !validPlans.includes(plan)) {
      return NextResponse.json(
        { message: "Invalid plan selected. Please choose from starter, pro, or elite." },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db       
      .select()       
      .from(USER_DETAILS)       
      .where(eq(USER_DETAILS.id, userId))
      .limit(1)       
      .execute();      

    if (existingUser.length === 0) {       
      return NextResponse.json(           
        { message: "User not found." },           
        { status: 404 }         
      );       
    }

    const user = existingUser[0];

    // Check if the new plan is different from current plan
    if (user.plan === plan) {
      return NextResponse.json(
        { message: "You are already on this plan." },
        { status: 400 }
      );
    }

    // Update user's plan   
    await db     
      .update(USER_DETAILS)     
      .set({ 
        plan: plan,
        updated_at: new Date()
      })
      .where(eq(USER_DETAILS.id, userId))     
      .execute();      

    // Fetch updated user details     
    const updatedUser = await db       
      .select({         
        id: USER_DETAILS.id,         
        username: USER_DETAILS.username,
        name: USER_DETAILS.name,
        plan: USER_DETAILS.plan,
        exam_type_id: USER_DETAILS.exam_type_id,       
      })       
      .from(USER_DETAILS)       
      .where(eq(USER_DETAILS.id, userId))       
      .limit(1)       
      .execute();      

    // Generate new JWT token with updated plan info
    const newToken = jwt.sign(       
      { 
        id: updatedUser[0].id,         
        username: updatedUser[0].username,
        plan: updatedUser[0].plan,       
      },       
      JWT_SECRET     
    );      

    const response = NextResponse.json(       
      {         
        token: newToken,
        user: {
          id: updatedUser[0].id,
          username: updatedUser[0].username,
          name: updatedUser[0].name,
          plan: updatedUser[0].plan,
          exam_type_id: updatedUser[0].exam_type_id,
        },         
        message: `Plan successfully updated to ${plan}`,       
      },       
      { status: 200 }     
    );      

    // Update the auth cookie with new token
    response.cookies.set("user_auth_token", newToken, {       
      path: "/",       
      httpOnly: true,       
      secure: process.env.NODE_ENV === "production",       
      sameSite: "strict",     
    });      

    return response;    

  } catch (error) {     
    console.error("Upgrade Plan Error:", error);     
    return NextResponse.json({ message: "Server error" }, { status: 500 });   
  } 
}

// GET method to fetch current user plan
export async function GET(req) {   
  try {     
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify and decode JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token. Please login again." },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    // Fetch user details     
    const user = await db       
      .select({         
        id: USER_DETAILS.id,         
        username: USER_DETAILS.username,
        name: USER_DETAILS.name,
        plan: USER_DETAILS.plan,
        exam_type_id: USER_DETAILS.exam_type_id,       
      })       
      .from(USER_DETAILS)       
      .where(eq(USER_DETAILS.id, userId))       
      .limit(1)       
      .execute();      

    if (user.length === 0) {       
      return NextResponse.json(           
        { message: "User not found." },           
        { status: 404 }         
      );       
    }

    return NextResponse.json(       
      {         
        user: user[0],
        plan: user[0].plan,         
        message: "User plan fetched successfully",       
      },       
      { status: 200 }     
    );    

  } catch (error) {     
    console.error("Get User Plan Error:", error);     
    return NextResponse.json({ message: "Server error" }, { status: 500 });   
  } 
}