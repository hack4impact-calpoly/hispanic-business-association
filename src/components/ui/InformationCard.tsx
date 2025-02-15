"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface BusinessInfo {
  businessName: string;
  logo?: string;
}

interface InformationCardProps {
  type: "old" | "new";
  businessInfo: BusinessInfo;
}

const InformationCard = ({ type, businessInfo }: InformationCardProps) => {
  return (
    <Card className="w-[550px] h-[600px] rounded-[8px] border border-[#8C8C8C] bg-white relative">
      <h2 className="absolute left-[21.23px] top-[39.05px] font-futura font-bold text-[16px] leading-[21.26px] text-[#293241] w-[302px] h-[43px]">
        {type === "old" ? "OLD INFORMATION" : "NEW INFORMATION"}
      </h2>

      <div className="absolute left-[23px] top-[70px] h-[1px] bg-[#BEBEBE] w-[508.55px] rotate-[-0.03deg]" />

      <p className="absolute left-[21px] top-[96px] font-futura font-bold text-[12px] leading-[15.95px] text-[#8C8C8C] w-[154px] h-[16px]">
        Business Name
      </p>

      <p className="absolute left-[21px] top-[123px] font-futura font-bold text-[14px] leading-[18.61px] text-[#405BA9] w-[221px] h-[67px]">
        {businessInfo.businessName}
      </p>

      <p className="absolute left-[309px] top-[96px] font-futura font-bold text-[12px] leading-[15.95px] text-[#8C8C8C] w-[154px] h-[16px]">
        Logo
      </p>

      <div className="absolute left-[309px] top-[125px] w-[137px] h-[131px] bg-gray-100">
        {businessInfo.logo ? (
          <Image src={businessInfo.logo} alt="Business Logo" width={137} height={131} className="object-cover" />
        ) : (
          <Image
            src="/logo/HBA_NoBack_NoWords.png"
            alt="Default Logo"
            width={137}
            height={131}
            className="object-cover"
          />
        )}
      </div>
    </Card>
  );
};

export default InformationCard;
