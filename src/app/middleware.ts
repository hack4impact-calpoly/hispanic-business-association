import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema";

export default async function middleware(rec: NextRequest) {
  const userID: string | null = getAuth(rec).userId;

  if (!userID) {
    return NextResponse.redirect("/sign-in");
  }

  connectDB();

  const userObj = await User.findOne({ clerkUserId: userID });

  if (!userObj) {
    return NextResponse.redirect("/sign-in");
  }

  if (rec.nextUrl.pathname.startsWith("/admin") && userObj.role != "admin") {
    return NextResponse.redirect("/business");
  }

  return NextResponse.next();
}
