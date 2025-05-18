"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// Define business info structure
interface BusinessInfo {
  businessName?: string;
  businessType?: string;
  businessOwner?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: number | string;
    county?: string;
  };
  pointOfContact?: {
    name?: string;
    phoneNumber?: number | string;
    email?: string;
  };
  socialMediaHandles?: {
    IG?: string;
    twitter?: string;
    FB?: string;
  };
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

interface InformationCardProps {
  type: "old" | "new" | "signup";
  businessInfo: BusinessInfo;
  className?: string;
  otherBusinessInfo?: BusinessInfo;
}

const InformationCard = ({ type, businessInfo, className, otherBusinessInfo }: InformationCardProps) => {
  const t = useTranslations();

  // Define default image URLs
  const defaultLogo = "/logo/Default_Logo.jpg";
  const defaultBanner = "/logo/Default_Banner.png";

  // Determine if a field has changed
  const isChanged = (current: any, other: any): boolean => {
    // Handle undefined or null values
    if (current === undefined || current === null || other === undefined || other === null) {
      return current !== other;
    }

    // Handle objects (address and contact info)
    if (typeof current === "object" && typeof other === "object") {
      const currentKeys = Object.keys(current);
      const otherKeys = Object.keys(other);

      // Different number of keys means objects are different
      if (currentKeys.length !== otherKeys.length) return true;

      // Check if any key exists in only one object or has different values
      for (const key of currentKeys) {
        if (!(key in other) || isChanged(current[key], other[key])) {
          return true;
        }
      }

      // Check for keys in other that aren't in current
      for (const key of otherKeys) {
        if (!(key in current)) return true;
      }

      return false;
    }

    // Convert to strings for comparison to handle various types consistently
    return String(current) !== String(other);
  };

  // Get highlighter class based on type and change status
  const getHighlighterClass = (hasChanged: boolean): string => {
    if (!hasChanged) return "text-[#405BA9]";
    return type === "old" ? "bg-red-100 text-red-800" : type === "new" ? "!bg-green-100 !text-green-800" : "";
  };

  // Format text field with highlighting
  const formatField = (value: any, otherValue: any, defaultText: string = "N/A") => {
    const hasChanged = isChanged(value, otherValue);
    const displayClass = `font-futura font-bold text-[14px] leading-[19px] ${getHighlighterClass(hasChanged)}`;

    let finalDisplayValue;
    if (value === undefined || value === null || value === "") {
      finalDisplayValue = defaultText;
    } else if (typeof value === "string" && value.trim() === "") {
      // If value is a string that's all whitespace (but not empty string already caught), render &nbsp;
      finalDisplayValue = "\u00A0";
    } else {
      finalDisplayValue = value;
    }

    return <p className={displayClass}>{finalDisplayValue}</p>;
  };

  // Format address field with highlighting
  const formatAddress = () => {
    const address = businessInfo.address || {};
    const otherAddress = otherBusinessInfo?.address || {};
    const hasChanged = isChanged(address, otherAddress);
    const displayClass = `font-futura font-bold text-[14px] leading-[19px] ${getHighlighterClass(hasChanged)}`;

    if (!businessInfo.address) return <p className={displayClass}>{t("notAvailable")}</p>;

    return (
      <p className={displayClass}>
        {`${address.street || ""}, ${address.city || ""}, ${address.state || ""} ${address.zip || ""}, ${address.county || ""}`}
      </p>
    );
  };

  // Format contact information with highlighting
  const formatContact = () => {
    const contact = businessInfo.pointOfContact || {};
    const otherContact = otherBusinessInfo?.pointOfContact || {};
    const hasChanged = isChanged(contact, otherContact);
    const displayClass = `font-futura font-bold text-[14px] leading-[19px] break-words ${getHighlighterClass(hasChanged)}`;

    if (!businessInfo.pointOfContact) return <p className={displayClass}>{t("notAvailable")}</p>;

    return (
      <p className={displayClass}>
        {contact.name || ""}
        <br />
        {contact.phoneNumber ? contact.phoneNumber.toString() : ""}
        <br />
        {contact.email || ""}
      </p>
    );
  };

  // Format social media with highlighting
  const formatSocialMedia = () => {
    const social = businessInfo.socialMediaHandles || {};
    const otherSocial = otherBusinessInfo?.socialMediaHandles || {};

    // Check if no social media handles are available
    if (!social.IG && !social.twitter && !social.FB) {
      // Check if this "no handles" state is different from other
      const hasAllHandlesChanged = isChanged(businessInfo.socialMediaHandles, otherBusinessInfo?.socialMediaHandles);
      const noHandlesClass = `font-futura font-bold text-[14px] leading-[19px] ${getHighlighterClass(hasAllHandlesChanged)}`;
      return <p className={noHandlesClass}>{t("noSocialHandles")}</p>;
    }

    return (
      <div>
        {social.IG !== undefined && (
          <p
            className={`font-futura font-bold text-[14px] leading-[19px] ${getHighlighterClass(isChanged(social.IG, otherSocial.IG))}`}
          >
            Instagram:{" "}
            {social.IG === "" || (typeof social.IG === "string" && social.IG.trim() === "") ? "\u00A0" : social.IG}
          </p>
        )}
        {social.twitter !== undefined && (
          <p
            className={`font-futura font-bold text-[14px] leading-[19px] ${getHighlighterClass(isChanged(social.twitter, otherSocial.twitter))}`}
          >
            Twitter:{" "}
            {social.twitter === "" || (typeof social.twitter === "string" && social.twitter.trim() === "")
              ? "\u00A0"
              : social.twitter}
          </p>
        )}
        {social.FB !== undefined && (
          <p
            className={`font-futura font-bold text-[14px] leading-[19px] ${getHighlighterClass(isChanged(social.FB, otherSocial.FB))}`}
          >
            Facebook:{" "}
            {social.FB === "" || (typeof social.FB === "string" && social.FB.trim() === "") ? "\u00A0" : social.FB}
          </p>
        )}
      </div>
    );
  };

  // Format description with highlighting each line
  const formatDescription = () => {
    const thisDescription = businessInfo.description;
    const otherDescription = otherBusinessInfo?.description;

    // Handle empty description case (both fields null/undefined/empty)
    if ((!thisDescription || thisDescription === "") && (!otherDescription || otherDescription === "")) {
      const hasChanged = isChanged(thisDescription, otherDescription);
      const emptyClass = `font-futura font-bold text-[14px] leading-[19px] ${getHighlighterClass(hasChanged)}`;
      return <div className={emptyClass}>{t("notAvailable")}</div>;
    }

    // Handle case where this description is empty but other is not (or vice versa)
    if (!thisDescription || thisDescription === "") {
      const hasChanged = isChanged(thisDescription, otherDescription);
      const emptyClass = `font-futura font-bold text-[14px] leading-[19px] ${getHighlighterClass(hasChanged)}`;
      return <div className={emptyClass}>N/A</div>;
    }

    // Normal line-by-line comparison
    const thisLines = thisDescription.split("\n");
    const otherLines = otherDescription ? otherDescription.split("\n") : [];

    const renderedLines = [];

    for (let i = 0; i < thisLines.length; i++) {
      const currentLine = thisLines[i];
      const otherLine = i < otherLines.length ? otherLines[i] : undefined;

      const hasChanged = isChanged(currentLine, otherLine);
      const lineClass = `text-[14px] leading-[19px] mb-1 font-futura font-bold ${getHighlighterClass(hasChanged)}`;

      // Handle empty/whitespace-only lines
      let displayValue;
      if (currentLine === "") {
        displayValue = "\u00A0"; // Non-breaking space for empty lines
      } else if (typeof currentLine === "string" && currentLine.trim() === "") {
        displayValue = "\u00A0"; // Non-breaking space for whitespace-only lines
      } else {
        displayValue = currentLine;
      }

      renderedLines.push(
        <div key={i} className={lineClass}>
          {displayValue}
        </div>,
      );
    }

    return <div className="whitespace-pre-line">{renderedLines}</div>;
  };

  // Check if logo or banner has changed
  const logoChanged = isChanged(businessInfo.logoUrl, otherBusinessInfo?.logoUrl);
  const bannerChanged = isChanged(businessInfo.bannerUrl, otherBusinessInfo?.bannerUrl);

  return (
    <Card
      className={cn(
        "w-full h-auto min-h-[600px] sm:min-h-[650px] md:min-h-[700px] rounded-[8px] border border-[#8C8C8C] bg-white relative",
        className,
      )}
    >
      <div className="p-4 sm:p-6">
        {/* Banner Image Section */}
        <div className="mb-4">
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">{t("banner")}</p>
          <div
            className={cn(
              "relative w-full h-[80px] rounded-md overflow-hidden p-1",
              bannerChanged ? (type === "old" ? "bg-red-100" : "bg-green-100") : "bg-white",
            )}
          >
            <div className="relative w-full h-full rounded-md overflow-hidden">
              <Image
                src={businessInfo.bannerUrl || defaultBanner}
                alt="Business Banner"
                fill
                style={{ objectFit: "cover" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultBanner;
                }}
              />
            </div>
          </div>
        </div>

        {/* Logo Image Section */}
        <div className="mb-4">
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">{t("logo")}</p>
          <div
            className={cn(
              "relative w-[100px] h-[100px] rounded-full border-4 border-white overflow-hidden shadow-sm p-2",
              logoChanged ? (type === "old" ? "bg-red-100" : "bg-green-100") : "bg-white",
            )}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src={businessInfo.logoUrl || defaultLogo}
                alt="Business Logo"
                fill
                style={{ objectFit: "contain" }}
                className="p-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultLogo;
                }}
              />
            </div>
          </div>
        </div>

        {/* Business Information Section */}
        <div className="relative">
          {/* Business Name */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">
            {t("businessName")}
          </p>
          {formatField(businessInfo.businessName, otherBusinessInfo?.businessName)}

          {/* Business Type */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1 mt-4">
            {t("businessType")}
          </p>
          {formatField(businessInfo.businessType, otherBusinessInfo?.businessType)}

          {/* Business Owner */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1 mt-4">
            {t("bizowner")}
          </p>
          <div className="mb-4">{formatField(businessInfo.businessOwner, otherBusinessInfo?.businessOwner)}</div>

          {/* Website */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1 mt-4">
            {t("website")}
          </p>
          <div className="mb-4">
            {(() => {
              const currentWebsite = businessInfo.website;
              const otherWebsite = otherBusinessInfo?.website;
              const websiteHasChanged = isChanged(currentWebsite, otherWebsite);
              const websiteClasses = `font-futura font-bold text-[14px] leading-[19px] break-words ${getHighlighterClass(websiteHasChanged)}`;

              if (currentWebsite) {
                return (
                  <p className={websiteClasses}>
                    <a href={currentWebsite} target="_blank" rel="noopener noreferrer">
                      {currentWebsite}
                    </a>
                  </p>
                );
              } else {
                return <p className={websiteClasses}>{t("notAvailable")}</p>;
              }
            })()}
          </div>

          {/* Address */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">{t("address")}</p>
          <div className="mb-4">{formatAddress()}</div>

          {/* Point of Contact */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">
            {t("pointOfContact")}
          </p>
          <div className="mb-4">{formatContact()}</div>

          {/* Social Media Handles */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">
            {t("socialMedia")}
          </p>
          <div className="mb-4">{formatSocialMedia()}</div>

          {/* Description */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">{t("desc")}</p>
          <div className="w-full mb-4">{formatDescription()}</div>
        </div>
      </div>
    </Card>
  );
};

export default InformationCard;
