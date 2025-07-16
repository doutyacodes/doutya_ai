import { hash } from "bcryptjs";
import { USER_DETAILS } from "@/utils/schema";
import { db } from "@/utils";
import { NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { name, username, password, mobile, examTypeId } = await req.json();

    const existingUser = await db
      .select()
      .from(USER_DETAILS)
      .where(
        or(
          eq(USER_DETAILS.username, username),
          eq(USER_DETAILS.mobile, mobile)
        )
      )
      .limit(1)
      .execute();

    if (existingUser.length > 0) {
      const user = existingUser[0];

      if (user.username === username && user.mobile === mobile) {
        return NextResponse.json(
          { message: "Both username and mobile number are already in use." },
          { status: 400 }
        );
      } else if (user.username === username) {
        return NextResponse.json(
          { message: "Username is already in use." },
          { status: 400 }
        );
      } else if (user.mobile === mobile) {
        return NextResponse.json(
          { message: "Mobile number is already in use." },
          { status: 400 }
        );
      }
    }
    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user
  const newUser = await db
    .insert(USER_DETAILS)
    .values({
      name,
      username,
      password: hashedPassword,
      mobile,
      exam_type_id: examTypeId,
      is_active: true,
    })
    .execute();

    // Fetch the newly created user
    const createdUser = await db
      .select({
        id: USER_DETAILS.id,
        username: USER_DETAILS.username,
      })
      .from(USER_DETAILS)
      .where(eq(USER_DETAILS.username, username))
      .limit(1)
      .execute();

    // Generate JWT token
    const token = jwt.sign(
      { id: createdUser[0].id,
        username: createdUser[0].username,
      },
      JWT_SECRET
    );

    const response = NextResponse.json(
      {
        token,
        message: "Account created successfully",
      },
      { status: 201 }
    );

    response.cookies.set("user_auth_token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}