export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Business from "@/database/businessSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch all businesses from the database
    const businesses = await Business.find({});

    // Return the businesses array
    return NextResponse.json(businesses);
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return NextResponse.json({ message: "Failed to fetch businesses" }, { status: 500 });
  }
}
