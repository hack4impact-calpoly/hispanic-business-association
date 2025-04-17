"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/layout/navigation-menu";

export default function Navbar() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return null;

  const userRole = user?.publicMetadata?.role as string;

  // DATA: Navigation item definitions - keyed by user role
  const menuItems: Record<string, { href: string; src: string; alt: string; width: number; height: number }[]> = {
    business: [
      { href: "/business", src: "/icons/Phone - Dashboard.png", alt: "Dashboard", width: 51, height: 43 },
      { href: "/business", src: "/icons/Phone - Inbox.png", alt: "Inbox", width: 30, height: 43 },
      { href: "/business", src: "/icons/Phone - Update.png", alt: "Update", width: 34, height: 43 },
      { href: "/business", src: "/icons/Phone - Application.png", alt: "Application", width: 52, height: 43 },
    ],
    admin: [
      { href: "/admin", src: "/icons/Phone - Dashboard.png", alt: "Dashboard", width: 51, height: 43 },
      { href: "/admin/analytics", src: "/icons/Phone - Analytics.png", alt: "Analytics", width: 41, height: 43 },
      { href: "/admin/requests", src: "/icons/Phone - Requests.png", alt: "Requests", width: 40, height: 43 },
      { href: "/admin/automations", src: "/icons/Phone - Automated.png", alt: "Automated", width: 50, height: 43 },
    ],
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[#D9D9D9] shadow-lg h-[92px] overflow-x-hidden">
      <NavigationMenu className="w-full !max-w-full flex mt-[11px]">
        <NavigationMenuList className="w-full flex justify-center items-center">
          {/* CONTAINER: Fixed width container ensures consistent spacing between items */}
          <div className="flex justify-between items-center w-[302px]">
            {userRole &&
              menuItems[userRole]?.map((item, index) => (
                <NavigationMenuItem key={index} className="flex justify-center">
                  <NavigationMenuLink href={item.href} className="flex flex-col items-center">
                    {/* IMAGE: Maintains original dimensions for proper display */}
                    <Image src={item.src} alt={item.alt} width={item.width} height={item.height} />
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
