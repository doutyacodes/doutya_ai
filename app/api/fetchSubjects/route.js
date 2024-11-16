import { NextResponse } from "next/server";
import { db } from "@/utils";
import { CHILDREN, LEARN_SUBJECTS } from "@/utils/schema";
import { authenticate } from "@/lib/jwtMiddleware";
import { and, eq } from "drizzle-orm";
import { calculateAgeAndWeeks } from "@/app/hooks/CalculateAgeWeek";

export async function POST(req) {
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userId = authResult.decoded_Data.id;
  const { age, grade = null } = await req.json(); // Accept `limit` from the request, default to 10

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }

  let finalAge = age;
  let finalGrade = grade;

  if (!finalAge || !finalGrade) {
    // If `age` is null, fetch the first child's age
    const firstChild = await db
      .select()
      .from(CHILDREN)
      .where(eq(CHILDREN.user_id, userId))
      .limit(1)
      .execute();

    if (firstChild.length > 0) {
      const calculatedAge = calculateAgeAndWeeks(firstChild[0].age);
      finalAge = calculatedAge.age;
      finalGrade = firstChild[0].grade;
    } else {
      return NextResponse.json(
        { error: "No children found for the user." },
        { status: 404 }
      );
    }
  }

  const getTodayDateInIST = () => {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (UTC+5:30)
    const istNow = new Date(now.getTime() + offset);

    // Format as YYYY-MM-DD
    const year = istNow.getUTCFullYear();
    const month = String(istNow.getUTCMonth() + 1).padStart(2, "0");
    const day = String(istNow.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDateInIST();
  // console.log("date and age",`${finalAge}"+"${todayDate}`)
  try {
    let learnSubjects;
    if (finalGrade) {
      learnSubjects = await db
        .select()
        .from(LEARN_SUBJECTS)
        .where(
          and(
            eq(LEARN_SUBJECTS.show_date, todayDate),
            eq(LEARN_SUBJECTS.grade, finalGrade)
          )
        )
        .limit()
        .execute();
    } else {
      learnSubjects = await db
        .select()
        .from(LEARN_SUBJECTS)
        .where(
          and(
            eq(LEARN_SUBJECTS.show_date, todayDate),
            eq(LEARN_SUBJECTS.age, finalAge)
          )
        )
        .limit()
        .execute();
    }

    return NextResponse.json({
      learnSubjects,
    });
  } catch (error) {
    console.error("Error fetching learn_subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch learn_subjects." },
      { status: 500 }
    );
  }
}
