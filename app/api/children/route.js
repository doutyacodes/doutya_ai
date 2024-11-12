import { db } from "@/utils";
import { CHILDREN } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { authenticate } from "@/lib/jwtMiddleware";

export async function GET(req) {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
        return authResult.response; // Return the response if authentication fails
    }
    
    const userId = authResult.decoded_Data.id;
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
    try {
        const children = await db
            .select()
            .from(CHILDREN)
            .where(eq(CHILDREN.user_id, userId))
            .execute();

            const childrenWithAge = children.map(child => {
                const age = calculateAge(child.age); // Call the function here to calculate the age
                return { ...child, age }; // Add the calculated age to each child object
            });

        return NextResponse.json({ data: childrenWithAge });
    } catch (error) {
        console.error("Fetch Children Error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
