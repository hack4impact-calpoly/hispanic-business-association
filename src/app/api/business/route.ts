import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import Business from "@/database/businessSchema";
import { currentUser } from "@clerk/nextjs/server";

/**
 * GET handler for business data
 * Supports queries by clerkId or retrieving current user's business
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get authenticated user
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ message: "User not logged in" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    // Determine which user's business to retrieve
    const queryClerkId = clerkId || clerkUser.id;

    // Find business by clerk user ID
    const business = await Business.findOne({ clerkUserID: queryClerkId });

    if (!business) {
      return NextResponse.json({ message: "Business not found" }, { status: 404 });
    }

    return NextResponse.json(business, { status: 200 });
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json({ message: "Error occurred", error }, { status: 500 });
  }
}

/**
 * POST handler for creating business
 * Uses authenticated user's ID unless specified
 */
export async function POST(req: Request) {
  try {
    await connectDB();
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ message: "User not logged in" }, { status: 401 });
    }

    const clerkUserID = clerkUser.id;
    const {
      businessName,
      businessType,
      businessOwner,
      website,
      address,
      pointOfContact,
      socialMediaHandles,
      description,
    } = await req.json();

    // Check if business already exists
    const existingBusiness = await Business.findOne({ businessName: businessName });
    if (existingBusiness) {
      return NextResponse.json({ message: "Business already exists" }, { status: 400 });
    }

    // Create new business
    const new_business = new Business({
      clerkUserID,
      businessName,
      businessType,
      businessOwner,
      website,
      address,
      pointOfContact,
      socialMediaHandles,
      description,
    });

    await new_business.save();
    return NextResponse.json(new_business, { status: 201 });
  } catch (error) {
    console.error("Error creating business:", error);
    return NextResponse.json({ message: "Error occurred", error }, { status: 500 });
  }
}

/**
 * PATCH handler for updating business
 * Modifies logo or banner for current authenticated user
 */
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ message: "User not logged in" }, { status: 401 });
    }

    const clerkUserID = clerkUser.id;
    const updates = await req.json();

    // Find business by clerk user ID
    const business = await Business.findOne({ clerkUserID });
    if (!business) {
      return NextResponse.json({ message: "Business not found" }, { status: 404 });
    }

    // Update only the provided fields
    if (updates.logoUrl !== undefined) {
      business.logoUrl = updates.logoUrl;
    }
    if (updates.bannerUrl !== undefined) {
      business.bannerUrl = updates.bannerUrl;
    }

    await business.save();
    return NextResponse.json(business, { status: 200 });
  } catch (error) {
    console.error("Error updating business:", error);
    return NextResponse.json({ message: "Error occurred", error }, { status: 500 });
  }
}
