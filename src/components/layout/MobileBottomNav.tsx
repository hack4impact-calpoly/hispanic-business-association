import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/layout/navigation-menu";

export default function Navbar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[#D9D9D9] shadow-lg h-[92px]">
      <NavigationMenu className="w-full !max-w-full flex mt-[11px]">
        <NavigationMenuList className="w-full flex justify-center items-center space-x-[45px] ">
          <NavigationMenuItem className="flex justify-center">
            <NavigationMenuLink className="flex flex-col items-center">
              <Image src="/icons/Phone - Dashboard.png" alt="Dashboard" width={41} height={43} />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex justify-center">
            <NavigationMenuLink className="flex flex-col items-center">
              <Image src="/icons/Phone - Analytics.png" alt="Analytics" width={40} height={43} />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex justify-center">
            <NavigationMenuLink className="flex flex-col items-center">
              <Image src="/icons/Phone - Requests.png" alt="Requests" width={40} height={43} />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex justify-center">
            <NavigationMenuLink className="flex flex-col items-center">
              <Image src="/icons/Phone - Automated.png" alt="Automated" width={50} height={43} />
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
