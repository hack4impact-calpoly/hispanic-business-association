"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useBusiness } from "@/lib/swrHooks";

type NavigationItem = {
  name: string;
  href: string;
  icon: string;
  current: boolean;
};

export default function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);

  const { isLoaded, user } = useUser();
  const shouldFetchBusiness = isLoaded && user?.publicMetadata?.role === "business";
  const clerkId = shouldFetchBusiness ? user?.id : null;
  const { business } = useBusiness(clerkId);
  const userRole = user?.publicMetadata?.role as string;

  // Default logo to use if no business logo is available
  const defaultLogo = "/logo/HBA_NoBack_NoWords.png";
  const businessLogo = shouldFetchBusiness && business?.logoUrl ? business.logoUrl : defaultLogo;

  if (!isLoaded) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const navigationItems: Record<string, NavigationItem[]> = {
    business: [
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
    ],
    admin: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: "/icons/Home.png",
        current: pathname === "/admin",
      },
      {
        name: "Analytics",
        href: "/admin/analytics",
        icon: "/icons/Analytics.png",
        current: pathname === "/admin/analytics",
      },
      {
        name: "Requests",
        href: "/admin/requests",
        icon: "/icons/Requests.png",
        current: pathname === "/admin/requests",
      },
      {
        name: "Automations",
        href: "/admin/automations",
        icon: "/icons/Automation.png",
        current: pathname === "/admin/automations",
      },
    ],
  };

  const navigation = navigationItems[userRole] || navigationItems.business;

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

        {/* Navigation items + Sign Out */}
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

          {/* Sign Out Button below the nav items */}
          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center transition-all duration-300 mt-[10px] text-white hover:bg-[#1F2530]",
              isExpanded
                ? "ml-[18px] w-[328px] h-[45px] pl-[18px] font-futura text-base font-medium"
                : "ml-[4px] mt-[40px]",
            )}
          >
            <Image src="/icons/Analytics.png" alt="Sign Out" width={30} height={30} className="shrink-0" />
            {isExpanded && <span className="ml-[18px]">Sign Out</span>}
          </button>
        </div>

        {/* Bottom logo bar */}
        <div
          className={cn(
            "mt-auto flex flex-col items-center justify-center",
            isExpanded ? "bg-[#1F2530] h-[100px]" : "h-[90px]",
          )}
        >
          <div className={cn("flex", isExpanded ? "items-center pl-[12px] h-[66px]" : "p-[18px]")}>
            <Image
              src={userRole === "business" ? businessLogo : defaultLogo}
              alt="Business Logo"
              width={62}
              height={57}
              className="object-contain"
              onError={(e) => {
                // Fallback to default on error
                const target = e.target as HTMLImageElement;
                target.src = defaultLogo;
              }}
            />
            {isExpanded && (
              <span className="ml-[18px] text-white font-futura text-base font-medium leading-[21.25px]">
                {userRole === "admin" ? "Hispanic Business Association" : (business?.businessName ?? "Business Name")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
