import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import Business from "@/database/businessSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ message: "User not logged in" }, { status: 401 });
    }
    console.log(clerkUser.id);
    const clerkUserID = clerkUser.id;
    const {
      businessName,
      businessType,
      businessOwner,
      website,
      address,
      pointOfContact,
      socialMediaHandles,
      description,
    } = await req.json();
    const business = await Business.findOne({ businessName: businessName });

    if (business) {
      return NextResponse.json({ message: "Business already exists" }, { status: 400 });
    }
    const new_business = new Business({
      clerkUserID,
      businessName,
      businessType,
      businessOwner,
      website,
      address,
      pointOfContact,
      socialMediaHandles,
      description,
    });
    await new_business.save();
    return NextResponse.json(new_business, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
