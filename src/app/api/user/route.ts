import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/database/userSchema";
import { currentUser } from "@clerk/nextjs/server";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(req: NextRequest) {
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

    await connectDB();

    let dbUser = await User.findOne({ clerkUserID: user.id });

    if (!dbUser) {
      const newUser = new User({
        clerkUserID: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        phone: 0,
        role: "business",
      });

      try {
        dbUser = await newUser.save();
      } catch (saveError: any) {
        console.error("Error saving new user:", saveError.message);

        if (process.env.NODE_ENV === "development") {
          return NextResponse.json({
            clerkUserID: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
            phone: 0,
            role: "business",
          });
        }

        throw saveError;
      }
    }

    return NextResponse.json(dbUser);
  } catch (error: any) {
    console.error("Error in user endpoint:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch user data",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clerkUserID, email, name, phone, role } = body;

    if (!clerkUserID || !email || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const newUser = new User({
      clerkUserID,
      email,
      name,
      phone: phone || 0,
      role: role || "business",
    });

    await newUser.save();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);

    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
