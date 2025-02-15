"use client";

import React from "react";
import Image from "next/image";

interface AdminHeaderProps {
  title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
  return (
    <div className="w-[1289px] h-[50px] mt-[9px] ml-[119px] flex justify-between items-center">
      <h1 className="font-futura font-medium text-[32px] leading-[42.5px] text-[#293241] h-[43px] mt-[7px]">{title}</h1>

      <div className="flex items-center">
        <div className="flex items-center gap-[18px] w-[68px] h-[25px] mt-[10px] mr-[23px]">
          <Image src="/icons/Search.png" alt="Search" width={25} height={25} className="cursor-pointer" />
          <Image src="/icons/Notification.png" alt="Notifications" width={25} height={25} className="cursor-pointer" />
        </div>

        <div className="flex items-center gap-[10px] w-[85px] h-[50px]">
          <div className="w-[50px] h-[50px] rounded-full border border-[#00000036] flex items-center justify-center">
            <Image src="/logo/HBA_NoBack_NoWords.png" alt="Profile" width={50} height={50} className="rounded-full" />
          </div>
          <Image src="/icons/Expand Arrow.png" alt="Expand" width={25} height={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
