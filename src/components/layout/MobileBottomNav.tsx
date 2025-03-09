"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/layout/navigation-menu";

const USER_ROLE_KEY = "hba_user_role";

export default function MobileBottomNav() {
  const [userRole, setUserRole] = useState<string>("business");
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const cachedRole = sessionStorage.getItem(USER_ROLE_KEY);
        if (cachedRole) {
          setUserRole(cachedRole);
          setIsLoading(false);
          return;
        }

        const timestamp = new Date().getTime();
        const response = await fetch(`${window.location.origin}/api/user?_t=${timestamp}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch role");

        const data = await response.json();
        setUserRole(data.role);

        sessionStorage.setItem(USER_ROLE_KEY, data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRole();
  }, []);

  const menuItems = useMemo(() => {
    const items: Record<string, { href: string; src: string; alt: string; width: number; height: number }[]> = {
      business: [
        { href: "/business", src: "/icons/Phone - Dashboard.png", alt: "Dashboard", width: 51, height: 43 },
        { href: "/business/inbox", src: "/icons/Phone - Inbox.png", alt: "Inbox", width: 30, height: 43 },
        { href: "/business/update", src: "/icons/Phone - Update.png", alt: "Update", width: 34, height: 43 },
        {
          href: "/business/application",
          src: "/icons/Phone - Application.png",
          alt: "Application",
          width: 52,
          height: 43,
        },
      ],
      admin: [
        { href: "/admin", src: "/icons/Phone - Dashboard.png", alt: "Dashboard", width: 51, height: 43 },
        { href: "/admin/analytics", src: "/icons/Phone - Analytics.png", alt: "Analytics", width: 41, height: 43 },
        { href: "/admin/requests", src: "/icons/Phone - Requests.png", alt: "Requests", width: 40, height: 43 },
        { href: "/admin/automations", src: "/icons/Phone - Automated.png", alt: "Automated", width: 50, height: 43 },
      ],
    };

    return items[userRole] || items.business;
  }, [userRole]);

  // Show loading state when data is being fetched
  if (isLoading) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 bg-[#D9D9D9] shadow-lg h-[92px] flex items-center justify-center">
        <NavigationMenu className="w-full !max-w-full flex mt-[11px]">
          <NavigationMenuList className="w-full flex justify-center items-center space-x-[45px]">
            {[1, 2, 3, 4].map((i) => (
              <NavigationMenuItem key={i} className="flex justify-center">
                <div className="flex flex-col items-center w-12 h-10">
                  <div className="w-8 h-8 bg-gray-400 rounded-md animate-pulse"></div>
                </div>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[#D9D9D9] shadow-lg h-[92px]">
      <NavigationMenu className="w-full !max-w-full flex mt-[11px]">
        <NavigationMenuList className="w-full flex justify-center items-center space-x-[45px]">
          {menuItems.map((item, index) => (
            <NavigationMenuItem key={index} className="flex justify-center">
              <NavigationMenuLink
                href={item.href}
                className={`flex flex-col items-center ${pathname === item.href ? "opacity-100" : "opacity-70"}`}
              >
                <Image src={item.src} alt={item.alt} width={item.width} height={item.height} />
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
