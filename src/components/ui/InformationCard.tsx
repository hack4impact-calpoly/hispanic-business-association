"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface BusinessInfo {
  businessName: string;
  businessType: string;
  businessOwner: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: number;
    county: string;
  };
  pointOfContact: {
    name: string;
    phoneNumber: number;
    email: string;
  };
  socialMediaHandles?: {
    IG?: string;
    twitter?: string;
    FB?: string;
  };
  description: string;

  logo?: string;
}

interface InformationCardProps {
  type: "old" | "new";
  businessInfo: BusinessInfo;
}

const InformationCard = ({ type, businessInfo }: InformationCardProps) => {
  return (
    <Card className="w-[690px] h-[700px] rounded-[8px] border border-[#8C8C8C] bg-white relative">
      <h2 className="absolute left-[21.23px] top-[39.05px] font-futura font-bold text-[16px] leading-[21.26px] text-[#293241] w-[302px] h-[43px]">
        {type === "old" ? "OLD INFORMATION" : "NEW INFORMATION"}
      </h2>

      <div className="absolute left-[23px] top-[70px] h-[1px] bg-[#BEBEBE] w-[508.55px] rotate-[-0.03deg]" />

      <div className="relative">
        {/* Business Name */}
        <p className="absolute left-[21px] top-[96px] font-futura font-bold text-[12px] leading-[15.95px] text-[#8C8C8C] w-[154px] h-[16px]">
          Business Name
        </p>
        <p className="absolute left-[21px] top-[120px] font-futura font-bold text-[14px] leading-[18.61px] text-[#405BA9] w-[221px] h-[67px]">
          {businessInfo.businessName || "N/A"}
        </p>

        {/* Business Type */}
        <p className="absolute left-[21px] top-[160px] font-futura font-bold text-[12px] leading-[15.95px] text-[#8C8C8C] w-[154px] h-[16px]">
          Business Type
        </p>
        <p className="absolute left-[21px] top-[184px] font-futura font-bold text-[14px] leading-[18.61px] text-[#405BA9] w-[221px] h-[67px]">
          {businessInfo.businessType || "N/A"}
        </p>

        {/* Business Owner */}
        <p className="absolute left-[21px] top-[224px] font-futura font-bold text-[12px] leading-[15.95px] text-[#8C8C8C] w-[154px] h-[16px]">
          Business Owner
        </p>
        <p className="absolute left-[21px] top-[248px] font-futura font-bold text-[14px] leading-[18.61px] text-[#405BA9] w-[221px] h-[67px]">
          {businessInfo.businessOwner || "N/A"}
        </p>

        {/* Website */}
        <p className="absolute left-[21px] top-[288px] font-futura font-bold text-[12px] leading-[15.95px] text-[#8C8C8C] w-[154px] h-[16px]">
          Email
        </p>
        <p className="absolute left-[21px] top-[312px] font-futura font-bold text-[14px] leading-[18.61px] text-[#405BA9] w-[221px] h-[67px]">
          <a href={businessInfo.website || "#"} target="_blank" rel="noopener noreferrer">
            {businessInfo.website || "N/A"}
          </a>
        </p>

        {/* Address */}
        <p className="absolute left-[21px] top-[352px] font-futura font-bold text-[12px] leading-[15.95px] text-[#8C8C8C] w-[154px] h-[16px]">
          Address
        </p>
        <p className="absolute left-[21px] top-[376px] font-futura font-bold text-[14px] leading-[18.61px] text-[#405BA9] w-[221px] h-[67px]">
          {`${businessInfo.address.street}, ${businessInfo.address.city}, ${businessInfo.address.state} ${businessInfo.address.zip}, ${businessInfo.address.county}`}
        </p>

        {/* Point of Contact */}
        <p className="absolute left-[21px] top-[426px] font-futura font-bold text-[12px] leading-[15.95px] text-[#8C8C8C] w-[154px] h-[16px]">
          Point of Contact
        </p>
        <p className="absolute left-[21px] top-[450px] font-futura font-bold text-[14px] leading-[18.61px] text-[#405BA9] w-[221px] h-[67px]">
          {`${businessInfo.pointOfContact.name}, ${businessInfo.pointOfContact.phoneNumber}, ${businessInfo.pointOfContact.email}`}
        </p>

        {/* Social Media Handles */}
        <p className="absolute left-[21px] top-[510px] font-futura font-bold text-[12px] leading-[15.95px] text-[#8C8C8C] w-[154px] h-[16px]">
          Social Media
        </p>
        <p className="absolute left-[21px] top-[534px] font-futura font-bold text-[14px] leading-[18.61px] text-[#405BA9] w-[221px] h-[67px]">
          {businessInfo.socialMediaHandles?.IG && <p>Instagram: {businessInfo.socialMediaHandles.IG}</p>}
          {businessInfo.socialMediaHandles?.twitter && <p>Twitter: {businessInfo.socialMediaHandles.twitter}</p>}
          {businessInfo.socialMediaHandles?.FB && <p>Facebook: {businessInfo.socialMediaHandles.FB}</p>}
        </p>

        {/* Description */}
        <p className="absolute left-[21px] top-[604px] font-futura font-bold text-[12px] leading-[15.95px] text-[#8C8C8C] w-[154px] h-[16px]">
          Description
        </p>
        <p className="absolute left-[21px] top-[628px] font-futura font-bold text-[14px] leading-[18.61px] text-[#405BA9] w-[221px] h-[67px]">
          {businessInfo.description || "N/A"}
        </p>
      </div>

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
