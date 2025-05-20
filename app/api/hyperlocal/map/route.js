import { db } from "@/utils";
import { HYPERLOCAL_NEWS, HYPERLOCAL_CATEGORIES } from "@/utils/schema";
import { NextResponse } from "next/server";
import { and, eq, gte, lte, sql, or } from "drizzle-orm";


export async function GET(req) {
  try {
    const url = new URL(req.url);
    
    // Extract user location and radius parameters
    const userLat = url.searchParams.get('userLat');
    const userLng = url.searchParams.get('userLng');
    const radius = url.searchParams.get('radius') || 10; // Default 10km

    console.log("userLat", userLat, "userLng", userLng)
    
    // Extract bounding box parameters from query string (if present)
    const north = url.searchParams.get('north');
    const south = url.searchParams.get('south');
    const east = url.searchParams.get('east');
    const west = url.searchParams.get('west');
    
    // If no user location is provided, return an empty array
    // This enforces the requirement that users must provide their location
    if (!userLat || !userLng) {
      return NextResponse.json([]);
    }
    
    // Build base query
    let query = db
      .select({
        id: HYPERLOCAL_NEWS.id,
        title: HYPERLOCAL_NEWS.title,
        image_url: HYPERLOCAL_NEWS.image_url,
        // article_url: HYPERLOCAL_NEWS.article_url,
        content: HYPERLOCAL_NEWS.content,
        latitude: HYPERLOCAL_NEWS.latitude,
        longitude: HYPERLOCAL_NEWS.longitude,
        category: HYPERLOCAL_CATEGORIES.name,
        created_at: HYPERLOCAL_NEWS.created_at,
      })
      .from(HYPERLOCAL_NEWS)
      .leftJoin(HYPERLOCAL_CATEGORIES, eq(HYPERLOCAL_NEWS.category_id, HYPERLOCAL_CATEGORIES.id));
    
    // First, filter by user's location radius
    // Using the Haversine formula to calculate distance between points
    // Note: This is a simplified version for SQL
    const haversineFormula = sql`
      (
        6371 * acos(
          cos(radians(${parseFloat(userLat)})) * 
          cos(radians(${HYPERLOCAL_NEWS.latitude})) * 
          cos(radians(${HYPERLOCAL_NEWS.longitude}) - radians(${parseFloat(userLng)})) + 
          sin(radians(${parseFloat(userLat)})) * 
          sin(radians(${HYPERLOCAL_NEWS.latitude}))
        )
      )
    `;
    
    // Apply radius filter - only show news within the specified radius
    query = query.where(lte(haversineFormula, parseFloat(radius)));
    
    // Apply additional geographic filtering if bounds are provided
    if (north && south && east && west) {
      query = query.where(
        and(
          gte(HYPERLOCAL_NEWS.latitude, parseFloat(south)),
          lte(HYPERLOCAL_NEWS.latitude, parseFloat(north)),
          // Handle cases where the map crosses the 180th meridian
          east < west 
            ? or(
                gte(HYPERLOCAL_NEWS.longitude, parseFloat(west)),
                lte(HYPERLOCAL_NEWS.longitude, parseFloat(east))
              )
            : and(
                gte(HYPERLOCAL_NEWS.longitude, parseFloat(west)),
                lte(HYPERLOCAL_NEWS.longitude, parseFloat(east))
              )
        )
      );
    }
    
    // Execute the query
    const news = await query.orderBy(sql`${HYPERLOCAL_NEWS.created_at} DESC`);

    // Return the news data
    return NextResponse.json(news);
  } catch (error) {
    console.error("News Map API Error:", error);
    return NextResponse.json(
      { message: "Error fetching news data" },
      { status: 500 }
    );
  }
}