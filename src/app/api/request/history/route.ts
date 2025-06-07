export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import RequestHistory from "@/database/requestHistorySchema";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role authorization
    if (user.publicMetadata?.role !== "admin") {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    await connectDB();

    // Get all request history without limits for admins
    const historyRecords = await RequestHistory.find().sort({ date: -1 });

    return NextResponse.json(historyRecords);
  } catch (error) {
    console.error("Error fetching request history:", error);
    return NextResponse.json({ message: "Failed to fetch request history" }, { status: 500 });
  }
}
