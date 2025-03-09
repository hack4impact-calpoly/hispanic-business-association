"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";
import React, { useState, useEffect, memo } from "react";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MemoizedDesktopLayout = memo(DesktopLayout);
const MemoizedMobileLayout = memo(MobileLayout);

export default function ResponsiveLayout({ children, title }: ResponsiveLayoutProps) {
  const isMobile = useIsMobile();
  const [renderLayout, setRenderLayout] = useState(false);

  useEffect(() => {
    const cachedLayoutType = sessionStorage.getItem("hba_layout_type");

    if (cachedLayoutType) {
      setRenderLayout(true);
    } else {
      const timeoutId = setTimeout(() => {
        setRenderLayout(true);
        sessionStorage.setItem("hba_layout_type", isMobile ? "mobile" : "desktop");
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [isMobile]);

  if (!renderLayout) {
    return <div className="h-screen w-screen bg-white"></div>;
  }

  if (isMobile) {
    return <MemoizedMobileLayout title={title}>{children}</MemoizedMobileLayout>;
  }

  return <MemoizedDesktopLayout title={title}>{children}</MemoizedDesktopLayout>;
}
