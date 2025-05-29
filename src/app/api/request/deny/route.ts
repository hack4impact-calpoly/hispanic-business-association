import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Request from "@/database/requestSchema";
import RequestHistory from "@/database/requestHistorySchema";
import { currentUser } from "@clerk/nextjs/server";
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
    const denialMessage = body.denialMessage || "";

    if (!requestId) {
      return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
    }

    await connectDB();

    // Get the request from the database
    const requestData = await Request.findById(requestId);
    if (!requestData) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    // Create a history entry
    const historyData = {
      clerkUserID: requestData.clerkUserID,
      old: requestData.old,
      new: requestData.new,
      date: requestData.date,
      status: "closed",
      decision: "denied",
      denialMessage,
    };

    await RequestHistory.create(historyData);

    // Mark the request as closed and denied
    requestData.status = "closed";
    requestData.decision = "denied";
    requestData.denialMessage = denialMessage;
    await requestData.save();

    // Delete the request from the requests collection
    await Request.findByIdAndDelete(requestId);

    // Send email notification to business POC
    // if (requestData.new?.pointOfContact?.email) {
    //   const { subject, body } = emailTemplates.businessDenied({
    //     businessName: requestData.new.businessName,
    //     denialMessage,
    //   });
    //   await fetch("/api/send-email", {
    //     method: "POST",
    //     body: (() => {
    //       const form = new FormData();
    //       form.append("toAddresses", JSON.stringify([requestData.new.pointOfContact.email]));
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
