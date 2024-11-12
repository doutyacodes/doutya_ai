import { NextResponse } from "next/server";
import { db } from "@/utils";
import { ACTIVITIES, USER_ACTIVITIES, CHILDREN, COURSES } from "@/utils/schema";
import { authenticate } from "@/lib/jwtMiddleware";
import { and, desc, eq, inArray } from "drizzle-orm";

export async function POST(req) {
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userId = authResult.decoded_Data.id;
  const { age, childId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: "user_id is required." },
      { status: 400 }
    );
  }
  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age if the birth date hasn't occurred yet this year
    if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}
  // Determine child ID and age if not provided
  let finalChildId = childId;
  let finalAge = age;
  if (!childId) {
    const firstChild = await db
      .select()
      .from(CHILDREN)
      .where(eq(CHILDREN.user_id, userId))
      .limit(1)
      .execute();

    if (firstChild.length > 0) {
      finalChildId = firstChild[0].id;
      finalAge = firstChild[0].age;
    } else {
      return NextResponse.json(
        { error: "No children found for the user." },
        { status: 404 }
      );
    }
    finalAge = calculateAge(finalAge)
  }

  try {
    // Fetch the latest 15 courses for the specified child
    const latestCourses = await db
      .select()
      .from(COURSES)
      .where(eq(COURSES.child_id, finalChildId))
      .orderBy(desc(COURSES.created_at))
      .limit(15)
      .execute();

    const courseIds = latestCourses.map(course => course.id);

    // Fetch the latest weekly activity based on age
    const latestWeeklyActivity = await db
      .select()
      .from(ACTIVITIES)
      .where(and(eq(ACTIVITIES.age, finalAge), eq(ACTIVITIES.activity_type, "week")))
      .orderBy(desc(ACTIVITIES.created_at))
      .limit(1)
      .execute();
      console.log("latestWeeklyActivity",latestWeeklyActivity)

    // Check if the weekly activity is completed by the user
    let weeklyActivityStatus = null;
    if (latestWeeklyActivity.length > 0) {
      const weeklyActivityId = latestWeeklyActivity[0].id;
      const completionCheck = await db
        .select()
        .from(USER_ACTIVITIES)
        .where(
          and(
            eq(USER_ACTIVITIES.user_id, userId),
            eq(USER_ACTIVITIES.child_id, finalChildId),
            eq(USER_ACTIVITIES.activity_id, weeklyActivityId)
          )
        )
        .execute();
      weeklyActivityStatus = completionCheck.length > 0;
    }

    // Fetch normal activities that match the course IDs
    const normalActivities = await db
      .select()
      .from(ACTIVITIES)
      .where(
        and(
          eq(ACTIVITIES.activity_type, "normal"),
          inArray(ACTIVITIES.course_id, courseIds)
        )
      )
      .orderBy(desc(ACTIVITIES.created_at))
      .limit(15)
      .execute();

    // Check completion status for each normal activity
    const normalActivitiesStatus = await Promise.all(
      normalActivities.map(async (activity) => {
        const completionCheck = await db
          .select()
          .from(USER_ACTIVITIES)
          .where(
            and(
              eq(USER_ACTIVITIES.user_id, userId),
              eq(USER_ACTIVITIES.child_id, finalChildId),
              eq(USER_ACTIVITIES.activity_id, activity.id)
            )
          )
          .execute();
        return { ...activity, completed: completionCheck.length > 0 };
      })
    );

    return NextResponse.json({
      weeklyActivity: latestWeeklyActivity[0] ? { ...latestWeeklyActivity[0], completed: weeklyActivityStatus } : null,
      normalActivities: normalActivitiesStatus,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities." },
      { status: 500 }
    );
  }
}
