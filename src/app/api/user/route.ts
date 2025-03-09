import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/database/userSchema";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await connectDB();

      let dbUser = await User.findOne({ clerkUserID: userId });

      if (!dbUser) {
        const newUser = new User({
          clerkUserID: userId,
          email: "user@example.com",
          name: "User",
          phone: 0,
          role: "business",
        });

        try {
          dbUser = await newUser.save();
        } catch (saveError) {
          return NextResponse.json({
            clerkUserID: userId,
            email: "user@example.com",
            name: "User",
            phone: 0,
            role: "business",
          });
        }
      }

      return NextResponse.json(dbUser);
    } catch (dbError) {
      return NextResponse.json({
        clerkUserID: userId,
        email: "user@example.com",
        name: "User",
        phone: 0,
        role: "business",
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch user data",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
