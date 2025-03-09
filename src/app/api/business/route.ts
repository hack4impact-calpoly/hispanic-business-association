import connectDB from "@/database/db";
import Business from "@/database/businessSchema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await connectDB();

      let business = await Business.findOne({ clerkUserID: userId });

      if (!business) {
        const dummyBusiness = {
          clerkUserID: userId,
          businessName: "Demo Business",
          businessType: "Technology",
          businessOwner: "Business Owner",
          website: "example.com",
          address: {
            street: "123 Main St",
            city: "San Luis Obispo",
            state: "CA",
            zip: 93401,
            county: "SLO County",
          },
          pointOfContact: {
            name: "Contact Person",
            phoneNumber: 1234567890,
            email: "example@example.com",
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
        } catch (saveError) {
          return NextResponse.json(dummyBusiness);
        }
      }

      return NextResponse.json(business);
    } catch (dbError) {
      return NextResponse.json({
        clerkUserID: userId,
        businessName: "Mock Business",
        businessType: "Demo",
        businessOwner: "Owner",
        website: "mockbusiness.com",
        address: {
          street: "123 Mock St",
          city: "Mock City",
          state: "CA",
          zip: 12345,
          county: "Mock County",
        },
        pointOfContact: {
          name: "Mock Person",
          phoneNumber: 1234567890,
          email: "mock@example.com",
        },
        socialMediaHandles: {
          IG: "@mockbusiness",
          twitter: "@mockbusiness",
          FB: "@mockbusiness",
        },
        description: "This is a mock business account created because the database connection failed.",
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch business data",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
