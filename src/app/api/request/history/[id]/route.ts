import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import RequestHistory from "@/database/requestHistorySchema";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Ensure the user is an admin
    if (user.publicMetadata.role !== "admin") {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    await connectDB();

    // Get request ID from the route parameter
    const requestId = params.id;

    // Validate that the ID is a valid MongoDB ObjectId
    if (!requestId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: "Invalid request ID format" }, { status: 400 });
    }

    // Find the request history in the database
    const historyData = await RequestHistory.findById(requestId);

    if (!historyData) {
      return NextResponse.json({ message: "Request history not found" }, { status: 404 });
    }

    // Return the request history data
    return NextResponse.json(historyData);
  } catch (error) {
    console.error("Error fetching request history:", error);
    return NextResponse.json({ message: "Failed to fetch request history" }, { status: 500 });
  }
}
