// /api/user/plan/route.js
import { NextResponse } from "next/server";
import { db } from "@/utils";
import { USER_DETAILS, EXAM_TYPES } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { authenticate } from "@/lib/jwtMiddleware";

// Helper function to get plan details
function getPlanDetails(plan) {
  const planConfigs = {
    starter: {
      display_name: "Starter",
      icon: "Shield",
      color: "border-blue-300 bg-blue-50 text-blue-700",
      hover_color: "hover:border-blue-400 hover:bg-blue-100",
      features: [
        "Basic news access",
        "Limited saved articles",
        "Standard support"
      ],
      limits: {
        saved_articles: 50,
        folders: 3
      }
    },
    pro: {
      display_name: "Pro",
      icon: "Star",
      color: "border-orange-300 bg-orange-50 text-orange-700",
      hover_color: "hover:border-orange-400 hover:bg-orange-100",
      features: [
        "Full news access",
        "Unlimited saved articles",
        "Priority support",
        "Advanced filtering"
      ],
      limits: {
        saved_articles: "unlimited",
        folders: 10
      }
    },
    elite: {
      display_name: "Elite",
      icon: "Crown",
      color: "border-purple-300 bg-purple-50 text-purple-700",
      hover_color: "hover:border-purple-400 hover:bg-purple-100",
      features: [
        "Premium news access",
        "Unlimited everything",
        "24/7 premium support",
        "Advanced analytics",
        "Early access to features"
      ],
      limits: {
        saved_articles: "unlimited",
        folders: "unlimited"
      }
    }
  };

  return planConfigs[plan] || planConfigs.starter;
}

export async function GET(req) {
  try {
    // Authenticate user
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response;
    }
    const userData = authResult.decoded_Data;
    const userId = userData.id;

    // Get user's plan and exam type information
    const user = await db
      .select({
        id: USER_DETAILS.id,
        name: USER_DETAILS.name,
        plan: USER_DETAILS.plan,
        exam_type_id: USER_DETAILS.exam_type_id,
        exam_type_name: EXAM_TYPES.name,
        exam_type_description: EXAM_TYPES.description,
        is_active: USER_DETAILS.is_active,
        created_at: USER_DETAILS.created_at,
      })
      .from(USER_DETAILS)
      .leftJoin(EXAM_TYPES, eq(USER_DETAILS.exam_type_id, EXAM_TYPES.id))
      .where(eq(USER_DETAILS.id, userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userInfo = user[0];

    // Check if user account is active
    if (!userInfo.is_active) {
      return NextResponse.json(
        { message: "User account is not active" },
        { status: 403 }
      );
    }

    // Prepare plan information with benefits/features
    const planInfo = {
      current_plan: userInfo.plan,
      plan_details: getPlanDetails(userInfo.plan),
      exam_type: userInfo.exam_type_name
        ? {
            id: userInfo.exam_type_id,
            name: userInfo.exam_type_name,
            description: userInfo.exam_type_description,
          }
        : null,
      user: {
        id: userInfo.id,
        name: userInfo.name,
        member_since: userInfo.created_at,
      },
    };

    return NextResponse.json(planInfo, { status: 200 });
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return NextResponse.json(
      { message: "Error fetching user plan", details: error.message },
      { status: 500 }
    );
  }
}