"use client";

import { useIsMobile } from "@/app/hooks/use-mobile";
/* TODO: Uncomment when layouts are implemented
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";
*/

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const isMobile = useIsMobile();

  /* TODO: Uncomment when layouts are implemented
  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }
  return <DesktopLayout>{children}</DesktopLayout>;
  */

  // Temporary return until layouts are implemented
  return children;
}
