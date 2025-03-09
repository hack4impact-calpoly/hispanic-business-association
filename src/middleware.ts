import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema";

const isStaticBuild = process.env.NEXT_PHASE === "phase-production-build";

export default async function middleware(req: NextRequest) {
  if (isStaticBuild) {
    return NextResponse.next();
  }

  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    await connectDB();

    const userObj = await User.findOne({ clerkUserId: userId });

    if (!userObj) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/admin") && userObj.role !== "admin") {
      return NextResponse.redirect(new URL("/business", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
