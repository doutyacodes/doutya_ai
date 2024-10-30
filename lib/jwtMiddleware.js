import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const authenticate = async (request) => {
    const token = request.headers.get("authorization")?.split(" ")[1]; // Assuming "Bearer <token>"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    return {
      authenticated: true,
      decoded_Data: decoded,
    };
  } catch (error) {
    return {
      authenticated: false,
      response: NextResponse.json({ message: "Invalid token" }, { status: 401 }),
    };
  }
};
