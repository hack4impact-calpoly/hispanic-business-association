import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import SignupRequest from "@/database/signupRequestSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    // const user = await currentUser();
    // if (!user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }
    console.log("got here");
    await connectDB();

    // get all requests from mongo
    const requestData = await SignupRequest.find({});
    console.log(requestData);
    console.log(Array.isArray(requestData));
    return NextResponse.json(requestData);
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json({ message: "Failed to fetch request" }, { status: 500 });
  }
}
