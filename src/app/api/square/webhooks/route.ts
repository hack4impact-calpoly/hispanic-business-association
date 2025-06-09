import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/database/db";
import Business from "@/database/businessSchema";

export const runtime = "nodejs"; // Allows req.text()

function isValidSquareSignature(rawBody: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody);
  const digest = hmac.digest("base64");
  return digest === signature;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-square-hmacsha256-signature");
    const secret = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!;

    if (!signature || !isValidSquareSignature(rawBody, signature, secret)) {
      console.warn("Invalid or missing Square signature.");
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    console.log("Received Square event:", event.type);

    if (event.type === "payment.updated") {
      const payment = event.data.object;
      console.log("Payment status:", payment.status);

      if (payment.status === "COMPLETED") {
        const clerkUserId = payment.note;
        if (!clerkUserId) {
          console.error("Missing clerkUserId in payment.note");
          return NextResponse.json({ message: "Missing user ID" }, { status: 400 });
        }

        console.log("Updating business for user:", clerkUserId);
        await connectDB();

        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        const result = await Business.updateOne(
          { clerkUserID: clerkUserId },
          {
            $set: {
              membershipExpiryDate: oneYearFromNow,
              lastPayDate: new Date(),
            },
          },
          { upsert: true },
        );

        console.log("Mongo update result:", result);
        return NextResponse.json({ message: "Membership updated" }, { status: 200 });
      }
    }

    return NextResponse.json({ message: "Unhandled event type" }, { status: 400 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ message: "Webhook error", error }, { status: 500 });
  }
}
