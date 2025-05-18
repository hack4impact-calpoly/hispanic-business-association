"use client";

import React, { useContext } from "react";
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
      <div className="min-h-[64px] px-4 sm:px-6 flex justify-between items-center gap-2">
        <h1 className="font-futura font-medium text-[7vw] sm:text-[28px] leading-tight tracking-tight text-[#293241] max-w-[70%] break-words">
          {title}
        </h1>
        <div className="flex border border-gray-300 rounded-full overflow-hidden text-sm">
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
      </div>
    </div>
  );
};

export default MobileHero;
