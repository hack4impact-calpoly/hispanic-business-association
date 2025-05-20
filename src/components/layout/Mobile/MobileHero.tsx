"use client";
import Image from "next/image";
import React, { useContext } from "react";
import { LocaleContext } from "@/app/Providers";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
interface MobileHeroProps {
  title: string;
}

const MobileHero = ({ title }: MobileHeroProps) => {
  const { locale, setLocale } = useContext(LocaleContext);
  const { signOut } = useAuth();
  const router = useRouter();
  const handleSwitch = (newLocale: string) => {
    if (newLocale !== locale) {
      setLocale(newLocale);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="w-full pt-safe-top bg-white">
      <div className="min-h-[64px] px-4 sm:px-6 flex justify-between items-center gap-2">
        <h1 className="font-futura font-medium text-[7vw] sm:text-[28px] leading-tight tracking-tight text-[#293241] max-w-[70%] break-words">
          {title}
        </h1>
        <div className="flex border border-gray-300 rounded-full overflow-hidden text-sm ml-auto">
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
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center p-2 ml-2 rounded-full border border-[#293241] bg-white hover:bg-[#293241] transition-colors group"
        >
          <Image
            src="/icons/DesktopSidebar/Logout.png"
            alt="Sign Out"
            width={30}
            height={30}
            className="
            filter
            invert
            group-hover:filter-none
            transition-filter"
          />
        </button>
      </div>
    </div>
  );
};

export default MobileHero;
