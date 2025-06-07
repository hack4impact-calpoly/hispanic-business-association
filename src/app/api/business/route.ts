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
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ message: "User not logged in" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    // Cross-account data access requires admin role verification
    if (clerkId && clerkId !== clerkUser.id) {
      if (clerkUser.publicMetadata?.role !== "admin") {
        return NextResponse.json({ message: "Admin access required" }, { status: 403 });
      }
    }

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
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ message: "User not logged in" }, { status: 401 });
    }

    await connectDB();

    const {
      clerkUserID,
      businessName,
      businessType,
      businessOwner,
      website,
      physicalAddress,
      mailingAddress,
      pointOfContact,
      socialMediaHandles,
      description,
      organizationType,
      businessScale,
      membershipStartDate,
      numberOfEmployees,
      logoUrl,
      bannerUrl,
      gender,
    } = await req.json();

    // Determine clerkUserID from request body or authenticated user
    const targetClerkUserID = clerkUserID || clerkUser.id;

    // Check for existing business by same user
    const existingUserBusiness = await Business.findOne({ clerkUserID: targetClerkUserID });
    if (existingUserBusiness) {
      return NextResponse.json({ message: "Business already exists" }, { status: 400 });
    }

    // Check for existing business with same name
    const existingBusinessName = await Business.findOne({ businessName });
    if (existingBusinessName) {
      return NextResponse.json({ message: "Business already exists" }, { status: 400 });
    }

    const newBusiness = new Business({
      clerkUserID: targetClerkUserID,
      businessName,
      businessType,
      businessOwner,
      website,
      physicalAddress,
      mailingAddress,
      pointOfContact,
      membershipStartDate,
      socialMediaHandles,
      description,
      organizationType,
      businessScale,
      numberOfEmployees,
      logoUrl,
      bannerUrl,
      gender,
    });

    await newBusiness.save();
    return NextResponse.json(newBusiness, { status: 201 });
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
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ message: "User not logged in" }, { status: 401 });
    }

    await connectDB();

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
