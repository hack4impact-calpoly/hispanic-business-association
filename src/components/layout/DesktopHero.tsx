// src/components/layout/DesktopHero.tsx
"use client";

import React from "react";
import Image from "next/image";

interface DesktopHeroProps {
  title: string;
}

const DesktopHero = ({ title }: DesktopHeroProps) => {
  return (
    <div className="flex justify-between items-center mt-[18px]">
      <h1 className="font-futura font-medium text-[32px] leading-[42.5px] text-[#293241] h-[43px] mt-[7px]">{title}</h1>

      <div className="mr-[20px] flex items-center">
        <div className="flex items-center gap-[18px] mr-[23px]">
          <Image src="/icons/Search.png" alt="Search" width={25} height={25} className="cursor-pointer" />
          <Image src="/icons/Notification.png" alt="Notifications" width={25} height={25} className="cursor-pointer" />
        </div>

        <div className="flex items-center gap-[10px]">
          <div className="w-[50px] h-[50px] rounded-full border border-[#00000036] flex items-center justify-center overflow-hidden">
            <Image
              src="/logo/HBA_NoBack_NoWords.png"
              alt="Profile"
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
          </div>
          <Image src="/icons/Expand Arrow.png" alt="Expand" width={25} height={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default DesktopHero;
