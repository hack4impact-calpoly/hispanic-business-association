import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import Business from "@/database/businessSchema";
import { currentUser } from "@clerk/nextjs/server";

/**
 * GET handler for retrieving a business by MongoDB ID
 * @param req - Incoming request
 * @param params - Route parameters containing business ID
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is authenticated
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get business by MongoDB ID
    const business = await Business.findById(params.id);

    if (!business) {
      return NextResponse.json({ message: "Business not found" }, { status: 404 });
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error("Error fetching business by ID:", error);
    return NextResponse.json({ message: "Failed to fetch business" }, { status: 500 });
  }
}
