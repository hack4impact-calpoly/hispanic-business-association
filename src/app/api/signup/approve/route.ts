import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import SignupRequest from "@/database/signupRequestSchema";
import { currentUser } from "@clerk/nextjs/server";
import { emailTemplates } from "@/app/api/send-email/emailTemplates";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await req.json();
    if (!requestId) {
      return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
    }

    await connectDB();

    const requestData = await SignupRequest.findById(requestId);
    if (!requestData) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    if (requestData.status === "closed") {
      return NextResponse.json({ message: "Request already closed" }, { status: 400 });
    }

    requestData.status = "closed";
    requestData.decision = "approved";
    await requestData.save();

    // Send email notification to business POC
    if (requestData.pointOfContact?.email) {
      const { subject, body } = emailTemplates.signupApproved({ businessName: requestData.businessName });
      await fetch("/api/send-email", {
        method: "POST",
        body: (() => {
          const form = new FormData();
          form.append("toAddresses", JSON.stringify([requestData.pointOfContact.email]));
          form.append("subject", subject);
          form.append("body", body);
          return form;
        })(),
      });
    }

    return NextResponse.json({ message: "Request approved successfully", request: requestData });
  } catch (error) {
    console.error("Error approving request:", error);
    return NextResponse.json({ message: "Error approving request" }, { status: 500 });
  }
}
