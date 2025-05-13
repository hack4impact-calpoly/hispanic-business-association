import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

const isPublicRoute = createRouteMatcher(["/", "/unauthorized", "/forgot-password", "/sign-up", "/api/clerkUser"]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isBusinessRoute = createRouteMatcher(["/business(.*)"]);

const intlMiddleware = createIntlMiddleware({ locales: ["en", "es"], defaultLocale: "en" });

export default clerkMiddleware(async (auth, req) => {
  // const { pathname } = req.nextUrl;
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Use `next-intl` middleware for locale handling
  // const intlResponse = intlMiddleware(req);
  // if (intlResponse) return intlResponse; // Let `next-intl` handle locale redirects

  // Public pages
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users
  if (!userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Role-based route protection
  if (isAdminRoute(req) && role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (isBusinessRoute(req) && role !== "business") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // If allowed
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
