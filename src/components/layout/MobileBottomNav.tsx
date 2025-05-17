"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/layout/navigation-menu";

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

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[#D9D9D9] shadow-lg h-[92px] overflow-x-hidden">
      <NavigationMenu className="w-full !max-w-full flex mt-[11px]">
        <NavigationMenuList className="w-full flex justify-evenly items-center">
          {userRole &&
            menuItems[userRole]?.map((item, index) => (
              <NavigationMenuItem key={index} className="flex">
                <NavigationMenuLink href={item.href} className="flex flex-col items-center">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={44}
                    height={44}
                    className="w-[44px] h-[44px] object-contain"
                  />
                  <span className="text-xs mt-1">{item.alt}</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
