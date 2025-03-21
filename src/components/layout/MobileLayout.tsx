import React from "react";
import MobileBottomNav from "./MobileBottomNav";
import MobileHero from "./MobileHero";

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MobileLayout = ({ children, title }: MobileLayoutProps) => {
  return (
    <div>
      <MobileHero title={title} />
      <main className="flex pt-4">{children}</main>
      <div className="h-[70px]">
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default MobileLayout;
