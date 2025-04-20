"use client";

import React from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useBusiness } from "@/lib/swrHooks";

interface DesktopHeroProps {
  title: string;
}

const DesktopHero = ({ title }: DesktopHeroProps) => {
  // Get user data and role
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string;

  // Only fetch business data if user is a business
  const { business } = useBusiness(userRole === "business" ? user?.id : null);

  // Default logo to use if no business logo is available
  const defaultLogo = "/logo/HBA_NoBack_NoWords.png";
  const profileLogo = userRole === "business" && business?.logoUrl ? business.logoUrl : defaultLogo;

  return (
    <div className="flex justify-between items-center py-4 px-6">
      {/* TITLE: Page heading with consistent styling */}
      <h1 className="font-futura font-medium text-[32px] leading-[42.5px] text-[#293241]">{title}</h1>

      <div className="flex items-center">
        {/* CONTROLS: Search and notification icons with consistent spacing */}
        <div className="flex items-center gap-[18px] mr-[23px]">
          <Image src="/icons/Search.png" alt="Search" width={25} height={25} className="cursor-pointer" />
          <Image src="/icons/Notification.png" alt="Notifications" width={25} height={25} className="cursor-pointer" />
        </div>

        {/* PROFILE: User avatar and dropdown trigger */}
        <div className="flex items-center gap-[10px]">
          <div className="w-[50px] h-[50px] rounded-full border border-[#00000036] flex items-center justify-center overflow-hidden">
            <Image
              src={profileLogo}
              alt="Profile"
              width={50}
              height={50}
              className="rounded-full object-cover"
              onError={(e) => {
                // Fallback to default on error
                const target = e.target as HTMLImageElement;
                target.src = defaultLogo;
              }}
            />
          </div>
          <Image src="/icons/Expand Arrow.png" alt="Expand" width={25} height={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default DesktopHero;
