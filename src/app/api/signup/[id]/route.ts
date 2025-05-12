import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import SignupRequest from "@/database/signupRequestSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get request ID from the route parameter
    const requestId = params.id;

    // Validate that the ID is a valid MongoDB ObjectId
    if (!requestId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: "Invalid request ID format" }, { status: 400 });
    }

    // Find the request in the database
    const requestData = await SignupRequest.findById(requestId);

    if (!requestData) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    // Return the request data
    return NextResponse.json(requestData);
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json({ message: "Failed to fetch request" }, { status: 500 });
  }
}
