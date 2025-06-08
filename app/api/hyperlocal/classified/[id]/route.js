import { db } from "@/utils";
import { CLASSIFIED_ADS, HYPERLOCAL_CATEGORIES, USER_DETAILS } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "Invalid classified ad ID" },
        { status: 400 }
      );
    }

    // Join query to get classified ad with category name and author name
    const classifiedAds = await db
      .select({
        id: CLASSIFIED_ADS.id,
        title: CLASSIFIED_ADS.title,
        description: CLASSIFIED_ADS.description,
        ad_type: CLASSIFIED_ADS.ad_type,
        price: CLASSIFIED_ADS.price,
        type: CLASSIFIED_ADS.type,
        images: CLASSIFIED_ADS.images,
        contact_info: CLASSIFIED_ADS.contact_info,
        latitude: CLASSIFIED_ADS.latitude,
        longitude: CLASSIFIED_ADS.longitude,
        delete_after_hours: CLASSIFIED_ADS.delete_after_hours,
        created_at: CLASSIFIED_ADS.created_at,
        category_name: HYPERLOCAL_CATEGORIES.name,
        author_name: USER_DETAILS.name,
      })
      .from(CLASSIFIED_ADS)
      .leftJoin(
        HYPERLOCAL_CATEGORIES,
        eq(CLASSIFIED_ADS.category_id, HYPERLOCAL_CATEGORIES.id)
      )
      .leftJoin(
        USER_DETAILS,
        eq(CLASSIFIED_ADS.created_by, USER_DETAILS.id)
      )
      .where(eq(CLASSIFIED_ADS.id, parseInt(id)));

    if (!classifiedAds.length) {
      return NextResponse.json(
        { message: "Classified ad not found" },
        { status: 404 }
      );
    }

    // Since we're fetching by PK, there should be only one result
    const classifiedAd = classifiedAds[0];

    // Check if the ad should be auto-deleted based on delete_after_hours
    const createdAt = new Date(classifiedAd.created_at);
    const now = new Date();
    const hoursElapsed = (now - createdAt) / (1000 * 60 * 60);
    
    if (hoursElapsed > classifiedAd.delete_after_hours) {
      return NextResponse.json(
        { message: "This classified ad has expired" },
        { status: 410 } // Gone status code
      );
    }

    return NextResponse.json(
      { classifiedAd },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching classified ad:", error);
    return NextResponse.json(
      { message: "Error fetching classified ad", details: error.message },
      { status: 500 }
    );
  }
}