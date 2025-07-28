// /api/user/folders/[folderId]/debates/route.js
import { NextResponse } from 'next/server';
import { USER_FOLDERS, SAVED_DEBATES, USER_CUSTOM_DEBATES } from '@/utils/schema';
import { eq, and, desc } from 'drizzle-orm';
import { authenticate } from '@/lib/jwtMiddleware';
import { db } from '@/utils';

// GET - Fetch folder details and all saved debates in the folder
export async function GET(req, { params }) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const folderId = parseInt(await params.folderId);
  
  try {
    // First check if folder exists and belongs to user
    const folder = await db
      .select()
      .from(USER_FOLDERS)
      .where(
        and(
          eq(USER_FOLDERS.id, folderId),
          eq(USER_FOLDERS.user_id, userId)
        )
      )
      .limit(1);
    
    if (folder.length === 0) {
      return NextResponse.json(
        { message: "Folder not found" },
        { status: 404 }
      );
    }
    
    // Fetch all saved debates in this folder
    const savedDebates = await db
      .select({
        id: SAVED_DEBATES.id,
        saved_at: SAVED_DEBATES.saved_at,
        note: SAVED_DEBATES.note,
        debate: {
          id: USER_CUSTOM_DEBATES.id,
          title: USER_CUSTOM_DEBATES.title,
          user_position_title: USER_CUSTOM_DEBATES.user_position_title,
          ai_position_title: USER_CUSTOM_DEBATES.ai_position_title,
          status: USER_CUSTOM_DEBATES.status,
          conversation_count: USER_CUSTOM_DEBATES.conversation_count,
          max_conversations: USER_CUSTOM_DEBATES.max_conversations,
          created_at: USER_CUSTOM_DEBATES.created_at,
          updated_at: USER_CUSTOM_DEBATES.updated_at,
          completed_at: USER_CUSTOM_DEBATES.completed_at,
        }
      })
      .from(SAVED_DEBATES)
      .innerJoin(USER_CUSTOM_DEBATES, eq(SAVED_DEBATES.debate_id, USER_CUSTOM_DEBATES.id))
      .where(eq(SAVED_DEBATES.user_folder_id, folderId))
      .orderBy(desc(SAVED_DEBATES.saved_at));

    // Add progress calculation for each debate
    const debatesWithProgress = savedDebates.map(savedItem => ({
      ...savedItem,
      debate: {
        ...savedItem.debate,
        progress_percentage: Math.round((savedItem.debate.conversation_count / savedItem.debate.max_conversations) * 100),
        is_completed: savedItem.debate.status === 'completed',
        can_continue: savedItem.debate.status === 'active' && savedItem.debate.conversation_count < savedItem.debate.max_conversations
      }
    }));

    return NextResponse.json(
      { 
        folder: folder[0],
        savedDebates: debatesWithProgress 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching folder debates:", error);
    return NextResponse.json(
      { message: "Error fetching folder debates", details: error.message },
      { status: 500 }
    );
  }
}