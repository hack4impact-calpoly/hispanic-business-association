import connectDB from "@/database/db";
import Request from "@/database/requestSchema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
    }

    try {
      await connectDB();

      const request = new Request({
        clerkUserID: userId,
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
    } catch (dbError) {
      return NextResponse.json(
        {
          error: "Failed to create change request in database",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process change request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await connectDB();

      const requests = await Request.find({ clerkUserID: userId }).sort({ date: -1 });

      return NextResponse.json(requests);
    } catch (dbError) {
      return NextResponse.json(
        {
          error: "Failed to fetch requests from database",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
