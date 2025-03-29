"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BusinessProfileIconProps {
  // Business icon/logo image source
  src?: string;
  // Business name for alt tex
  businessName?: string;
  // Additional class names
  className?: string;
}

// Business profile icon that overlaps banner image
const BusinessProfileIcon = ({
  src = "/logo/HBA_NoBack_NoWords.png", // Default logo
  businessName = "Business",
  className,
}: BusinessProfileIconProps) => {
  return (
    <div
      className={cn(
        "absolute left-8 md:left-12 -bottom-[75px] z-10",
        "w-[150px] h-[150px] rounded-full border-4 border-white bg-white overflow-hidden shadow-md",
        className,
      )}
    >
      {/* ICON: Business profile image with negative positioning for banner overlap */}
      <Image src={src} alt={`${businessName} logo`} fill style={{ objectFit: "contain" }} className="p-2" />
    </div>
  );
};

export default BusinessProfileIcon;
