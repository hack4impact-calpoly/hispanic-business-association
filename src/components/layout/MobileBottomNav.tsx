"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/layout/navigation-menu";

export default function Navbar() {
  const [userRole, setUserRole] = useState<string>("admin");

  useEffect(() => {
    async function fetchUserRole(user: string) {
      // Simulate fetching user role (replace this with actual API call)
      return "business"; // Change to "admin" or "user" for testing
    }

    fetchUserRole("currentUser").then((role) => setUserRole(role));
  }, []);

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
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[#D9D9D9] shadow-lg h-[92px]">
      <NavigationMenu className="w-full !max-w-full flex mt-[11px]">
        <NavigationMenuList className="w-full flex justify-center items-center space-x-[45px] ">
          <NavigationMenuItem className="flex justify-center">
            <NavigationMenuLink className="flex flex-col items-center">
              <Link href="/admin">
                <Image src="/icons/Phone - Dashboard.png" alt="Dashboard" width={41} height={43} />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex justify-center">
            <NavigationMenuLink className="flex flex-col items-center">
              <Link href="/admin/analytics">
                <Image src="/icons/Phone - Analytics.png" alt="Analytics" width={40} height={43} />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex justify-center">
            <NavigationMenuLink className="flex flex-col items-center">
              <Link href="/admin/requests">
                <Image src="/icons/Phone - Requests.png" alt="Requests" width={40} height={43} />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex justify-center">
            <NavigationMenuLink className="flex flex-col items-center">
              <Link href="/admin/automations">
                <Image src="/icons/Phone - Automated.png" alt="Automated" width={50} height={43} />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
