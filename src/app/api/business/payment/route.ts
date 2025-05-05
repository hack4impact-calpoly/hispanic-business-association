import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import Business from "@/database/businessSchema";
import { currentUser } from "@clerk/nextjs/server";

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
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    console.log(oneYearFromNow);
    const business = await Business.updateOne(
      { clerkUserID: clerkUser.id },
      { $set: { membershipExpiryDate: oneYearFromNow, lastPayDate: new Date() } },
      { upsert: true },
    );
    console.log(business);
    return NextResponse.json(business);
  } catch (error) {
    console.error("Error updating business:", error);
    return NextResponse.json({ message: "Error occurred", error }, { status: 500 });
  }
}
