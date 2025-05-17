import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/jwtMiddleware';
import { NARRATIVES, NARRATIVE_BIASES, ADMIN_DETAILS } from '@/utils/schema';
import { db } from '@/utils';
import { desc, eq, and } from 'drizzle-orm';

export async function GET(request) {
  try {
    // Authenticate the request
    const authResult = await authenticate(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const userData = authResult.decoded_Data;
    const userId = userData.id;

    // Fetch all narratives created by the authenticated admin
    const narratives = await db
      .select({
        id: NARRATIVES.id,
        originalArticle: NARRATIVES.originalArticle,
        rewrittenArticle: NARRATIVES.rewrittenArticle,
        ageRange: NARRATIVES.ageRange,
        location: NARRATIVES.location,
        audienceType: NARRATIVES.audienceType,
        createdAt: NARRATIVES.createdAt,
        createdBy: NARRATIVES.createdBy,
      })
      .from(NARRATIVES)
      .where(eq(NARRATIVES.createdBy, userId))
      .orderBy(desc(NARRATIVES.createdAt));

    // For each narrative, fetch related biases
    const narrativesWithBiases = await Promise.all(
      narratives.map(async (narrative) => {
        const biases = await db
          .select({
            id: NARRATIVE_BIASES.id,
            biasType: NARRATIVE_BIASES.biasType,
            entity: NARRATIVE_BIASES.entity,
            percentage: NARRATIVE_BIASES.percentage,
          })
          .from(NARRATIVE_BIASES)
          .where(eq(NARRATIVE_BIASES.narrativeId, narrative.id));

        return {
          ...narrative,
          biases,
        };
      })
    );

    return NextResponse.json({
      status: 'success',
      message: 'Narratives retrieved successfully',
      data: narrativesWithBiases,
    });
  } catch (error) {
    console.error('Error fetching narratives:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch narratives',
        error: error.message,
      },
      { status: 500 }
    );
  }
}