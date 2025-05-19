// import { db } from '@/utils';
// import { SESSIONS, VISITORS } from '@/utils/analyticsSchema';
// import { eq } from 'drizzle-orm';
// import { NextResponse } from 'next/server';

// export async function POST(req) {
//     try {
//         const { uuid } = await req.json(); // UUID from client
        
//         if (!uuid) {
//             return NextResponse.json({ message: 'UUID is required' }, { status: 400 });
//         }

//         // Check if the visitor exists
//         const visitor = await db
//             .select()
//             .from(VISITORS)
//             .where(eq(VISITORS.uuid, uuid))
//             .execute();

//         if (visitor.length === 0) {
//             return NextResponse.json({ message: 'Visitor not found' }, { status: 404 });
//         }

//         // Create a new session for the visitor
//         const newSession = await db.insert(SESSIONS).values({
//             visitor_id: visitor[0].id,
//         }).execute();

//         return NextResponse.json({ sessionId: newSession[0].insertId });
//     } catch (error) {
//         console.error('Error starting session:', error);
//         return NextResponse.json({ message: 'Failed to start session' }, { status: 500 });
//     }
// }


import { db } from '@/utils';
import { SESSIONS, VISITORS } from '@/utils/analyticsSchema';
import { eq, and, desc, isNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export async function POST(req) {
    try {
        const { uuid } = await req.json(); // UUID from client

        if (!uuid) {
            return NextResponse.json({ message: 'UUID is required' }, { status: 400 });
        }

        // Check if the visitor exists
        const visitor = await db
            .select()
            .from(VISITORS)
            .where(eq(VISITORS.uuid, uuid))
            .execute();

        if (visitor.length === 0) {
            return NextResponse.json({ message: 'Visitor not found' }, { status: 404 });
        }

        const visitorId = visitor[0].id;
        
        // Check for an active session for the visitor
        const now = new Date();

        const activeSession = await db
            .select()
            .from(SESSIONS)
            .where(
                and(
                    eq(SESSIONS.visitor_id, visitorId),
                    isNull(SESSIONS.session_end) // Ensure the session hasn't ended
                )
            )
            .orderBy(desc(SESSIONS.session_start)) // Get the most recent session
            .limit(1)
            .execute();

        if (activeSession.length > 0) {
            // Check if the session is still valid based on timeout
            const lastSessionStartTime = new Date(activeSession[0].session_start);
            if (now - lastSessionStartTime < SESSION_TIMEOUT_MS) {
                return NextResponse.json({ sessionId: activeSession[0].id });
            }
        }

        // Create a new session for the visitor
        const newSession = await db
            .insert(SESSIONS)
            .values({
                visitor_id: visitorId,
                session_start: now,
            })
            .execute();

        return NextResponse.json({ sessionId: newSession[0].insertId });
    } catch (error) {
        console.error('Error starting session:', error);
        return NextResponse.json({ message: 'Failed to start session' }, { status: 500 });
    }
}
