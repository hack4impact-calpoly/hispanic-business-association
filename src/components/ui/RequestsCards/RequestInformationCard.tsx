"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/shadcnComponents/card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { IBusinessCore } from "@/database/types";

interface InformationCardProps {
  type: "old" | "new" | "signup";
  businessInfo: IBusinessCore;
  className?: string;
  otherBusinessInfo?: IBusinessCore;
}

const InformationCard = ({ type, businessInfo, className, otherBusinessInfo }: InformationCardProps) => {
  const t = useTranslations();
  const defaultLogo = "/logo/Default_Logo.jpg";
  const defaultBanner = "/logo/Default_Banner.png";

  const isChanged = (current: any, other: any): boolean => {
    if (current === undefined || current === null || other === undefined || other === null) {
      return current !== other;
    }
    if (typeof current === "object" && typeof other === "object") {
      const currentKeys = Object.keys(current);
      const otherKeys = Object.keys(other);

      for (const key of currentKeys) {
        if (!(key in other) || isChanged(current[key], other[key])) return true;
      }
      for (const key of otherKeys) {
        if (!(key in current)) return true;
      }
      return false;
    }
    return String(current) !== String(other);
  };

  const getHighlighterClass = (hasChanged: boolean): string => {
    if (!hasChanged) return "text-[#405BA9]";
    return type === "old" ? "bg-red-100 text-red-800" : type === "new" ? "!bg-green-100 !text-green-800" : "";
  };

  const formatField = (value: any, otherValue: any, defaultText: string = "N/A") => {
    const hasChanged = isChanged(value, otherValue);
    const displayClass = `font-futura font-bold text-[14px] leading-[19px] ${getHighlighterClass(hasChanged)}`;
    return <p className={displayClass}>{value || defaultText}</p>;
  };

  const formatAddress = (type: "physicalAddress" | "mailingAddress") => {
    const address = businessInfo[type];
    const otherAddress = otherBusinessInfo?.[type];
    const hasChanged = isChanged(address, otherAddress);
    const displayClass = `font-futura font-bold text-[14px] leading-[19px] ${getHighlighterClass(hasChanged)}`;
    return (
      <p className={displayClass}>
        {[address.street, address.city, address.state, address.zip].filter(Boolean).join(", ") || t("notAvailable")}
      </p>
    );
  };

  const formatContact = () => {
    const contact = businessInfo.pointOfContact;
    const otherContact = otherBusinessInfo?.pointOfContact;
    const hasChanged = isChanged(contact, otherContact);
    const displayClass = `font-futura font-bold text-[14px] leading-[19px] ${getHighlighterClass(hasChanged)}`;
    return (
      <p className={displayClass}>
        {contact.name || ""}
        <br />
        {contact.phoneNumber || ""}
        <br />
        {contact.email || ""}
      </p>
    );
  };

  const formatSocialMedia = () => {
    const social = businessInfo.socialMediaHandles || {};
    const otherSocial = otherBusinessInfo?.socialMediaHandles || {};
    const fields = ["IG", "twitter", "FB"];
    return (
      <div>
        {fields.map((key) => {
          const value = social[key as keyof typeof social];
          const other = otherSocial[key as keyof typeof otherSocial];
          const hasChanged = isChanged(value, other);
          const displayClass = `font-futura font-bold text-[14px] leading-[19px] ${getHighlighterClass(hasChanged)}`;
          return (
            <p key={key} className={displayClass}>
              {`${key}: ${value || "N/A"}`}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <Card className={cn("w-full rounded-[8px] border border-[#8C8C8C] bg-white relative", className)}>
      <div className="p-4 sm:p-6">
        {/* Banner */}
        <div className="mb-4">
          <Image
            src={businessInfo.bannerUrl || defaultBanner}
            alt="Banner"
            width={500}
            height={80}
            className={cn(
              "w-full h-[80px] object-cover rounded",
              isChanged(businessInfo.bannerUrl, otherBusinessInfo?.bannerUrl) && type === "old" ? "bg-red-100" : "",
            )}
          />
        </div>

        {/* Logo */}
        <div className="mb-4">
          <Image
            src={businessInfo.logoUrl || defaultLogo}
            alt="Logo"
            width={100}
            height={100}
            className={cn(
              "rounded-full",
              isChanged(businessInfo.logoUrl, otherBusinessInfo?.logoUrl) && type === "old" ? "bg-red-100" : "",
            )}
          />
        </div>

        {/* Fields */}
        <div className="space-y-3">
          {[
            ["businessName", t("businessName")],
            ["businessType", t("businessType")],
            ["organizationType", t("organizationType")],
            ["businessScale", t("businessScale")],
            ["numberOfEmployees", t("numberOfEmployees")],
            ["gender", t("gender")],
            ["businessOwner", t("bizowner")],
            ["website", t("website")],
            ["description", t("desc")],
          ].map(([key, label]) => (
            <div key={key as string}>
              <p className="text-[12px] text-[#8C8C8C]">{label}</p>
              {formatField((businessInfo as any)[key], (otherBusinessInfo as any)?.[key])}
            </div>
          ))}

          {/* Addresses */}
          <div>
            <p className="text-[12px] text-[#8C8C8C]">{t("physAdd")}</p>
            {formatAddress("physicalAddress")}
          </div>
          <div>
            <p className="text-[12px] text-[#8C8C8C]">{t("mailAdd")}</p>
            {formatAddress("mailingAddress")}
          </div>

          {/* Contact */}
          <div>
            <p className="text-[12px] text-[#8C8C8C]">{t("pointOfContact")}</p>
            {formatContact()}
          </div>

          {/* Social Media */}
          <div>
            <p className="text-[12px] text-[#8C8C8C]">{t("socialMedia")}</p>
            {formatSocialMedia()}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InformationCard;
