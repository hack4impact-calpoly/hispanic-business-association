"use server";
import { NextRequest, NextResponse } from "next/server";
import { SquareClient, SquareEnvironment } from "square";
import { currentUser } from "@clerk/nextjs/server";

import crypto from "crypto";

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox, // Change to Production when ready
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  // if (req.method !== 'POST') {
  //   return NextResponse.json({ message: "Not allowed" }, { status: 405 });
  // }
  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json({ message: "Clerk ID is required" }, { status: 400 });
  }
  const clerkUserId = user.id;

  try {
    const body = await req.json();
    const { id, amount, title } = body;
    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: crypto.randomUUID(),
      quickPay: {
        name: title, // pass it in
        priceMoney: {
          amount: BigInt(amount), // Plain number (in cents), e.g. 1000 for $10.00
          currency: "USD",
        },
        locationId: process.env.SQUARE_LOCATION_ID || "",
      },
      paymentNote: clerkUserId,
      checkoutOptions: {
        acceptedPaymentMethods: {
          applePay: true,
          googlePay: true,
          cashAppPay: false,
        },
        askForShippingAddress: false,
        redirectUrl: "https://hispanic-business-association.vercel.app",
      },
    });
    return NextResponse.json({ url: response?.paymentLink?.url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to create checkout link" }, { status: 500 });
  }
}
