import React from "react";
import DesktopSidebar from "./DesktopSidebar";
import DesktopHero from "./DesktopHero";

interface DesktopLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DesktopLayout = ({ children, title }: DesktopLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="z-50 lg:w-[130px] pointer-events-auto">
        <DesktopSidebar />
      </div>
      <div className="flex-1">
        <DesktopHero title={title} />
        <main className="pt-8 mr-6">{children}</main>
      </div>
    </div>
  );
};

export default DesktopLayout;
