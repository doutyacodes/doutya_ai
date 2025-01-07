import { db } from '@/utils';
import { SESSIONS, VISITORS } from '@/utils/analyticsSchema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

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

        // Create a new session for the visitor
        const newSession = await db.insert(SESSIONS).values({
            visitor_id: visitor[0].id,
        }).execute();

        return NextResponse.json({ sessionId: newSession[0].insertId });
    } catch (error) {
        console.error('Error starting session:', error);
        return NextResponse.json({ message: 'Failed to start session' }, { status: 500 });
    }
}
