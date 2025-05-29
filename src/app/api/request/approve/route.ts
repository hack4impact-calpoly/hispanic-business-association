import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Request from "@/database/requestSchema";
import RequestHistory from "@/database/requestHistorySchema";
import Business from "@/database/businessSchema";
import { removeImage } from "@/lib/s3Actions";
import { currentUser } from "@clerk/nextjs/server";
import { emailTemplates } from "@/app/api/send-email/emailTemplates";

// Helper function to check if a field has changed
function isFieldChanged(requestValue: any, businessValue: any): boolean {
  // No change if request field is not provided
  if (requestValue === undefined || requestValue === null) {
    return false;
  }

  // Handle nested objects with deep equality check
  if (typeof requestValue === "object" && typeof businessValue === "object") {
    return JSON.stringify(requestValue) !== JSON.stringify(businessValue);
  }

  // Simple value comparison
  return requestValue !== businessValue;
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract request ID from the request body
    const body = await req.json();
    const requestId = body.requestId;

    if (!requestId) {
      return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
    }

    await connectDB();

    // Get the request from the database
    const requestData = await Request.findById(requestId);
    if (!requestData) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    // Find the business to update
    const business = await Business.findOne({ clerkUserID: requestData.clerkUserID });
    if (!business) {
      return NextResponse.json({ message: "Business not found" }, { status: 404 });
    }

    // Track images that need to be deleted
    const imagesToDelete = [];

    // Check for logo changes and store old URL if needed
    if (requestData.new.logoUrl && isFieldChanged(requestData.new.logoUrl, business.logoUrl)) {
      // Store old logo URL for deletion if it's not a default image
      if (business.logoUrl && !business.logoUrl.includes("Default_Logo")) {
        imagesToDelete.push(business.logoUrl);
      }
      business.logoUrl = requestData.new.logoUrl;
    }

    // Check for banner changes and store old URL if needed
    if (requestData.new.bannerUrl && isFieldChanged(requestData.new.bannerUrl, business.bannerUrl)) {
      // Store old banner URL for deletion if it's not a default image
      if (business.bannerUrl && !business.bannerUrl.includes("Default_Banner")) {
        imagesToDelete.push(business.bannerUrl);
      }
      business.bannerUrl = requestData.new.bannerUrl;
    }

    // Update business fields from new request data
    const newData = requestData.new;

    // Update top-level fields
    if (newData.businessName) business.businessName = newData.businessName;
    if (newData.businessType) business.businessType = newData.businessType;
    if (newData.businessOwner) business.businessOwner = newData.businessOwner;
    if (newData.website) business.website = newData.website;
    if (newData.description) business.description = newData.description;

    // Update nested objects if they exist
    if (newData.address) {
      if (!business.address) business.address = {};

      if (newData.address.street) business.address.street = newData.address.street;
      if (newData.address.city) business.address.city = newData.address.city;
      if (newData.address.state) business.address.state = newData.address.state;
      if (newData.address.zip) business.address.zip = newData.address.zip;
      if (newData.address.county) business.address.county = newData.address.county;
    }

    if (newData.pointOfContact) {
      if (!business.pointOfContact) business.pointOfContact = {};

      if (newData.pointOfContact.name) business.pointOfContact.name = newData.pointOfContact.name;
      if (newData.pointOfContact.phoneNumber) business.pointOfContact.phoneNumber = newData.pointOfContact.phoneNumber;
      if (newData.pointOfContact.email) business.pointOfContact.email = newData.pointOfContact.email;
    }

    if (newData.socialMediaHandles) {
      if (!business.socialMediaHandles) business.socialMediaHandles = {};

      if (newData.socialMediaHandles.IG) business.socialMediaHandles.IG = newData.socialMediaHandles.IG;
      if (newData.socialMediaHandles.twitter) business.socialMediaHandles.twitter = newData.socialMediaHandles.twitter;
      if (newData.socialMediaHandles.FB) business.socialMediaHandles.FB = newData.socialMediaHandles.FB;
    }

    // Save the updated business
    await business.save();

    // Delete old images after successful database update
    for (const imageUrl of imagesToDelete) {
      try {
        await removeImage(imageUrl);
      } catch (imageError) {
        console.error("Error removing old image:", imageError);
        // Continue even if image deletion fails
      }
    }

    // Create a history entry
    const historyData = {
      clerkUserID: requestData.clerkUserID,
      old: requestData.old,
      new: requestData.new,
      date: requestData.date,
      status: "closed",
      decision: "approved",
    };

    await RequestHistory.create(historyData);

    // Mark the request as closed and approved
    requestData.status = "closed";
    requestData.decision = "approved";
    await requestData.save();

    // Delete the request from the requests collection
    await Request.findByIdAndDelete(requestId);

    // Send email notification to business POC
    if (business.pointOfContact?.email) {
      const { subject, body } = emailTemplates.businessApproved({ businessName: business.businessName });
      await fetch("/api/send-email", {
        method: "POST",
        body: (() => {
          const form = new FormData();
          form.append("toAddresses", JSON.stringify([business.pointOfContact.email]));
          form.append("subject", subject);
          form.append("body", body);
          return form;
        })(),
      });
    }

    return NextResponse.json({ message: "Request approved successfully" });
  } catch (error) {
    console.error("Error approving request:", error);
    return NextResponse.json({ message: "Error approving request" }, { status: 500 });
  }
}
