import connectDB from "@/database/db";
import Request from "@/database/requestSchema";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
    }

    await connectDB();

    const request = new Request({
      clerkUserID: user.id,
      description: body.description || null,
      businessName: body.businessName || null,
      businessType: body.businessType || null,
      businessOwner: body.businessOwner || null,
      website: body.website || null,
      address: body.address || null,
      pointOfContact: body.pointOfContact || null,
      socialMediaHandles: body.socialMediaHandles || null,
      date: new Date(),
    });

    await request.save();

    return NextResponse.json(
      {
        message: "Change request submitted successfully",
        requestId: request._id,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating change request:", error);
    return NextResponse.json({ error: "Failed to create change request", details: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const requests = await Request.find({ clerkUserID: user.id }).sort({ date: -1 });

    return NextResponse.json(requests);
  } catch (error: any) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests", details: error.message }, { status: 500 });
  }
}
