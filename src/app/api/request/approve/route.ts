import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Request from "@/database/requestSchema";
import Business from "@/database/businessSchema";
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

    // Find the business to update
    const business = await Business.findOne({ clerkUserID: requestData.clerkUserID });

    if (!business) {
      return NextResponse.json({ message: "Business not found" }, { status: 404 });
    }

    // Update the business with the requested changes
    // Only update fields that exist in the request
    if (requestData.businessName) business.businessName = requestData.businessName;
    if (requestData.businessType) business.businessType = requestData.businessType;
    if (requestData.businessOwner) business.businessOwner = requestData.businessOwner;
    if (requestData.website) business.website = requestData.website;

    // Handle nested objects carefully
    if (requestData.address) {
      if (requestData.address.street) business.address.street = requestData.address.street;
      if (requestData.address.city) business.address.city = requestData.address.city;
      if (requestData.address.state) business.address.state = requestData.address.state;
      if (requestData.address.zip) business.address.zip = requestData.address.zip;
      if (requestData.address.county) business.address.county = requestData.address.county;
    }

    if (requestData.pointOfContact) {
      if (requestData.pointOfContact.name) business.pointOfContact.name = requestData.pointOfContact.name;
      if (requestData.pointOfContact.phoneNumber)
        business.pointOfContact.phoneNumber = requestData.pointOfContact.phoneNumber;
      if (requestData.pointOfContact.email) business.pointOfContact.email = requestData.pointOfContact.email;
    }

    if (requestData.socialMediaHandles) {
      business.socialMediaHandles = business.socialMediaHandles || {};
      if (requestData.socialMediaHandles.IG) business.socialMediaHandles.IG = requestData.socialMediaHandles.IG;
      if (requestData.socialMediaHandles.twitter)
        business.socialMediaHandles.twitter = requestData.socialMediaHandles.twitter;
      if (requestData.socialMediaHandles.FB) business.socialMediaHandles.FB = requestData.socialMediaHandles.FB;
    }

    if (requestData.description) business.description = requestData.description;

    // Save the updated business
    await business.save();

    // Mark the request as approved
    requestData.status = "approved";
    await requestData.save();

    return NextResponse.json({ message: "Request approved successfully" });
  } catch (error) {
    console.error("Error approving request:", error);
    return NextResponse.json({ message: "Error approving request" }, { status: 500 });
  }
}
