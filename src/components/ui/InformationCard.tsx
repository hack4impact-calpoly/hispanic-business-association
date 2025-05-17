"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

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
  logo?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

interface InformationCardProps {
  type: "old" | "new" | "signup";
  businessInfo: BusinessInfo;
  className?: string;
  // The other business info - needed to compare changes
  otherBusinessInfo?: BusinessInfo;
}

const InformationCard = ({ type, businessInfo, className, otherBusinessInfo }: InformationCardProps) => {
  const t = useTranslations();
  // Default image URLs for fallbacks
  const defaultLogo = "/logo/Default_Logo.jpg";
  const defaultBanner = "/logo/Default_Banner.png";

  // Helper function to check if a value has changed
  const isValueChanged = (current: any, other: any): boolean => {
    // If either value is undefined, we only care if they're different
    if (current === undefined || other === undefined) {
      return current !== other;
    }

    // For objects, compare as strings
    if (typeof current === "object" && typeof other === "object") {
      return JSON.stringify(current) !== JSON.stringify(other);
    }

    // For primitive values, direct comparison
    return current !== other;
  };

  // Check if logo or banner has changed
  const hasLogoChanged = isValueChanged(businessInfo.logoUrl, otherBusinessInfo?.logoUrl);
  const hasBannerChanged = isValueChanged(businessInfo.bannerUrl, otherBusinessInfo?.bannerUrl);

  // Format and style text based on if it has changed
  const formatFieldValue = (fieldValue: any, otherFieldValue: any, defaultText: string = "N/A") => {
    const hasChanged = isValueChanged(fieldValue, otherFieldValue);

    // Default class for normal text
    let displayClass = "font-futura font-bold text-[14px] leading-[19px] text-[#405BA9]";

    // Add highlighting for changed values
    if (hasChanged) {
      displayClass =
        type === "old"
          ? "font-futura font-bold text-[14px] leading-[19px] bg-red-100 text-red-800"
          : type === "new"
            ? "font-futura font-bold text-[14px] leading-[19px] bg-green-100 text-green-800"
            : "font-futura font-bold text-[14px] leading-[19px]";
    }

    return <p className={displayClass}>{fieldValue || defaultText}</p>;
  };

  // Format address with comparing changes
  const formatAddress = () => {
    if (!businessInfo.address && !otherBusinessInfo?.address) return t("notAvailable");

    const thisAddress = businessInfo.address || {};
    const otherAddress = otherBusinessInfo?.address || {};

    // Check if address as a whole has changed
    const hasAddressChanged = isValueChanged(thisAddress, otherAddress);

    if (!hasAddressChanged) {
      // No changes, regular styling
      return (
        <p className="font-futura font-bold text-[14px] leading-[19px] text-[#405BA9]">
          {businessInfo.address
            ? `${thisAddress.street || ""}, ${thisAddress.city || ""}, ${thisAddress.state || ""} ${thisAddress.zip || ""}, ${thisAddress.county || ""}`
            : t("notAvailable")}
        </p>
      );
    } else {
      // Address has changed - highlight all parts
      const displayClass =
        type === "old"
          ? "font-futura font-bold text-[14px] leading-[19px] bg-red-100 text-red-800"
          : type === "new"
            ? "font-futura font-bold text-[14px] leading-[19px] bg-green-100 text-green-800"
            : "font-futura font-bold text-[14px] leading-[19px]";

      return (
        <p className={displayClass}>
          {businessInfo.address
            ? `${thisAddress.street || ""}, ${thisAddress.city || ""}, ${thisAddress.state || ""} ${thisAddress.zip || ""}, ${thisAddress.county || ""}`
            : t("notAvailable")}
        </p>
      );
    }
  };

  // Format contact info with comparing changes
  const formatContact = () => {
    if (!businessInfo.pointOfContact && !otherBusinessInfo?.pointOfContact) return t("notAvailable");

    const thisContact = businessInfo.pointOfContact || {};
    const otherContact = otherBusinessInfo?.pointOfContact || {};

    // Check if contact as a whole has changed
    const hasContactChanged = isValueChanged(thisContact, otherContact);

    if (!hasContactChanged) {
      // No changes, regular styling
      return (
        <p className="font-futura font-bold text-[14px] leading-[19px] text-[#405BA9] break-words">
          {businessInfo.pointOfContact ? (
            <>
              {thisContact.name || ""}
              <br />
              {thisContact.phoneNumber ? thisContact.phoneNumber.toString() : ""}
              <br />
              {thisContact.email || ""}
            </>
          ) : (
            t("notAvailable")
          )}
        </p>
      );
    } else {
      // Contact has changed - highlight all parts
      const displayClass =
        type === "old"
          ? "font-futura font-bold text-[14px] leading-[19px] bg-red-100 text-red-800"
          : type === "new"
            ? "font-futura font-bold text-[14px] leading-[19px] bg-green-100 text-green-800"
            : "font-futura font-bold text-[14px] leading-[19px]";

      return (
        <p className={displayClass}>
          {businessInfo.pointOfContact ? (
            <>
              {thisContact.name || ""}
              <br />
              {thisContact.phoneNumber ? thisContact.phoneNumber.toString() : ""}
              <br />
              {thisContact.email || ""}
            </>
          ) : (
            t("notAvailable")
          )}
        </p>
      );
    }
  };

  // Format social media with comparing changes
  const formatSocialMedia = () => {
    if (!businessInfo.socialMediaHandles && !otherBusinessInfo?.socialMediaHandles) {
      return <p className="font-futura font-bold text-[14px] leading-[19px] text-[#405BA9]">{t("noSocialHandles")}</p>;
    }

    const thisSocial = businessInfo.socialMediaHandles || {};
    const otherSocial = otherBusinessInfo?.socialMediaHandles || {};

    // Check which social media handles have changed
    const igChanged = isValueChanged(thisSocial.IG, otherSocial.IG);
    const twitterChanged = isValueChanged(thisSocial.twitter, otherSocial.twitter);
    const fbChanged = isValueChanged(thisSocial.FB, otherSocial.FB);

    return (
      <div>
        {thisSocial.IG && (
          <p
            className={cn(
              "font-futura font-bold text-[14px] leading-[19px]",
              igChanged
                ? type === "old"
                  ? "font-futura font-bold text-[14px] leading-[19px] bg-red-100 text-red-800"
                  : type === "new"
                    ? "font-futura font-bold text-[14px] leading-[19px] bg-green-100 text-green-800"
                    : "font-futura font-bold text-[14px] leading-[19px]"
                : "text-[#405BA9]",
            )}
          >
            Instagram: {thisSocial.IG}
          </p>
        )}

        {thisSocial.twitter && (
          <p
            className={cn(
              "font-futura font-bold text-[14px] leading-[19px]",
              twitterChanged
                ? type === "old"
                  ? "font-futura font-bold text-[14px] leading-[19px] bg-red-100 text-red-800"
                  : type === "new"
                    ? "font-futura font-bold text-[14px] leading-[19px] bg-green-100 text-green-800"
                    : "font-futura font-bold text-[14px] leading-[19px]"
                : "text-[#405BA9]",
            )}
          >
            Twitter: {thisSocial.twitter}
          </p>
        )}

        {thisSocial.FB && (
          <p
            className={cn(
              "font-futura font-bold text-[14px] leading-[19px]",
              fbChanged
                ? type === "old"
                  ? "font-futura font-bold text-[14px] leading-[19px] bg-red-100 text-red-800"
                  : type === "new"
                    ? "font-futura font-bold text-[14px] leading-[19px] bg-green-100 text-green-800"
                    : "font-futura font-bold text-[14px] leading-[19px]"
                : "text-[#405BA9]",
            )}
          >
            Facebook: {thisSocial.FB}
          </p>
        )}

        {!thisSocial.IG && !thisSocial.twitter && !thisSocial.FB && (
          <p className="font-futura font-bold text-[14px] leading-[19px] text-[#405BA9]">{t("noSocialHandles")}</p>
        )}
      </div>
    );
  };

  // Function to determine if line has been modified
  const isLineChanged = (lineIndex: number, oldLines: string[], newLines: string[]) => {
    // Check if the line exists in both versions and is different
    return lineIndex < oldLines.length && lineIndex < newLines.length && oldLines[lineIndex] !== newLines[lineIndex];
  };

  // Function to determine if line has been added
  const isLineAdded = (lineIndex: number, oldLines: string[], newLines: string[]) => {
    // Check if the line exists only in the new version
    return lineIndex >= oldLines.length && lineIndex < newLines.length;
  };

  // Function to determine if a line has been removed
  const isLineRemoved = (lineIndex: number, oldLines: string[], newLines: string[]) => {
    // Check if the line exists only in the old version
    return lineIndex < oldLines.length && lineIndex >= newLines.length;
  };

  // Format description with GitHub-style diff highlighting
  const formatDescription = () => {
    if (!businessInfo.description && !otherBusinessInfo?.description) return "Not available";

    const thisDescription = businessInfo.description || "";
    const otherDescription = otherBusinessInfo?.description || "";

    // Split descriptions into lines
    const thisLines = thisDescription.split("\n");
    const otherLines = otherDescription.split("\n");

    // Determine the maximum number of lines across both descriptions
    const maxLines = Math.max(thisLines.length, otherLines.length);

    // Create an array of rendered lines
    const renderedLines = [];

    for (let i = 0; i < maxLines; i++) {
      let lineClass = "text-[14px] leading-[19px] mb-1 font-futura font-bold";

      if (type === "old") {
        // For the old version, highlight removed or changed lines
        if (isLineChanged(i, thisLines, otherLines) || isLineRemoved(i, thisLines, otherLines)) {
          lineClass = "text-[14px] leading-[19px] mb-1 font-futura font-bold bg-red-100 text-red-800";
        }
      } else if (type === "new") {
        // For the new version, highlight added or changed lines
        if (isLineChanged(i, otherLines, thisLines) || isLineAdded(i, otherLines, thisLines)) {
          lineClass = "text-[14px] leading-[19px] mb-1 font-futura font-bold bg-green-100 text-green-800";
        } else {
          if (isLineChanged(i, otherLines, thisLines) || isLineAdded(i, otherLines, thisLines)) {
            lineClass = "text-[14px] leading-[19px] mb-1 font-futura font-bold";
          }
        }
      }

      // Only add the line if it exists in this version
      if (i < thisLines.length) {
        renderedLines.push(
          <div key={i} className={lineClass}>
            {thisLines[i] || "\u00A0"}
          </div>,
        );
      }
    }

    return <div className="whitespace-pre-line">{renderedLines.length > 0 ? renderedLines : t("notAvailable")}</div>;
  };

  return (
    <Card
      className={cn(
        "w-full h-auto min-h-[600px] sm:min-h-[650px] md:min-h-[700px] rounded-[8px] border border-[#8C8C8C] bg-white relative",
        className,
      )}
    >
      <div className="p-4 sm:p-6">
        {/* Banner Image Section - New at top */}
        <div className="mb-4">
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">{t("banner")}</p>
          <div
            className={cn(
              "relative w-full h-[80px] rounded-md overflow-hidden p-1",
              hasBannerChanged ? (type === "old" ? "bg-red-100" : "bg-green-100") : "bg-white",
            )}
          >
            <div className="relative w-full h-full rounded-md overflow-hidden">
              <Image
                src={businessInfo.bannerUrl || defaultBanner}
                alt="Business Banner"
                fill
                style={{ objectFit: "cover" }}
                onError={(e) => {
                  // Fallback to default on error
                  const target = e.target as HTMLImageElement;
                  target.src = defaultBanner;
                }}
              />
            </div>
          </div>
        </div>

        {/* Logo Image Section - New at top */}
        <div className="mb-4">
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">{t("logo")}</p>
          <div
            className={cn(
              "relative w-[100px] h-[100px] rounded-full border-4 border-white overflow-hidden shadow-sm p-2",
              hasLogoChanged ? (type === "old" ? "bg-red-100" : "bg-green-100") : "bg-white",
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
                  // Fallback to default on error
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
          {formatFieldValue(businessInfo.businessName, otherBusinessInfo?.businessName)}

          {/* Business Type */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1 mt-4">
            {t("businesstype")}
          </p>
          {formatFieldValue(businessInfo.businessType, otherBusinessInfo?.businessType)}

          {/* Business Owner */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1 mt-4">
            {t("bizowner")}
          </p>
          {formatFieldValue(businessInfo.businessOwner, otherBusinessInfo?.businessOwner)}

          {/* Website */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1 mt-4">
            {t("website")}
          </p>
          <div className="mb-4">
            {businessInfo.website ? (
              <p
                className={cn(
                  "font-futura font-bold text-[14px] leading-[19px] break-words",
                  isValueChanged(businessInfo.website, otherBusinessInfo?.website)
                    ? type === "old"
                      ? "font-futura font-bold text-[14px] leading-[19px] bg-red-100 text-red-800"
                      : type === "new"
                        ? "font-futura font-bold text-[14px] leading-[19px] bg-green-100 text-green-800"
                        : "font-futura font-bold text-[14px] leading-[19px]"
                    : "text-[#405BA9]",
                )}
              >
                <a href={businessInfo.website} target="_blank" rel="noopener noreferrer">
                  {businessInfo.website}
                </a>
              </p>
            ) : (
              <p className="font-futura font-bold text-[14px] leading-[19px] text-[#405BA9]">N/A</p>
            )}
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

          {/* Description with GitHub-style highlighting */}
          <p className="font-futura font-bold text-[12px] leading-[16px] text-[#8C8C8C] w-full mb-1">{t("desc")}</p>
          <div className="w-full mb-4">{formatDescription()}</div>
        </div>
      </div>
    </Card>
  );
};

export default InformationCard;
