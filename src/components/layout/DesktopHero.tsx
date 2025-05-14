"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useBusiness } from "@/lib/swrHooks";
import { LocaleContext } from "@/app/Providers"; // adjust path if needed

interface DesktopHeroProps {
  title: string;
}

const DesktopHero = ({ title }: DesktopHeroProps) => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string;
  const { business } = useBusiness(userRole === "business" ? user?.id : null);

  const defaultLogo = "/logo/HBA_NoBack_NoWords.png";
  const profileLogo = userRole === "business" && business?.logoUrl ? business.logoUrl : defaultLogo;

  const { locale, setLocale } = useContext(LocaleContext);

  const handleSwitch = (newLocale: string) => {
    if (newLocale !== locale) {
      setLocale(newLocale);
    }
  };

  return (
    <div className="flex justify-between items-center py-4 px-6">
      <h1 className="font-futura font-medium text-[32px] leading-[42.5px] text-[#293241]">{title}</h1>

      <div className="flex items-center">
        {/* LANGUAGE SWITCH */}
        <div className="flex border border-gray-300 rounded-full overflow-hidden text-sm mr-6">
          <button
            onClick={() => handleSwitch("en")}
            className={`px-3 py-1 ${
              locale === "en" ? "bg-gray-300 text-black font-semibold" : "bg-white text-gray-500"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => handleSwitch("es")}
            className={`px-3 py-1 ${
              locale === "es" ? "bg-gray-300 text-black font-semibold" : "bg-white text-gray-500"
            }`}
          >
            ES
          </button>
        </div>

        <div className="flex items-center gap-[18px] mr-[23px]">
          <Image src="/icons/Search.png" alt="Search" width={25} height={25} className="cursor-pointer" />
          <Image src="/icons/Notification.png" alt="Notifications" width={25} height={25} className="cursor-pointer" />
        </div>

        <div className="flex items-center gap-[10px]">
          <div className="w-[50px] h-[50px] rounded-full border border-[#00000036] flex items-center justify-center overflow-hidden">
            <Image
              src={profileLogo}
              alt="Profile"
              width={50}
              height={50}
              className="rounded-full object-cover"
              onError={(e) => {
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
