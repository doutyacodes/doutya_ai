// /api/user/folders/route.js - Updated with counts
import { NextResponse } from 'next/server';
import { USER_FOLDERS, SAVED_NEWS, SAVED_DEBATES } from '@/utils/schema';
import { eq, and, like, desc, count } from 'drizzle-orm';
import { authenticate } from '@/lib/jwtMiddleware';
import { db } from '@/utils';

// GET - Fetch user folders with counts (with optional search)
export async function GET(req) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    
    let query = db
      .select({
        id: USER_FOLDERS.id,
        name: USER_FOLDERS.name,
        created_at: USER_FOLDERS.created_at,
        updated_at: USER_FOLDERS.updated_at,
      })
      .from(USER_FOLDERS)
      .where(eq(USER_FOLDERS.user_id, userId));
    
    // Add search filter if provided
    if (search && search.trim()) {
      query = query.where(
        and(
          eq(USER_FOLDERS.user_id, userId),
          like(USER_FOLDERS.name, `%${search.trim()}%`)
        )
      );
    }
    
    const folders = await query.orderBy(desc(USER_FOLDERS.created_at));
    
    // Get counts for each folder
    const foldersWithCounts = await Promise.all(
      folders.map(async (folder) => {
        // Get news count
        const newsCount = await db
          .select({ count: count(SAVED_NEWS.id) })
          .from(SAVED_NEWS)
          .where(eq(SAVED_NEWS.user_folder_id, folder.id))
          .limit(1);

        // Get debates count
        const debatesCount = await db
          .select({ count: count(SAVED_DEBATES.id) })
          .from(SAVED_DEBATES)
          .where(eq(SAVED_DEBATES.user_folder_id, folder.id))
          .limit(1);

        return {
          ...folder,
          counts: {
            news: newsCount[0]?.count || 0,
            debates: debatesCount[0]?.count || 0,
            total: (newsCount[0]?.count || 0) + (debatesCount[0]?.count || 0)
          }
        };
      })
    );
    
    return NextResponse.json(
      { folders: foldersWithCounts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { message: "Error fetching folders", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new folder
export async function POST(req) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  
  try {
    const { name } = await req.json();
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { message: "Folder name is required" },
        { status: 400 }
      );
    }
    
    // Check if folder with same name already exists for this user
    const existingFolder = await db
      .select()
      .from(USER_FOLDERS)
      .where(eq(USER_FOLDERS.user_id, userId))
      .where(eq(USER_FOLDERS.name, name.trim()))
      .limit(1);
    
    if (existingFolder.length > 0) {
      return NextResponse.json(
        { message: "Folder with this name already exists" },
        { status: 400 }
      );
    }
    
    // Insert folder
    const insertResult = await db
      .insert(USER_FOLDERS)
      .values({
        user_id: userId,
        name: name.trim(),
      })
      .execute();

    // Get last inserted folder with counts
    const [newFolder] = await db
      .select()
      .from(USER_FOLDERS)
      .where(eq(USER_FOLDERS.id, insertResult[0].insertId));

    // Add counts (will be 0 for new folder)
    const folderWithCounts = {
      ...newFolder,
      counts: {
        news: 0,
        debates: 0,
        total: 0
      }
    };

    return NextResponse.json(
      { folder: folderWithCounts, message: "Folder created successfully" },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { message: "Error creating folder", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a folder
export async function DELETE(req) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  
  try {
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get('folderId');
    
    if (!folderId) {
      return NextResponse.json(
        { message: "Folder ID is required" },
        { status: 400 }
      );
    }
    
    // Check if folder belongs to user
    const folder = await db
      .select()
      .from(USER_FOLDERS)
      .where(eq(USER_FOLDERS.id, parseInt(folderId)))
      .where(eq(USER_FOLDERS.user_id, userId))
      .limit(1);
    
    if (folder.length === 0) {
      return NextResponse.json(
        { message: "Folder not found or unauthorized" },
        { status: 404 }
      );
    }
    
    // Delete folder (this will cascade delete saved news and debates due to foreign key)
    await db
      .delete(USER_FOLDERS)
      .where(eq(USER_FOLDERS.id, parseInt(folderId)));
    
    return NextResponse.json(
      { message: "Folder deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json(
      { message: "Error deleting folder", details: error.message },
      { status: 500 }
    );
  }
}