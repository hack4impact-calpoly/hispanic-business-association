"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type NavigationItem = {
  name: string;
  href: string;
  icon: string;
  current: boolean;
};

export default function DesktopSidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const navigation: NavigationItem[] = [
    {
      name: "Dashboard",
      href: "/business",
      icon: "/icons/Home.png",
      current: pathname === "/business",
    },
    {
      name: "Inbox",
      href: "/business/inbox",
      icon: "/icons/Check Inbox.png",
      current: pathname === "/business/inbox",
    },
    {
      name: "Update Information",
      href: "/business/update",
      icon: "/icons/Change.png",
      current: pathname === "/business/update",
    },
    {
      name: "Application",
      href: "/business/application",
      icon: "/icons/Application Form.png",
      current: pathname === "/business/application",
    },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0">
      <div
        className={cn(
          "flex flex-col h-screen transition-all duration-300",
          isExpanded ? "w-[359px]" : "w-[99px]",
          "bg-[#293241]",
        )}
      >
        {isExpanded && (
          <div className="absolute top-[23px] left-[10px]">
            <Image src="/logo/HBA_No_Back.png" alt="HBA Logo" width={129} height={68} className="w-[129px] h-[68px]" />
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "transition-all duration-300",
            isExpanded
              ? "w-[60px] h-[45px] mt-[25px] ml-[288px] bg-[#1F2530] rounded-[5px]"
              : "w-[30px] h-[30px] mt-[29px] ml-[35px]",
          )}
        >
          <Image src="/icons/Menu.png" alt="Menu" width={30} height={30} className="p-1 mx-auto" />
        </button>

        <div
          className={cn(
            "flex flex-col mt-[40px]",
            !isExpanded && "ml-[30px] space-y-[40px]",
            isExpanded && "ml-0 space-y-[30px]",
          )}
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center transition-all duration-300",
                isExpanded
                  ? "ml-[16px] w-[328px] h-[45px] rounded-[5px] pl-[18px]"
                  : "w-[30px] h-[30px] space-y-[100px]",
                isExpanded && item.name === "Dashboard" && "bg-[#3E495C]",
                isExpanded && item.name !== "Dashboard" && "bg-[#293241]",
                "hover:bg-[#1F2530]",
              )}
            >
              <Image src={item.icon} alt={item.name} width={30} height={30} className="shrink-0" />
              {isExpanded && (
                <span className="ml-[18px] text-white font-futura text-base font-medium leading-[21.25px]">
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div
          className={cn("mt-auto", isExpanded ? "bg-[#1F2530] h-[76px]" : "flex items-center justify-center h-[66px]")}
        >
          <div className={cn("flex", isExpanded ? "items-center pl-[12px] h-full" : "p-[18px]")}>
            <Image
              src="/logo/HBA_NoBack_NoWords.png"
              alt="Business Logo"
              width={62}
              height={57}
              className={cn("object-contain")}
            />
            {isExpanded && (
              <span className="ml-[18px] text-white font-futura text-base font-medium leading-[21.25px]">
                Business Name
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
