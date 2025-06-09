"use server";
import { NextRequest, NextResponse } from "next/server";
import { SquareClient, SquareEnvironment } from "square";
import crypto from "crypto";
import { currentUser } from "@clerk/nextjs/server";

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox, // Change to Production when ready
});

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, title } = body;

    console.log("Creating payment link for user:", user.id);
    console.log("Amount:", amount, "Title:", title);

    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: crypto.randomUUID(),
      quickPay: {
        name: title || "Membership Fee",
        priceMoney: {
          amount: BigInt(amount),
          currency: "USD",
        },
        locationId: process.env.SQUARE_LOCATION_ID || "",
      },
      paymentNote: user.id, // Must be outside of quickPay
      checkoutOptions: {
        acceptedPaymentMethods: {
          applePay: true,
          googlePay: true,
          cashAppPay: false,
        },
        askForShippingAddress: false,
      },
    });

    console.log("Square payment link created:", response?.paymentLink?.url);
    return NextResponse.json({ url: response?.paymentLink?.url }, { status: 200 });
  } catch (error) {
    console.error("Create payment link error:", error);
    return NextResponse.json({ message: "Failed to create checkout link" }, { status: 500 });
  }
}
