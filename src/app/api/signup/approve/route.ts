import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import SignupRequest from "@/database/signupRequestSchema";
import Business from "@/database/businessSchema";
import { currentUser } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { setUserRole } from "@/lib/setUserRole";
import { sendEmail } from "@/lib/sendEmail";
import { emailTemplates } from "@/app/api/send-email/emailTemplates";

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

    // Validate ObjectId format before database query
    if (!Types.ObjectId.isValid(requestId)) {
      return NextResponse.json({ message: "Invalid request ID format" }, { status: 400 });
    }

    await connectDB();

    // Get the request from the database
    const requestData = await SignupRequest.findById(requestId);
    if (!requestData) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    // Prevent processing already closed requests
    if (requestData.status === "closed") {
      return NextResponse.json({ message: "Request already closed" }, { status: 400 });
    }

    await setUserRole(requestData.clerkUserID, "business");

    // Create business record with complete required data
    const businessData = {
      clerkUserID: requestData.clerkUserID,
      businessName: requestData.businessName,
      businessOwner: requestData.businessOwner,
      organizationType: requestData.organizationType,
      businessType: requestData.businessType,
      businessScale: requestData.businessScale,
      numberOfEmployees: requestData.numberOfEmployees,
      gender: requestData.gender,
      website: requestData.website,
      description: requestData.description,
      physicalAddress: requestData.physicalAddress,
      mailingAddress: requestData.mailingAddress,
      pointOfContact: requestData.pointOfContact,
      socialMediaHandles: requestData.socialMediaHandles,
      membershipStartDate: new Date(),
    };

    // Create business record
    const newBusiness = new Business(businessData);
    await newBusiness.save();

    // Update signup request status after successful business creation
    requestData.status = "closed";
    requestData.decision = "approved";
    await requestData.save();

    if (businessData.pointOfContact?.email) {
      const { subject, body } = emailTemplates.signupApproved({ businessName: businessData.businessName });
      await sendEmail({
        to: businessData.pointOfContact.email,
        subject,
        body,
      });
    }

    return NextResponse.json({ message: "Request approved successfully", request: requestData });
  } catch (error) {
    console.error("Error approving request:", error);
    return NextResponse.json({ message: "Error approving request" }, { status: 500 });
  }
}
