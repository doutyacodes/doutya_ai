import { db } from '@/utils';
import { PAGE_VIEWS, SESSIONS } from '@/utils/analyticsSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Get the data sent from the frontend (sessionId, pageUrl, timeOnPage)
        const { sessionId, pageUrl, timeOnPage } = await req.json();

        // Retrieve the session_id from the sessions table
        const session = await db
        .select()
        .from(SESSIONS)
        .where(SESSIONS.id, '=', sessionId)
        .limit(1)
        .execute();

        if (!session.length) {
        // If no session exists for the given sessionId, respond with an error
        return NextResponse.json({ message: 'Session not found' }, { status: 404 });
        }

        // Insert the page view data into the PAGE_VIEWS table
        const pageView = await db
        .insert(PAGE_VIEWS)
        .values({
            session_id: session[0].id,
            page_url: pageUrl,
            time_on_page: timeOnPage,
        })
        .execute(); // No need for `.returning()`

        // Log the page view data for debugging (optional)
        console.log('Page View Data:', pageView);

        // Respond with success
        return NextResponse.json({ message: 'Page view tracked successfully' });
    } catch (error) {
        // Log the error and send a failure response
        console.error(error);
        return NextResponse.json(
        { message: 'Failed to track page view', error: error.message },
        { status: 500 }
        );
    }
    }