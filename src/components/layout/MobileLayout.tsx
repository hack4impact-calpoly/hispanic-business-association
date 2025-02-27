import React from "react";
import MobileBottomNav from "./MobileBottomNav";
import MobileHero from "./MobileHero";

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MobileLayout = ({ children, title }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MobileHero title={title} />
      <main className="flex-1 px-4 pt-4 pb-[92px]">{children}</main>
      <MobileBottomNav />
    </div>
  );
};

export default MobileLayout;
