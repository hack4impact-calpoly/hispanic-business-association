import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/global.css";

const isStaticBuild = process.env.NEXT_PHASE === "phase-production-build";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  if (isStaticBuild) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#405BA9",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
