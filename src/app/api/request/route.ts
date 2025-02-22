import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import requestSchema from "@/database/requestSchema";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body == null) {
    return NextResponse.json({ message: "Request is empty" }, { status: 400 });
  }

  try {
    const request = {
      clerkUserID: body["clerkUserID"],
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
      socialMediaHandles: {
        IG: body["socialMediaHandles"]["IG"],
        twitter: body["socialMediaHandles"]["twitter"],
        FB: body["socialMediaHandles"]["FB"],
      },
      description: body["description"],
      date: body["date"],
    };
    await connectDB();
    requestSchema.collection.insertOne(request);
    return NextResponse.json(request, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error occurred" }, { status: 500 });
  }
}
