import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/global.css";
import Providers from "./Providers";

export const metadata = {
  title: "Hispanic Business Association",
  description: "Membership management portal for Hispanic Business Association",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // ClerkProvider at root for authentication
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body>
          {/* SWR Provider for data fetching - must be client component */}
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
