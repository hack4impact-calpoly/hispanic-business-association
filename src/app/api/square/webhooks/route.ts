import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import { WebhooksHelper } from "square";
import Business from "@/database/businessSchema";

export const runtime = "nodejs";

async function isValidSquareSignature(rawBody: string, signature: string): Promise<boolean> {
  return await WebhooksHelper.verifySignature({
    requestBody: rawBody,
    signatureHeader: signature,
    signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
    notificationUrl: process.env.SQUARE_WEBHOOK_NOTIFICATION_URL!,
  });
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rawBody = await req.text();
    const signature = req.headers.get("x-square-hmacsha256-signature");
    if (!signature || !(await isValidSquareSignature(rawBody, signature))) {
      return NextResponse.json({ message: "Missing Square signature header" }, { status: 400 });
    }
    const event = JSON.parse(rawBody);

    if (event.type === "payment.updated") {
      const payment = event.data.object.payment;
      console.log("Payment updated event received:", payment);
      if (payment.status === "COMPLETED") {
        const clerkUserID = payment.note;
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        const business = await Business.updateOne(
          { clerkUserID: clerkUserID },
          { $set: { membershipExpiryDate: oneYearFromNow, lastPayDate: new Date() } },
          { upsert: true },
        );
        return NextResponse.json({ message: "Payment processed successfully" }, { status: 200 });
      } else {
        return NextResponse.json({ message: "Payment not completed" }, { status: 200 });
      }
    }
    // Return a 400 if the event type is not what we expect
    return NextResponse.json({ message: "Invalid event type" }, { status: 400 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ message: "Error occurred", error }, { status: 500 });
  }
}
