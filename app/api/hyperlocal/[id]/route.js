import { db } from "@/utils";
import { HYPERLOCAL_NEWS } from "@/utils/schema";
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import { eq } from "drizzle-orm";
import Client from 'ssh2-sftp-client';

// DELETE - Delete a news item
export async function DELETE(req, { params }) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const { id } = params;

  try {
    const newsId = parseInt(id);
    if (isNaN(newsId)) {
      return NextResponse.json(
        { message: "Invalid news ID" },
        { status: 400 }
      );
    }

    // Get the news item first to check if it exists and to get the image URL
    const newsItem = await db
      .select()
      .from(HYPERLOCAL_NEWS)
      .where(eq(HYPERLOCAL_NEWS.id, newsId))
      .limit(1);

    if (!newsItem || newsItem.length === 0) {
      return NextResponse.json(
        { message: "News item not found" },
        { status: 404 }
      );
    }

    // If the news item has an image that was uploaded (not a URL), delete it from cPanel
    const imageUrl = newsItem[0].image_url;
    if (imageUrl && !imageUrl.startsWith('http')) {
      const sftp = new Client();
      try {
        await sftp.connect({
          host: '68.178.163.247',
          port: 22,
          username: 'devusr',
          password: 'Wowfyuser#123',
        });
        
        // Path to delete the file
        const remotePath = `/home/devusr/uploads/${imageUrl}`;
        
        // Check if file exists before attempting to delete
        const exists = await sftp.exists(remotePath);
        if (exists) {
          await sftp.delete(remotePath);
          console.log(`Deleted image: ${remotePath}`);
        }
      } catch (sftpError) {
        console.error('SFTP Error:', sftpError);
        // Continue with the deletion even if file deletion fails
      } finally {
        // Always close the connection
        await sftp.end();
      }
    }

    // Delete the news item
    await db
      .delete(HYPERLOCAL_NEWS)
      .where(eq(HYPERLOCAL_NEWS.id, newsId));

    return NextResponse.json(
      { message: "News item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting news item ${id}:`, error);
    return NextResponse.json(
      { message: "Error deleting news item", details: error.message },
      { status: 500 }
    );
  }
}