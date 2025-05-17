import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/jwtMiddleware';
import { NARRATIVES, NARRATIVE_BIASES, ADMIN_DETAILS } from '@/utils/schema';
import { db } from '@/utils';
import { eq, and } from 'drizzle-orm';

export async function GET(request, { params }) {
  try {
    // Get the narrative ID from params
    const narrativeId = params.id;
    
    if (!narrativeId) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Narrative ID is required',
        },
        { status: 400 }
      );
    }

    // Authenticate the request
    const authResult = await authenticate(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const userData = authResult.decoded_Data;
    const userId = userData.id;

    // Fetch the narrative by ID and ensure it belongs to the authenticated admin
    const narrative = await db
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
      .where(
        and(
          eq(NARRATIVES.id, parseInt(narrativeId)),
          eq(NARRATIVES.createdBy, userId)
        )
      )
      .limit(1);

    if (!narrative || narrative.length === 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Narrative not found or you do not have access to it',
        },
        { status: 404 }
      );
    }

    // Fetch related biases
    const biases = await db
      .select({
        id: NARRATIVE_BIASES.id,
        biasType: NARRATIVE_BIASES.biasType,
        entity: NARRATIVE_BIASES.entity,
        percentage: NARRATIVE_BIASES.percentage,
      })
      .from(NARRATIVE_BIASES)
      .where(eq(NARRATIVE_BIASES.narrativeId, parseInt(narrativeId)));

    // Fetch admin info (creator)
    const admin = await db
      .select({
        id: ADMIN_DETAILS.id,
        name: ADMIN_DETAILS.name,
        username: ADMIN_DETAILS.username,
        role: ADMIN_DETAILS.role,
      })
      .from(ADMIN_DETAILS)
      .where(eq(ADMIN_DETAILS.id, narrative[0].createdBy))
      .limit(1);

    const narrativeWithDetails = {
      ...narrative[0],
      biases,
      creator: admin[0] || null,
    };

    return NextResponse.json({
      status: 'success',
      message: 'Narrative retrieved successfully',
      data: narrativeWithDetails,
    });
  } catch (error) {
    console.error('Error fetching narrative details:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch narrative details',
        error: error.message,
      },
      { status: 500 }
    );
  }
}