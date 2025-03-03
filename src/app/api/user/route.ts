import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import User from "@/database/userSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  await connectDB();
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ message: "User not logged in" }, { status: 401 });
  }
  const query = { clerkUserID: clerkUser.id };
  const dbUser = await User.findOne(query);
  if (!dbUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json(dbUser, { status: 200 });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { clerkUserID, email, name, phone, role } = await req.json();
    const user = await User.findOne({ email: email });

    if (user) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const new_user = new User({ clerkUserID, email, name, phone, role });
    await new_user.save();
    return NextResponse.json(new_user, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
