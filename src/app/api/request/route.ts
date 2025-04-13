import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import requestSchema from "@/database/requestSchema";
import { currentUser } from "@clerk/nextjs/server";

// Handles POST requests
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Returns 400 if body is missing
  if (body == null) {
    return NextResponse.json({ message: "Request is empty" }, { status: 400 });
  }

  try {
    // Retrieves current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    // Builds request object for database
    const request = {
      clerkUserID: body["clerkUserID"] || user.id,
      // Original business information
      originalDescription: body["originalDescription"],
      // Updated fields
      businessName: body["businessName"],
      businessType: body["businessType"],
      businessOwner: body["businessOwner"],
      website: body["website"],
      address: body["address"]
        ? {
            street: body["address"]["street"],
            city: body["address"]["city"],
            state: body["address"]["state"],
            zip: body["address"]["zip"],
            county: body["address"]["county"],
          }
        : undefined,
      pointOfContact: body["pointOfContact"]
        ? {
            name: body["pointOfContact"]["name"],
            phoneNumber: body["pointOfContact"]["phoneNumber"],
            email: body["pointOfContact"]["email"],
          }
        : undefined,
      socialMediaHandles: body["socialMediaHandles"]
        ? {
            IG: body["socialMediaHandles"]["IG"],
            twitter: body["socialMediaHandles"]["twitter"],
            FB: body["socialMediaHandles"]["FB"],
          }
        : undefined,
      description: body["description"],
      // Timestamps
      date: body["date"] || new Date().toISOString(),
      requestType: "update",
    };

    // Connects to database, inserts new request document
    await connectDB();
    const newRequest = await requestSchema.collection.insertOne(request);

    // Returns success response with request ID
    return NextResponse.json(
      { message: "Request created successfully", requestId: newRequest.insertedId },
      { status: 201 },
    );
  } catch (err) {
    // Logs error, returns 500 status
    console.error("Error creating request:", err);
    return NextResponse.json({ message: "Error occurred", error: err }, { status: 500 });
  }
}

// Handles GET requests, returns all requests sorted by recency
export async function GET() {
  // Connects to database, verifies user session
  await connectDB();
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ message: "User not logged in" }, { status: 401 });
  }

  // Queries requests, sorts by date descending
  const dbRequests = await requestSchema.find().sort({ date: -1 });
  if (!dbRequests) {
    return NextResponse.json({ message: "Requests not found" }, { status: 404 });
  }

  // Returns requests in JSON response
  return NextResponse.json(dbRequests, { status: 200 });
}
