import connectDB from "@/database/db";
import Business from "@/database/businessSchema";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: NextRequest) {
  try {
    await delay(300);

    let user = await currentUser();
    let attempts = 0;

    while (!user && attempts < 3) {
      attempts++;
      const delayTime = 300 * attempts;
      await delay(delayTime);
      user = await currentUser();
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    try {
      await connectDB();

      let business = await Business.findOne({ clerkUserID: userId });

      if (!business) {
        const dummyBusiness = {
          clerkUserID: userId,
          businessName: "Demo Business",
          businessType: "Technology",
          businessOwner: user.firstName || "Owner",
          website: "example.com",
          address: {
            street: "123 Main St",
            city: "San Luis Obispo",
            state: "CA",
            zip: 93401,
            county: "SLO County",
          },
          pointOfContact: {
            name: user.firstName || "Contact Person",
            phoneNumber: 1234567890,
            email: user.emailAddresses[0]?.emailAddress || "example@example.com",
          },
          socialMediaHandles: {
            IG: "@demobusiness",
            twitter: "@demobusiness",
            FB: "@demobusiness",
          },
          description: "This is a demo business account for testing purposes.",
        };

        try {
          const newBusiness = new Business(dummyBusiness);
          business = await newBusiness.save();
        } catch (saveError: any) {
          if (process.env.NODE_ENV === "development") {
            console.error("Error saving demo business:", saveError.message);
          }
          return NextResponse.json(dummyBusiness);
        }
      }

      return NextResponse.json(business);
    } catch (dbError: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Database error:", dbError.message);
      }

      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({
          clerkUserID: userId,
          businessName: "Mock Business",
          businessType: "Demo",
          businessOwner: user.firstName || "Owner",
          website: "mockbusiness.com",
          address: {
            street: "123 Mock St",
            city: "Mock City",
            state: "CA",
            zip: 12345,
            county: "Mock County",
          },
          pointOfContact: {
            name: user.firstName || "Mock Person",
            phoneNumber: 1234567890,
            email: user.emailAddresses[0]?.emailAddress || "mock@example.com",
          },
          socialMediaHandles: {
            IG: "@mockbusiness",
            twitter: "@mockbusiness",
            FB: "@mockbusiness",
          },
          description: "This is a mock business account created because the database connection failed.",
        });
      }

      throw dbError;
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in business endpoint:", error);
    }
    return NextResponse.json(
      {
        error: "Failed to fetch business data",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
