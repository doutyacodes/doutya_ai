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

    console.log("log 1")

    try {
        // Check if the visitor exists
        const existingVisitor = await db
            .select()
            .from(VISITORS)
            .where(eq(VISITORS.uuid, uuid))
            .execute();

        console.log("lexistingVisitor", existingVisitor)


        if (existingVisitor.length > 0) {
            console.log("lexistingVisitor Length")

            // Update the last_visit timestamp for the existing visitor
            await db
                .update(VISITORS)
                .set({ last_visit: new Date() })
                .where(eq(VISITORS.uuid, uuid))
                .execute();
        } else {
            console.log("elkse")

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
