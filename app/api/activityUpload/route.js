import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as ftp from 'basic-ftp';  // Correct import syntax
import { USER_ACTIVITIES } from '@/utils/schema';
import { authenticate } from '@/lib/jwtMiddleware';
import jwt from "jsonwebtoken";
import os from 'os';

export async function POST(request) {
  const { child_id, token, course_id, image } = await request.json();

  // Define the local temp directory dynamically based on platform
  const localTempDir = os.tmpdir(); // Temporary storage in system's temp directory
  const fileName = `${Date.now()}-${child_id}-${course_id}.png`;
  const localFilePath = path.join(localTempDir, fileName);
  const cPanelDirectory = '/public_html/testusr/images';

  const authResult = await authenticate(request, true);
  if (!authResult.authenticated) {
    return authResult.response; // Return the response if authentication fails
  }

  let userId = null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return {
        response: NextResponse.json(
          { error: "Invalid token" },
          { status: 401 }
        ),
      };
    }
    userId = decoded.id;
  } catch (error) {
    // Log the error if necessary
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          error:
            error.message === "jwt expired"
              ? "Token has expired"
              : "Authentication failed",
        },
        { status: 401 }
      ),
    };
  }

  try {
    // Ensure the temp directory exists before saving the file
    if (!fs.existsSync(localTempDir)) {
      fs.mkdirSync(localTempDir, { recursive: true });
    }

    // Decode base64 image and save temporarily on server
    const base64Image = image.split(';base64,').pop();
    fs.writeFileSync(localFilePath, base64Image, { encoding: 'base64' });

    // FTP Connection details
    const client = new ftp.Client();  // Initialize the FTP client
    client.ftp.verbose = true;
    await client.access({
        host: '247.163.178.68',
        user: 'devusr',
        password: '###Wowfy123',
        port: 990, // or use 990 if it's FTPS
        secure: true, // set to true for FTPS
      });
      
      

    // Upload image to cPanel directory
    await client.uploadFrom(localFilePath, `${cPanelDirectory}/${fileName}`);

    // Close FTP connection
    client.close();

    // Save activity data in USER_ACTIVITIES table
    const activityRecord = await USER_ACTIVITIES.insert({
      child_id,
      user_id: userId, // Assuming token has user info
      course_id,
      image: `${cPanelDirectory}/${fileName}`, // Store the path for future use
      completion_status: false, // Set initial completion status
    });

    // Clean up temporary file
    fs.unlinkSync(localFilePath);

    return NextResponse.json(
      {
        message: 'Activity data and image saved successfully',
        activity: activityRecord,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error uploading image:', error);

    return NextResponse.json(
      {
        error: 'Failed to upload image and save activity data',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
