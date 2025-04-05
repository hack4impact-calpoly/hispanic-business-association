import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import "@/styles/global.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Pass publishable key from environment variables to ClerkProvider
    // Required for authentication initialization during SSR and client-side rendering
    // Fix for "Missing publishableKey" error in build process
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
