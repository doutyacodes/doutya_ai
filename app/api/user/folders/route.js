// /api/user/folders/route.js
import { NextResponse } from 'next/server';
import { USER_FOLDERS } from '@/utils/schema';
import { eq, and, like, desc } from 'drizzle-orm';
import { authenticate } from '@/lib/jwtMiddleware';
import { db } from '@/utils';

// GET - Fetch user folders (with optional search)
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
      .select()
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
    
    return NextResponse.json(
      { folders },
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

    // Get last inserted folder (optional, based on insertResult.insertId)
    const [newFolder] = await db
      .select()
      .from(USER_FOLDERS)
      .where(eq(USER_FOLDERS.id, insertResult[0].insertId));

    return NextResponse.json(
      { folder: newFolder, message: "Folder created successfully" },
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
    
    // Delete folder (this will cascade delete saved news due to foreign key)
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