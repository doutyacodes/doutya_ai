import { NextResponse } from "next/server";
import { db } from "@/utils"; // Adjust path as needed
import { EXAM_TYPES } from "@/utils/schema"; // Adjust path as needed

export async function GET() {
  try {
    const examTypes = await db
      .select({
        id: EXAM_TYPES.id,
        name: EXAM_TYPES.name,
        description: EXAM_TYPES.description,
      })
      .from(EXAM_TYPES)
      .execute();

    return NextResponse.json({ examTypes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching exam types:", error);
    return NextResponse.json(
      { message: "Failed to fetch exam types" },
      { status: 500 }
    );
  }
}