import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Request from "@/database/requestSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get the request from the database
    const requestId = params.id;
    const requestData = await Request.findById(requestId);

    if (!requestData) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    // Mark the request as denied
    requestData.status = "denied";
    await requestData.save();

    return NextResponse.json({ message: "Request denied successfully" });
  } catch (error) {
    console.error("Error denying request:", error);
    return NextResponse.json({ message: "Error denying request" }, { status: 500 });
  }
}
