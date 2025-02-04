import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import "@/styles/global.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <SidebarProvider>
        <html lang="en">
          <body className="flex h-screen">
            <DesktopSidebar /> {/* Sidebar on the left */}
            <div className="flex-1 p-4 overflow-auto">
              <SignedOut>
                <SignInButton mode="modal" />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              {children}
            </div>
          </body>
        </html>
      </SidebarProvider>
    </ClerkProvider>
  );
}
