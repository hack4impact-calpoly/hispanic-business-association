import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import AdminMailingAddress from "@/database/adminAddressSchema";
import { currentUser } from "@clerk/nextjs/server";

/**
 * GET handler for admin address data
 * Retrieves current admin mailing address
 */
export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ message: "User not logged in" }, { status: 401 });
    }

    // Verify admin role authorization
    if (clerkUser.publicMetadata?.role !== "admin") {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    await connectDB();

    // Find admin address record
    const address = await AdminMailingAddress.findOne({});
    if (!address) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    return NextResponse.json(address, { status: 200 });
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json({ message: "Error occurred", error }, { status: 500 });
  }
}

/**
 * PATCH handler for updating admin address
 * Creates new record if none exists
 */
export async function PATCH(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ message: "User not logged in" }, { status: 401 });
    }

    // Verify admin role authorization
    if (clerkUser.publicMetadata?.role !== "admin") {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    await connectDB();

    const addressUpdates = await req.json();

    // Get existing address record
    const existingRecord = await AdminMailingAddress.findOne({});

    // Preserve existing address fields during partial updates
    const existingAddress = existingRecord?.address || {};
    const mergedAddress = {
      ...existingAddress,
      ...addressUpdates,
    };

    // Update existing record or create new one
    const adminAddress = await AdminMailingAddress.findOneAndUpdate(
      {},
      { $set: { address: mergedAddress } },
      { upsert: true, new: true },
    );

    return NextResponse.json(adminAddress, { status: 200 });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json({ message: "Error occurred", error }, { status: 500 });
  }
}
