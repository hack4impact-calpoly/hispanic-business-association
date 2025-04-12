"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BusinessCardProps {
  id: string;
  businessName?: string;
  logoUrl?: string;
  logoAlt?: string;
  className?: string;
  linkPath?: string;
  onClick?: (id: string) => void;
}

export default function BusinessCard({
  id,
  businessName = "(Business Name)",
  logoUrl = "/logo/HBA_NoBack_NoWords.png",
  logoAlt = "Business Logo",
  className,
  linkPath = "", // If provided, card will be wrapped in a Link component
  onClick, // If provided, card will handle click events
}: BusinessCardProps) {
  const [imgError, setImgError] = useState(false);

  // Handle image loading errors by falling back to default logo
  const handleImageError = () => {
    setImgError(true);
  };

  // Handle card click
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(id);
    }
  };

  // Determine if card should be a link or a clickable div
  const isLink = !!linkPath && !onClick;

  // Card content (used for both link and div versions)
  const cardContent = (
    <article
      className={cn(
        "flex justify-between items-center gap-3 sm:gap-7 px-3 sm:px-6 py-5 sm:py-7 rounded-xl sm:rounded-3xl",
        "border-black border-solid border-[1px] sm:border-[1.34px] w-full max-w-full",
        "hover:shadow-md transition-shadow",
        onClick && "cursor-pointer",
        className,
      )}
      style={{ width: "100%", boxSizing: "border-box" }}
      onClick={handleClick}
    >
      <div className="relative shrink-0 h-[50px] w-[60px] sm:h-[65px] sm:w-[82px]">
        <Image
          src={imgError ? "/logo/HBA_NoBack_NoWords.png" : logoUrl}
          alt={logoAlt}
          fill
          className="object-contain"
          onError={handleImageError}
        />
      </div>
      <h2 className="flex-1 min-w-0 text-lg sm:text-xl font-bold text-black my-auto truncate pr-2">{businessName}</h2>
    </article>
  );

  // Return link version if linkPath is provided
  if (isLink) {
    return (
      <Link href={`${linkPath}/${id}`} className="block w-full max-w-full">
        {cardContent}
      </Link>
    );
  }

  // Return div version for onClick handling
  return <div className="block w-full max-w-full">{cardContent}</div>;
}
