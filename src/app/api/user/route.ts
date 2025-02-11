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
