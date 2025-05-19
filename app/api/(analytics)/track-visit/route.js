import { db } from '@/utils';
import { VISITORS } from '@/utils/analyticsSchema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const body = await req.json();
    const { uuid } = body;

    if (!uuid) {
        return NextResponse.json({ message: 'UUID is required' }, { status: 400 });
    }

    try {
        // Check if the visitor exists
        const existingVisitor = await db
        .select()
        .from(VISITORS)
        .where(eq(VISITORS.uuid, uuid))
        .execute();

        if (existingVisitor.length > 0) {
            const visitor = existingVisitor[0];

            // Determine if the visitor is returning
            const isReturningVisitor = visitor.returning_visitor || visitor.last_visit < new Date();

            // Update the last_visit timestamp and set returning_visitor to true if applicable
            await db
                .update(VISITORS)
                .set({
                    last_visit: new Date(),
                    returning_visitor: isReturningVisitor,
                })
                .where(eq(VISITORS.uuid, uuid))
                .execute();
        } else {
            // Insert a new visitor record
            await db
                .insert(VISITORS)
                .values({
                    uuid: uuid,
                    first_visit: new Date(),
                    last_visit: new Date(),
                    returning_visitor: false,
                })
                .execute();
        }

        return NextResponse.json({ message: 'Visit Updated successfully' });
    } catch (error) {
        console.error('Error tracking visit:', error);
        return NextResponse.json({ message: 'Failed to update visit' }, { status: 500 });
    }
}
