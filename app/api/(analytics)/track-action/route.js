import { db } from '@/utils';
import { ARTICLE_INTERACTIONS } from '@/utils/analyticsSchema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const body = await req.json();
    const { article_id, visitor_uuid, action_type } = body;

    if (!article_id || !visitor_uuid || !action_type) {
        return NextResponse.json({ message: 'Article ID, Visitor UUID, and Action Type are required' }, { status: 400 });
    }

    try {
        // Validate the action type
        const validActions = [
            'copy_link',
            'share_facebook',
            'share_twitter',
            'share_whatsapp',
            'share_telegram',
        ];

        if (!validActions.includes(action_type)) {
            return NextResponse.json({ message: 'Invalid action type' }, { status: 400 });
        }

        // Insert the interaction record
        await db
            .insert(ARTICLE_INTERACTIONS)
            .values({
                article_id,
                visitor_uuid,
                action_type,
                created_at: new Date(),
            })
            .execute();

        return NextResponse.json({ message: 'Action tracked successfully' });
    } catch (error) {
        console.error('Error tracking action:', error);
        return NextResponse.json({ message: 'Failed to track action' }, { status: 500 });
    }
}
