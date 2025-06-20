// /api/user/folders/[folderId]/route.js
import { NextResponse } from 'next/server';
import { USER_FOLDERS, SAVED_NEWS } from '@/utils/schema';
import { eq, and, ne } from 'drizzle-orm';
import { authenticate } from '@/lib/jwtMiddleware';
import { db } from '@/utils';

// PUT - Update folder name
export async function PUT(req, { params }) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const folderId = parseInt(params.folderId);
  
  try {
    const { name } = await req.json();
    
    // Validate input
    if (!name || !name.trim()) {
      return NextResponse.json(
        { message: "Folder name is required" },
        { status: 400 }
      );
    }
    
    const folderName = name.trim();
    
    // Check if folder exists and belongs to user
    const existingFolder = await db
      .select()
      .from(USER_FOLDERS)
      .where(
        and(
          eq(USER_FOLDERS.id, folderId),
          eq(USER_FOLDERS.user_id, userId)
        )
      )
      .limit(1);
    
    if (existingFolder.length === 0) {
      return NextResponse.json(
        { message: "Folder not found" },
        { status: 404 }
      );
    }
    
    // Check if another folder with same name already exists for this user
    const duplicateFolder = await db
      .select()
      .from(USER_FOLDERS)
      .where(
        and(
          eq(USER_FOLDERS.user_id, userId),
          eq(USER_FOLDERS.name, folderName),
          // Exclude current folder from check
          ne(USER_FOLDERS.id, folderId)
        )
      )
      .limit(1);
    
    if (duplicateFolder.length > 0) {
      return NextResponse.json(
        { message: "A folder with this name already exists" },
        { status: 409 }
      );
    }
    
    // Update folder
    await db
        .update(USER_FOLDERS)
        .set({ 
            name: folderName,
            updated_at: new Date()
        })
        .where(
            and(
            eq(USER_FOLDERS.id, folderId),
            eq(USER_FOLDERS.user_id, userId)
            )
        )
        .execute();

    // Fetch updated folder
    const [updatedFolder] = await db
        .select()
        .from(USER_FOLDERS)
        .where(eq(USER_FOLDERS.id, folderId));

    return NextResponse.json(
        { 
            message: "Folder updated successfully",
            folder: updatedFolder 
        },
        { status: 200 }
    );

  } catch (error) {
    console.error("Error updating folder:", error);
    return NextResponse.json(
      { message: "Error updating folder", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete folder and all its saved news
export async function DELETE(req, { params }) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  
  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const folderId = parseInt(params.folderId);
  
  try {
    // Check if folder exists and belongs to user
    const existingFolder = await db
      .select()
      .from(USER_FOLDERS)
      .where(
        and(
          eq(USER_FOLDERS.id, folderId),
          eq(USER_FOLDERS.user_id, userId)
        )
      )
      .limit(1);
    
    if (existingFolder.length === 0) {
      return NextResponse.json(
        { message: "Folder not found" },
        { status: 404 }
      );
    }
    
    // Start transaction to delete folder and all associated saved news
    await db.transaction(async (tx) => {
      // First delete all saved news in this folder
      await tx
        .delete(SAVED_NEWS)
        .where(eq(SAVED_NEWS.user_folder_id, folderId));
      
      // Then delete the folder
      await tx
        .delete(USER_FOLDERS)
        .where(
          and(
            eq(USER_FOLDERS.id, folderId),
            eq(USER_FOLDERS.user_id, userId)
          )
        );
    });
    
    return NextResponse.json(
      { message: "Folder and all saved news deleted successfully" },
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