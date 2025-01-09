// import { db } from '@/utils';
// import { PERSPECTIVE_VIEWS } from '@/utils/analyticsSchema';
// import { and, eq } from 'drizzle-orm';
// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   try {
//     const { articleId, sessionId, viewpoint, engagementTime } = await req.json();

//     // Check if a perspective view exists with the same sessionId and viewpoint
//     const existingView = await db
//       .select()
//       .from(PERSPECTIVE_VIEWS)
//       .where(
//         and(
//           eq(PERSPECTIVE_VIEWS.session_id, sessionId),
//           eq(PERSPECTIVE_VIEWS.article_id, articleId),
//           eq(PERSPECTIVE_VIEWS.viewpoint, viewpoint)
//         )
//       )
//       .limit(1)
//       .execute();

//     if (existingView.length > 0) {
//       // If a record exists, update it
//       await db
//         .update(PERSPECTIVE_VIEWS)
//         .set({
//             engagement_time: engagementTime,
//             updated_at: new Date(),
//             views: existingView[0].views + 1, // Increment views by 1
//         })
//         .where(
//           and(
//             eq(PERSPECTIVE_VIEWS.session_id, sessionId),
//             eq(PERSPECTIVE_VIEWS.article_id, articleId),
//             eq(PERSPECTIVE_VIEWS.viewpoint, viewpoint)
//           )
//         )
//         .execute();

//       return NextResponse.json({ message: 'Perspective view updated successfully' });
//     } else {
//       // If no record exists, insert a new one
//       await db
//         .insert(PERSPECTIVE_VIEWS)
//         .values({
//           article_id: articleId,
//           session_id: sessionId,
//           viewpoint: viewpoint,
//           engagement_time: engagementTime,
//           views: 1, // Start views count at 1 for new entry
//           created_at: new Date(),
//         })
//         .execute();

//       return NextResponse.json({ message: 'Perspective view created successfully' });
//     }
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: 'Failed to update perspective view', error: error.message },
//       { status: 500 }
//     );
//   }
// }


import { db } from '@/utils';
import { PERSPECTIVE_VIEWS } from '@/utils/analyticsSchema';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { articleId, sessionId, viewpoint, engagementTime } = await req.json();

    // Check if a perspective view exists with the same sessionId and viewpoint
    const existingView = await db
    .select()
    .from(PERSPECTIVE_VIEWS)
    .where(
      and(
        eq(PERSPECTIVE_VIEWS.session_id, sessionId),
        eq(PERSPECTIVE_VIEWS.article_id, articleId),
        eq(PERSPECTIVE_VIEWS.viewpoint, viewpoint)
      )
    )
    .limit(1)
    .execute();

  if (existingView.length > 0) {
  // If a record exists, update it
  await db
    .update(PERSPECTIVE_VIEWS)
    .set({
      engagement_time: engagementTime,
      updated_at: new Date(),
      views: existingView[0].views + 1, // Increment views by 1
    })
    .where(
      and(
        eq(PERSPECTIVE_VIEWS.session_id, sessionId),
        eq(PERSPECTIVE_VIEWS.article_id, articleId),
        eq(PERSPECTIVE_VIEWS.viewpoint, viewpoint)
      )
    )
    .execute();

  return NextResponse.json({ message: 'Perspective view updated successfully' });
  } else {
  // If no record exists, insert a new one
  await db
    .insert(PERSPECTIVE_VIEWS)
    .values({
      article_id: articleId,
      session_id: sessionId,
      viewpoint: viewpoint,
      engagement_time: engagementTime,
      views: 1, // Start views count at 1 for new entry
      created_at: new Date(),
    })
    .execute();
    return NextResponse.json({ message: 'Perspective view created successfully' });
  }

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to update perspective view', error: error.message },
      { status: 500 }
    );
  }
}
