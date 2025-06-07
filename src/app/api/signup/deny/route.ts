import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import SignupRequest from "@/database/signupRequestSchema";
import { currentUser } from "@clerk/nextjs/server";
import { Types } from "mongoose";

export async function POST(req: Request) {
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

    // Extract request ID from the request body
    const body = await req.json();
    const requestId = body.requestId;

    if (!requestId) {
      return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
    }

    // Validate ObjectId format before database query
    if (!Types.ObjectId.isValid(requestId)) {
      return NextResponse.json({ message: "Invalid request ID format" }, { status: 400 });
    }

    await connectDB();

    // Get the request from the database
    const requestData = await SignupRequest.findById(requestId);
    if (!requestData) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    // Prevent processing already closed requests
    if (requestData.status === "closed") {
      return NextResponse.json({ message: "Request already closed" }, { status: 400 });
    }

    // Mark the request as closed and denied
    requestData.status = "closed";
    requestData.decision = "denied";
    await requestData.save();

    return NextResponse.json({ message: "Request denied successfully" });
  } catch (error) {
    console.error("Error denying request:", error);
    return NextResponse.json({ message: "Error denying request" }, { status: 500 });
  }
}
