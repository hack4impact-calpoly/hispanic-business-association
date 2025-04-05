"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BannerImageProps {
  // Source URL for banner image
  imageSrc?: string;
  // Alternative text for image
  altText?: string;
  // For testing: use solid color instead of image
  backgroundColor?: string;
  // Banner height
  height?: string;
  // Additional class names
  className?: string;
}

// Banner displayed beneath hero section
const BannerImage = ({
  imageSrc = "/logo/HBA_White_Back.png",
  altText = "Business banner",
  backgroundColor = "#293241",
  height = "173px",
  className,
}: BannerImageProps) => {
  // RENDER: If testing with solid color, show div with background
  if (backgroundColor) {
    return (
      <div className={cn("relative w-full", className)}>
        {/* CONTAINER: Fixed-height div with background color acting as banner */}
        <div
          className="w-full"
          style={{
            backgroundColor,
            height,
            aspectRatio: "6.94 / 1",
          }}
        />
      </div>
    );
  }

  // RENDER: Production version with actual image
  return (
    <div className={cn("relative w-full", className)}>
      {/* BANNER: Full-width decorative banner image with controlled aspect ratio */}
      <figure className="w-full">
        <Image
          src={imageSrc}
          alt={altText}
          width={1200}
          height={173} // Fixed height maintains aspect ratio of 6.94 (1200/173)
          className="object-cover w-full"
          style={{ height }}
          priority
        />
      </figure>
    </div>
  );
};

export default BannerImage;
