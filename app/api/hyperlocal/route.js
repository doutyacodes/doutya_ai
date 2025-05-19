import { db } from "@/utils";
import { HYPERLOCAL_CATEGORIES, HYPERLOCAL_NEWS } from "@/utils/schema";
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import { desc, eq } from "drizzle-orm";

// GET - Fetch all news
export async function GET(req) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  console.log("user id", userId)

  try {
    // Fetch all news items with their associated categories
    const news = await db
    .select({
      id: HYPERLOCAL_NEWS.id,
      title: HYPERLOCAL_NEWS.title,
      image_url: HYPERLOCAL_NEWS.image_url,
      latitude: HYPERLOCAL_NEWS.latitude,
      longitude: HYPERLOCAL_NEWS.longitude,
      content: HYPERLOCAL_NEWS.content,
      category_id: HYPERLOCAL_NEWS.category_id,
      created_at: HYPERLOCAL_NEWS.created_at,
      category_name: HYPERLOCAL_CATEGORIES.name,
    })
    .from(HYPERLOCAL_NEWS)
    .leftJoin(HYPERLOCAL_CATEGORIES, eq(HYPERLOCAL_NEWS.category_id, HYPERLOCAL_CATEGORIES.id))
    .where(eq(HYPERLOCAL_NEWS.created_by, userId))
    .orderBy(desc(HYPERLOCAL_NEWS.created_at));

    // Send the news items as a JSON response
    return NextResponse.json(
      { news },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { message: "Error fetching news", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  // Authenticate user
  const authResult = await authenticate(req);
  if (!authResult.authenticated) {
    return authResult.response;
  }
  const userData = authResult.decoded_Data;
  const userId = userData.id;

  try {
    const {
      title,
      image_url,
      content,  // Changed from article_url to content
      latitude,
      longitude,
      category_id,
      delete_after_hours,
    } = await req.json();

    // Validate required fields
    if (!title || !image_url || !content) {
      return NextResponse.json(
        { message: "Title, image URL, and content are required" },
        { status: 400 }
      );
    }

    // Validate location data
    if (!latitude || !longitude) {
      return NextResponse.json(
        { message: "Location coordinates are required" },
        { status: 400 }
      );
    }

    // Validate user's current location with provided coordinates
    // This is a secondary validation in addition to frontend validation
    const userLat = req.headers.get('user-latitude');
    const userLng = req.headers.get('user-longitude');

    if (userLat && userLng) {
      const distance = calculateDistance(
        parseFloat(userLat),
        parseFloat(userLng),
        parseFloat(latitude),
        parseFloat(longitude)
      );

      if (distance > 10) {
        return NextResponse.json(
          { message: "News location must be within 10km of your current location" },
          { status: 400 }
        );
      }
    }

    // Create new hyperlocal news item
    const newNews = await db.insert(HYPERLOCAL_NEWS).values({
      title,
      image_url,
      content,  // Storing content instead of article_url
      latitude: latitude,
      longitude: longitude,
      created_by: userId,
      category_id: category_id || null,
      delete_after_hours: delete_after_hours || 24, // with fallback to default
    });

    return NextResponse.json(
      { message: "Hyperlocal news created successfully", id: newNews.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating hyperlocal news:", error);
    return NextResponse.json(
      { message: "Error creating hyperlocal news", details: error.message },
      { status: 500 }
    );
  }
}

// Function to calculate distance between two points in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// // Handle GET request to fetch hyperlocal news
// export async function GET(req) {

//   const authResult = await authenticate(req);
//   if (!authResult.authenticated) {
//     return authResult.response;
//   }
//   const userData = authResult.decoded_Data;
//   const userId = userData.id;

//   try {
//     const url = new URL(req.url);
//     const categoryId = url.searchParams.get('category_id');
//     const latitude = url.searchParams.get('latitude');
//     const longitude = url.searchParams.get('longitude');
//     const radius = url.searchParams.get('radius') || 10; // Default radius 10km

//     // Base query
//     let query = db.select().from(HYPERLOCAL_NEWS);

//     // Apply category filter if provided
//     if (categoryId) {
//       query = query.where(eq(HYPERLOCAL_NEWS.category_id, parseInt(categoryId)));
//     }

//     // Get news
//     const news = await query.orderBy(desc(HYPERLOCAL_NEWS.created_at));

//     // If location is provided, filter by distance
//     if (latitude && longitude) {
//       const userLat = parseFloat(latitude);
//       const userLng = parseFloat(longitude);
      
//       // Filter news by distance from user location
//       const filteredNews = news.filter(item => {
//         const distance = calculateDistance(
//           userLat,
//           userLng,
//           parseFloat(item.latitude),
//           parseFloat(item.longitude)
//         );
//         return distance <= parseFloat(radius);
//       });
      
//       return NextResponse.json({
//         news: filteredNews,
//         count: filteredNews.length 
//       });
//     }

//     return NextResponse.json({
//       news,
//       count: news.length
//     });
    
//   } catch (error) {
//     console.error("Error fetching hyperlocal news:", error);
//     return NextResponse.json(
//       { message: "Error fetching hyperlocal news", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// // Categories API
// export const GET_CATEGORIES = async (req) => {
//   try {
//     const categories = await db.select().from(HYPERLOCAL_CATEGORIES);
    
//     return NextResponse.json({
//       categories,
//       count: categories.length
//     });
//   } catch (error) {
//     console.error("Error fetching hyperlocal categories:", error);
//     return NextResponse.json(
//       { message: "Error fetching categories", details: error.message },
//       { status: 500 }
//     );
//   }
// };