import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import "@/styles/global.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
