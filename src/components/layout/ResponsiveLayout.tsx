"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function ResponsiveLayout({ children, title }: ResponsiveLayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout title={title}>{children}</MobileLayout>;
  }

  return <DesktopLayout title={title}>{children}</DesktopLayout>;
}
