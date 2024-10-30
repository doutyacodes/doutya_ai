import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const authenticate = async (request) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return {
      authenticated: false,
      response: NextResponse.json({ message: "No token provided" }, { status: 401 }),
    };
  }

  const token = authHeader.split(" ")[1]; // Get the token from the "Bearer" format
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    if (!decoded) {
        return { authenticated: false, response: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) };
      }
      return { authenticated: true, decoded_Data: decoded };
  } catch (error) {
    return {
      authenticated: false,
      response: NextResponse.json({ message: "Invalid token" }, { status: 401 }),
    };
  }
};
