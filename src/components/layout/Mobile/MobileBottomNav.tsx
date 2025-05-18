"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  const t = useTranslations();
  const { isLoaded, user } = useUser();

  if (!isLoaded) return null;

  const userRole = user?.publicMetadata?.role as string;

  const menuItems: Record<string, { href: string; src: string; alt: string }[]> = {
    business: [
      { href: "/business", src: "/icons/Phone - Dashboard.png", alt: t("dashboard") },
      { href: "/business", src: "/icons/Phone - Inbox.png", alt: t("inbox") },
      { href: "/business", src: "/icons/Phone - Update.png", alt: t("update") },
      { href: "/business", src: "/icons/Phone - Application.png", alt: t("app") },
    ],
    admin: [
      { href: "/admin", src: "/icons/Phone - Dashboard.png", alt: t("dashboard") },
      { href: "/admin/analytics", src: "/icons/Phone - Analytics.png", alt: t("analytics") },
      { href: "/admin/requests", src: "/icons/Phone - Requests.png", alt: t("reqs") },
      { href: "/admin/automations", src: "/icons/Phone - Automated.png", alt: t("automations") },
    ],
  };

  const currentMenu = menuItems[userRole] ?? [];

  if (!currentMenu.length) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[#D9D9D9] shadow-lg h-[72px] max-h-[72px] sm:h-[84px] overflow-x-hidden">
      <NavigationMenu className="w-full !max-w-full flex mt-[8px]">
        <NavigationMenuList className="w-full flex justify-evenly items-center">
          {currentMenu.map((item, index) => (
            <NavigationMenuItem key={index} className="w-1/4 flex justify-center">
              <NavigationMenuLink
                href={item.href}
                aria-label={item.alt}
                className="flex flex-col items-center w-full px-1"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={0}
                  height={0}
                  className="w-[6.5vw] h-[6.5vw] max-w-[28px] max-h-[28px] object-contain"
                />
                <span
                  className="mt-1 text-[min(3.3vw,13px)] text-center leading-tight break-words w-full transition-all duration-200"
                  style={{ lineHeight: "1.1" }}
                >
                  {item.alt}
                </span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
