import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import SignupRequest from "@/database/signupRequestSchema";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { emailTemplates } from "@/app/api/send-email/emailTemplates";

export async function POST(req: Request) {
  try {
    // Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract request ID and denial message from the request body
    const body = await req.json();
    const requestId = body.requestId;
    const denialMessage = body.denialMessage;

    if (!requestId) {
      return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
    }

    await connectDB();

    // Get the request from the database
    const requestData = await SignupRequest.findById(requestId);
    if (!requestData) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    // Delete Clerk user account before database denial
    try {
      const client = await clerkClient();
      await client.users.deleteUser(requestData.clerkUserID);
    } catch (clerkError) {
      console.error("Failed to delete Clerk user:", clerkError);
      return NextResponse.json(
        {
          message: "Failed to delete user account - please try again later",
        },
        { status: 500 },
      );
    }

    // Mark signup request as denied with denial message after successful Clerk cleanup
    requestData.status = "closed";
    requestData.decision = "denied";
    requestData.denialMessage = denialMessage;
    await requestData.save();

    // Send email notification to business POC with denial message
    // if (requestData.pointOfContact?.email) {
    //   const { subject, body } = emailTemplates.signupDenied({
    //     businessName: requestData.businessName,
    //     denialMessage,
    //   });
    //   await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/send-email`, {
    //     method: "POST",
    //     body: (() => {
    //       const form = new FormData();
    //       form.append("toAddresses", JSON.stringify([requestData.pointOfContact.email]));
    //       form.append("subject", subject);
    //       form.append("body", body);
    //       return form;
    //     })(),
    //   });
    // }

    return NextResponse.json({ message: "Request denied successfully" });
  } catch (error) {
    console.error("Error denying request:", error);
    return NextResponse.json({ message: "Error denying request" }, { status: 500 });
  }
}
