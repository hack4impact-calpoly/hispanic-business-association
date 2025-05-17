"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { LocaleContext } from "@/app/Providers";

interface MobileHeroProps {
  title: string;
}

const MobileHero = ({ title }: MobileHeroProps) => {
  const { locale, setLocale } = useContext(LocaleContext);

  const handleSwitch = (newLocale: string) => {
    if (newLocale !== locale) {
      setLocale(newLocale);
    }
  };
  return (
    <div className="w-full pt-safe-top bg-white">
      <div className="h-[72px] px-[20px] flex justify-between items-center">
        <h1 className="font-futura font-medium text-[32px] leading-[17px] tracking-[-0.5px] text-[#293241]">{title}</h1>
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

        {/* <div className="flex items-center gap-4">
          <Image src="/icons/Search.png" alt="Search" width={20} height={20} className="cursor-pointer" />
          <Image src="/icons/Notification.png" alt="Notifications" width={20} height={20} className="cursor-pointer" />
          <div className="w-[40px] h-[40px] rounded-full border border-[#00000036] flex items-center justify-center overflow-hidden">
            <Image
              src="/logo/HBA_NoBack_NoWords.png"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default MobileHero;
