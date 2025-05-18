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
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-50">
        <DesktopSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 ml-[99px]">
        {" "}
        {/* Width matches collapsed sidebar width */}
        <DesktopHero title={title} />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DesktopLayout;
