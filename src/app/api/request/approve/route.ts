import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Request from "@/database/requestSchema";
import Business from "@/database/businessSchema";
import { removeImage } from "@/app/actions/s3Actions";
import { currentUser } from "@clerk/nextjs/server";

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
    // Check authentication (existing code)
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract request ID from the request body (existing code)
    const body = await req.json();
    const requestId = body.requestId;

    if (!requestId) {
      return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
    }

    await connectDB();

    // Get the request from the database (existing code)
    const requestData = await Request.findById(requestId);
    if (!requestData) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    // Find the business to update (existing code)
    const business = await Business.findOne({ clerkUserID: requestData.clerkUserID });
    if (!business) {
      return NextResponse.json({ message: "Business not found" }, { status: 404 });
    }

    // Track images that need to be deleted
    const imagesToDelete = [];

    // Check for logo changes and store old URL if needed
    if (requestData.logoUrl && isFieldChanged(requestData.logoUrl, business.logoUrl)) {
      // Store old logo URL for deletion if it's not a default image
      if (business.logoUrl && !business.logoUrl.includes("Default_Logo")) {
        imagesToDelete.push(business.logoUrl);
      }
      business.logoUrl = requestData.logoUrl;
    }

    // Check for banner changes and store old URL if needed
    if (requestData.bannerUrl && isFieldChanged(requestData.bannerUrl, business.bannerUrl)) {
      // Store old banner URL for deletion if it's not a default image
      if (business.bannerUrl && !business.bannerUrl.includes("Default_Banner")) {
        imagesToDelete.push(business.bannerUrl);
      }
      business.bannerUrl = requestData.bannerUrl;
    }

    // Update only fields that have changed
    // Top-level fields
    if (requestData.businessName && isFieldChanged(requestData.businessName, business.businessName)) {
      business.businessName = requestData.businessName;
    }

    if (requestData.businessType && isFieldChanged(requestData.businessType, business.businessType)) {
      business.businessType = requestData.businessType;
    }

    if (requestData.businessOwner && isFieldChanged(requestData.businessOwner, business.businessOwner)) {
      business.businessOwner = requestData.businessOwner;
    }

    if (requestData.website && isFieldChanged(requestData.website, business.website)) {
      business.website = requestData.website;
    }

    if (requestData.logoUrl && isFieldChanged(requestData.logoUrl, business.logoUrl)) {
      business.logoUrl = requestData.logoUrl;
    }

    if (requestData.bannerUrl && isFieldChanged(requestData.bannerUrl, business.bannerUrl)) {
      business.bannerUrl = requestData.bannerUrl;
    }

    if (requestData.description && isFieldChanged(requestData.description, business.description)) {
      business.description = requestData.description;
    }

    // Handle nested objects: address
    if (requestData.address) {
      if (!business.address) business.address = {};

      const addressFields = ["street", "city", "state", "zip", "county"];
      addressFields.forEach((field) => {
        if (
          requestData.address[field] !== undefined &&
          isFieldChanged(requestData.address[field], business.address[field])
        ) {
          business.address[field] = requestData.address[field];
        }
      });
    }

    // Handle nested objects: pointOfContact
    if (requestData.pointOfContact) {
      if (!business.pointOfContact) business.pointOfContact = {};

      const contactFields = ["name", "phoneNumber", "email"];
      contactFields.forEach((field) => {
        if (
          requestData.pointOfContact[field] !== undefined &&
          isFieldChanged(requestData.pointOfContact[field], business.pointOfContact[field])
        ) {
          business.pointOfContact[field] = requestData.pointOfContact[field];
        }
      });
    }

    // Handle nested objects: socialMediaHandles
    if (requestData.socialMediaHandles) {
      if (!business.socialMediaHandles) business.socialMediaHandles = {};

      const socialFields = ["IG", "twitter", "FB"];
      socialFields.forEach((field) => {
        if (
          requestData.socialMediaHandles[field] !== undefined &&
          isFieldChanged(requestData.socialMediaHandles[field], business.socialMediaHandles[field])
        ) {
          business.socialMediaHandles[field] = requestData.socialMediaHandles[field];
        }
      });
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

    // Mark the request as closed and approved
    requestData.status = "closed";
    requestData.decision = "approved";
    await requestData.save();

    return NextResponse.json({ message: "Request approved successfully" });
  } catch (error) {
    console.error("Error approving request:", error);
    return NextResponse.json({ message: "Error approving request" }, { status: 500 });
  }
}
