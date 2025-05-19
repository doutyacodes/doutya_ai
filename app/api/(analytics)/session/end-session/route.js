import { db } from "@/utils";
import { SESSIONS } from "@/utils/analyticsSchema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { sessionId } = await req.json();        
        if (!sessionId) {
            return NextResponse.json({ message: 'Session ID is required' }, { status: 400 });
        }

        const session = await db
            .select()
            .from(SESSIONS)
            .where(eq(SESSIONS.id, sessionId))
            .execute();

        if (!session.length || session[0].session_end) {
            return NextResponse.json({ message: 'Session already ended or not found' }, { status: 400 });
        }

        // Update the session end time
        await db
            .update(SESSIONS)
            .set({ session_end: new Date() })
            .where(eq(SESSIONS.id, sessionId))
            .execute();

        return NextResponse.json({ message: 'Session ended successfully' });
    } catch (error) {
        console.error('Error ending session:', error);
        return NextResponse.json({ message: 'Failed to end session' }, { status: 500 });
    }
}
