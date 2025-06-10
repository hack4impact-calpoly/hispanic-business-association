import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db"; // Assuming you have a connectDB function
import { WebhooksHelper } from "square";

export const runtime = "nodejs";

async function isValidSquareSignature(rawBody: string, signature: string): Promise<boolean> {
  console.log("requestBody:", rawBody);
  console.log("signatureHeader:", signature);
  console.log("signatureKey:", process.env.SQUARE_WEBHOOK_SIGNATURE_KEY);
  console.log("notificationUrl:", process.env.SQUARE_WEBHOOK_NOTIFICATION_URL);
  return await WebhooksHelper.verifySignature({
    requestBody: rawBody,
    signatureHeader: signature,
    signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
    notificationUrl: process.env.SQUARE_WEBHOOK_NOTIFICATION_URL!, // e.g., https://yourdomain.com/api/square/webhooks
  });
}

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    console.log("Connected to DB");
    // Get the raw body of the request to validate the signature
    const rawBody = await req.text();

    // Get the signature from Square's webhook header
    const signature = req.headers.get("x-square-hmacsha256-signature");
    console.log("🧪 Signature Header:", signature);
    console.log("🧪 Raw Body Length:", rawBody.length);
    if (!signature || !(await isValidSquareSignature(rawBody, signature))) {
      return NextResponse.json({ message: "Missing Square signature header" }, { status: 400 });
    }

    // Parse the JSON body to get the webhook event
    console.log("GOT HERE");
    const event = JSON.parse(rawBody);

    // Handle the payment.updated event
    if (event.type === "payment.updated") {
      const payment = event.data.object;

      // Check if the payment status is 'COMPLETED'
      if (payment.status === "COMPLETED") {
        const paymentId = payment.id;
        const orderId = payment.order_id;
        const amount = payment.amount_money.amount; // Amount in the smallest unit (e.g., cents)
        const currency = payment.amount_money.currency;

        console.log("Payment completed:", { paymentId, orderId, amount, currency });

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
