import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/global.css";

const DUMMY_PUBLISHABLE_KEY = "pk_test_dummy-key-for-ci-build";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    (process.env.NODE_ENV === "production" ? DUMMY_PUBLISHABLE_KEY : undefined);

  if (!publishableKey && process.env.NODE_ENV === "development") {
    console.warn(
      "Warning: No NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY provided. " +
        "Authentication features will not work properly in development mode.",
    );
  }

  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#405BA9",
        },
      }}
      publishableKey={publishableKey}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
