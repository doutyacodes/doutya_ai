import { z } from "zod";
import { hash } from "bcryptjs";
import { USER_DETAILS } from "@/utils/schema";
import { db } from "@/utils";
import { NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import jwt from "jsonwebtoken"; // Import jwt

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with your actual secret key

export async function POST(req) {
  try {
    const { name, username, birth_date, password, gender, mobile } = await req.json();

    // Check if username or mobile already exists in the database
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
      return NextResponse.json(
        { message: "Username or mobile already in use." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user record in the database
    const newUser = await db.insert(USER_DETAILS).values({
      name,
      username,
      password: hashedPassword,
      mobile,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.insertId, username: newUser.username }, // Include relevant user info in token
      process.env.JWT_SECRET,
      //{ expiresIn: '1h' } // Token expiration time
    );

    return NextResponse.json(
      { message: "User created successfully", user: newUser, token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
