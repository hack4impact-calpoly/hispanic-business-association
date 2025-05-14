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
      socialMediaHandles: body["socialMediaHandles"]
        ? {
            IG: body["socialMediaHandles"]["IG"],
            twitter: body["socialMediaHandles"]["twitter"],
            FB: body["socialMediaHandles"]["FB"],
          }
        : undefined,
      description: body["description"],
      date: body["date"],
      status: body["status"],
      decision: null,
    };

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
