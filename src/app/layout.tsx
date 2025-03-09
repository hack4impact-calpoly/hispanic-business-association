import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/global.css";

const isStaticBuild = process.env.NEXT_PHASE === "phase-production-build";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#405BA9",
        },
      }}
      publishableKey={
        isStaticBuild ? "pk_test_Y2xlcmsuYmVzdC5wYXRoLTcxLmxjbC5kZXYk" : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      }
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
