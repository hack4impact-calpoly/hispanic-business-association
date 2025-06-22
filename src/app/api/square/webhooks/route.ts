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

// Helper function to check if a date is today
function isToday(someDate: Date): boolean {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
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

      if (payment.status === "COMPLETED") {
        const clerkUserID = payment.note;

        // Find the current business doc
        const businessDoc = await Business.findOne({ clerkUserID });

        // Determine base date (current expiry if in future, otherwise now)
        const baseDate = businessDoc?.membershipExpiryDate ? new Date(businessDoc.membershipExpiryDate) : new Date();

        // Add one year to base date
        const newExpiryDate = new Date(baseDate);
        newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);

        // Update membership expiry and last payment date
        await Business.updateOne(
          { clerkUserID },
          {
            $set: {
              membershipExpiryDate: newExpiryDate,
              lastPayDate: new Date(),
            },
          },
          { upsert: true },
        );

        return NextResponse.json({ message: "Payment processed successfully" }, { status: 200 });
      } else {
        return NextResponse.json({ message: "Payment not completed" }, { status: 200 });
      }
    }

    return NextResponse.json({ message: "Invalid event type" }, { status: 400 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ message: "Error occurred", error: (error as Error).message }, { status: 500 });
  }
}
