import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import SignupRequest from "@/database/signupRequestSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await req.json();
    if (!requestId) {
      return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
    }

    await connectDB();

    const requestData = await SignupRequest.findById(requestId);
    if (!requestData) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    if (requestData.status === "closed") {
      return NextResponse.json({ message: "Request already closed" }, { status: 400 });
    }

    requestData.status = "closed";
    requestData.decision = "approved";
    await requestData.save();

    return NextResponse.json({ message: "Request approved successfully", request: requestData });
  } catch (error) {
    console.error("Error approving request:", error);
    return NextResponse.json({ message: "Error approving request" }, { status: 500 });
  }
}
