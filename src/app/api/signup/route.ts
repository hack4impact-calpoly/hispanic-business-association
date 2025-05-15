import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import SignupRequest from "@/database/signupRequestSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // get all requests from mongo
    const requestData = await SignupRequest.find({});
    return NextResponse.json(requestData);
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json({ message: "Failed to fetch request" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Returns 400 if body is missing
  if (body === null) {
    return NextResponse.json({ message: "Request is empty." }, { status: 400 });
  }

  try {
    // Retrieves current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
    }

    // Connect to DB
    await connectDB();

    // Get the clerkUserID from the body or use the current user's ID
    const clerkUserID = body["clerkUserID"] || user.id;

    // Dynamically build socialMediaHandles with non-empty values only
    const socialMediaHandles: Record<string, string> = {};
    if (body.socialMediaHandles?.IG) socialMediaHandles.IG = body.socialMediaHandles.IG;
    if (body.socialMediaHandles?.twitter) socialMediaHandles.twitter = body.socialMediaHandles.twitter;
    if (body.socialMediaHandles?.FB) socialMediaHandles.FB = body.socialMediaHandles.FB;

    // Build request object for the database
    const requestData = {
      clerkUserID,
      businessName: body["businessName"],
      businessType: body["businessType"],
      businessOwner: body["businessOwner"],
      website: body["website"],
      address: {
        street: body["address"]["street"],
        city: body["address"]["city"],
        state: body["address"]["state"],
        zip: body["address"]["zip"],
        county: body["address"]["county"],
      },
      pointOfContact: {
        name: body["pointOfContact"]["name"],
        phoneNumber: body["pointOfContact"]["phoneNumber"],
        email: body["pointOfContact"]["email"],
      },
      description: body["description"],
      date: body["date"],
      status: body["status"],
      decision: null,
    };

    // Only add socialMediaHandles if it's not empty
    if (Object.keys(socialMediaHandles).length > 0) {
      (requestData as any).socialMediaHandles = socialMediaHandles;
    }

    // Create a new request
    const newRequest = await SignupRequest.collection.insertOne(requestData);
    return NextResponse.json(
      { message: "Request created successfully", requestId: newRequest.insertedId },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error creating request:", err);
    return NextResponse.json({ message: "Error occurred", error: err }, { status: 500 });
  }
}
