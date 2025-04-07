"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  className?: string;
}

const InformationCard = ({ type, businessInfo, className }: InformationCardProps) => {
  return (
    <Card
      className={cn(
        "w-full h-auto min-h-[600px] sm:min-h-[650px] md:min-h-[700px] rounded-[8px] border border-[#8C8C8C] bg-white relative",
        className,
      )}
    >
      <div className="p-4 sm:p-6">
        {/* Business Information Section */}
        <div className="relative">
          {/* Business Name */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">Business Name</p>
          <p className="font-futura font-bold text-[14px] leading-[19px] text-[#405BA9] w-full mb-4">
            {businessInfo.businessName || "N/A"}
          </p>

          {/* Business Type */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">Business Type</p>
          <p className="font-futura font-bold text-[14px] leading-[19px] text-[#405BA9] w-full mb-4">
            {businessInfo.businessType || "N/A"}
          </p>

          {/* Business Owner */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">Business Owner</p>
          <p className="font-futura font-bold text-[14px] leading-[19px] text-[#405BA9] w-full mb-4">
            {businessInfo.businessOwner || "N/A"}
          </p>

          {/* Website */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">Website</p>
          <p className="font-futura font-bold text-[14px] leading-[19px] text-[#405BA9] w-full mb-4 break-words">
            <a href={businessInfo.website || "#"} target="_blank" rel="noopener noreferrer">
              {businessInfo.website || "N/A"}
            </a>
          </p>

          {/* Address */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">Address</p>
          <p className="font-futura font-bold text-[14px] leading-[19px] text-[#405BA9] w-full mb-4">
            {`${businessInfo.address.street}, ${businessInfo.address.city}, ${businessInfo.address.state} ${businessInfo.address.zip}, ${businessInfo.address.county}`}
          </p>

          {/* Point of Contact */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">
            Point of Contact
          </p>
          <p className="font-futura font-bold text-[14px] leading-[19px] text-[#405BA9] w-full mb-4 break-words">
            {businessInfo.pointOfContact.name}
            <br />
            {businessInfo.pointOfContact.phoneNumber}
            <br />
            {businessInfo.pointOfContact.email}
          </p>

          {/* Social Media Handles */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">Social Media</p>
          <div className="font-futura font-bold text-[14px] leading-[19px] text-[#405BA9] w-full mb-4">
            {businessInfo.socialMediaHandles?.IG && <p>Instagram: {businessInfo.socialMediaHandles.IG}</p>}
            {businessInfo.socialMediaHandles?.twitter && <p>Twitter: {businessInfo.socialMediaHandles.twitter}</p>}
            {businessInfo.socialMediaHandles?.FB && <p>Facebook: {businessInfo.socialMediaHandles.FB}</p>}
          </div>

          {/* Description */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">Description</p>
          <p className="font-futura font-bold text-[14px] leading-[19px] text-[#405BA9] w-full mb-4">
            {businessInfo.description || "N/A"}
          </p>
        </div>

        {/* Logo Section - Positioned on the side on larger screens, below on mobile */}
        <div className="mt-6 w-full sm:absolute sm:top-[96px] sm:right-6 sm:w-[137px]">
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] mb-2">Logo</p>
          <div className="w-full h-[131px] sm:w-[137px] sm:h-[131px] bg-gray-100 flex items-center justify-center">
            {businessInfo.logo ? (
              <Image src={businessInfo.logo} alt="Business Logo" width={130} height={124} className="object-contain" />
            ) : (
              <Image
                src="/logo/HBA_NoBack_NoWords.png"
                alt="Default Logo"
                width={130}
                height={124}
                className="object-contain"
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InformationCard;
