import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import AdminMailingAddress from "@/database/adminAddressSchema";
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

    // Find business by clerk user ID
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
    const address = await req.json();
    // Find business by clerk user ID
    const adminAddress = await AdminMailingAddress.updateOne({}, { $set: { address: address } });
    if (!adminAddress) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    return NextResponse.json(adminAddress, { status: 200 });
  } catch (error) {
    console.error("Error finding address:", error);
    return NextResponse.json({ message: "Error occurred", error }, { status: 500 });
  }
}
