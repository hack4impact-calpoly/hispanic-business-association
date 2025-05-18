"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import DesktopLayout from "./Desktop/DesktopLayout";
import MobileLayout from "./Mobile/MobileLayout";
import React, { useState, useEffect } from "react";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function ResponsiveLayout({ children, title }: ResponsiveLayoutProps) {
  const isMobile = useIsMobile();
  const [renderLayout, setRenderLayout] = useState(false); // Initially false

  useEffect(() => {
    // Delay the render slightly to avoid initial flicker
    const timeoutId = setTimeout(() => {
      setRenderLayout(true);
    }, 50); // Adjust the delay as needed

    return () => clearTimeout(timeoutId); // Cleanup timeout
  }, []); // Run only once on mount

  if (!renderLayout) {
    // Optionally, show a loading state or a blank screen
    return null; // Or <LoadingIndicator />;
  }

  if (isMobile) {
    return <MobileLayout title={title}>{children}</MobileLayout>;
  }
  return <DesktopLayout title={title}>{children}</DesktopLayout>;
}
