"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAdminAddress, useBusiness } from "@/hooks/swrHooks";

interface MembershipExpirationAlertProps {
  // Months until expiration
  expiresInMonths?: number;
  // Handler for renewal click
  onRenewClick?: () => void;
  // Extra class names
  className?: string;
}

// Generate expiration message based on time values and expired state
const getExpirationMessage = (
  expiresInDays: number,
  expiresInWeeks: number,
  expiresInMonths: number,
  t: (key: string) => string,
): string => {
  if (Math.abs(expiresInDays) < 7) {
    if (expiresInDays < 0) {
      const days = Math.abs(expiresInDays);
      return `${t("membershipexpired")} ${days} ${t("day")}${days !== 1 ? "s" : ""} ${t("ago")}.`;
    } else {
      return `${t("membershipexpiration")} ${expiresInDays} ${t("day")}${expiresInDays !== 1 ? "s. " : ". "}`;
    }
  }

  if (expiresInWeeks < 0) {
    const weeks = Math.abs(expiresInWeeks);
    return `${t("membershipexpired")} ${weeks} ${t("week")}${weeks !== 1 ? "s" : ""} ${t("ago")}.`;
  }

  if (expiresInMonths < 0) {
    const months = Math.abs(expiresInMonths);
    return `${t("membershipexpired")} ${months} ${t("month")}${months !== 1 ? "s" : ""} ${t("ago")}.`;
  }

  if (expiresInWeeks > 0) {
    return `${t("membershipexpiration")} ${expiresInWeeks} ${t("week")}${expiresInWeeks !== 1 ? "s. " : ". "}`;
  }

  return `${t("membershipexpiration")} ${expiresInMonths} ${t("month")}${expiresInMonths !== 1 ? "s. " : ". "}`;
};

// Alert component shown when membership nears expiration
const MembershipExpirationAlert = ({ onRenewClick, className }: MembershipExpirationAlertProps) => {
  const t = useTranslations();
  const { adminAddress } = useAdminAddress();
  const { business } = useBusiness();
  const [expiresInMonths, setExpiresInMonths] = useState<number>(Infinity);
  const [expiresInWeeks, setExpiresInWeeks] = useState<number>(Infinity);
  const [expiresInDays, setExpiresInDays] = useState<number>(Infinity);
  useEffect(() => {
    // Calculate the difference in months between today and the expiration date
    const expiryDate = new Date(business?.membershipExpiryDate || new Date());
    const today = new Date();

    // Calculate the difference in months
    const monthsDifference =
      (expiryDate.getFullYear() - today.getFullYear()) * 12 + expiryDate.getMonth() - today.getMonth();

    const timeDiffInMillis = expiryDate.getTime() - today.getTime();
    const weeksDifference = Math.ceil(timeDiffInMillis / (1000 * 3600 * 24 * 7)); // Convert milliseconds to weeks
    const daysDifference = Math.ceil(timeDiffInMillis / (1000 * 3600 * 24)); // Convert milliseconds to days
    setExpiresInDays(daysDifference);
    setExpiresInWeeks(weeksDifference);
    setExpiresInMonths(monthsDifference);
  }, [business?.membershipExpiryDate]);
  // CONDITIONAL: Skip rendering for expiration > 1 month
  if (expiresInDays > 30) {
    return null;
  }

  const handleRenewClick = async () => {
    try {
      // Make your API call (Example with fetch)

      const membershipFeeType = business?.organizationType;
      var amt;
      if (membershipFeeType === "Community") {
        amt = process.env.NEXT_PUBLIC_COMMUNITY_MEMBERSHIP_FEE;
      } else if (membershipFeeType === "Business") {
        amt = process.env.NEXT_PUBLIC_BUSINESS_MEMBERSHIP_FEE;
      } else {
        amt = process.env.NEXT_PUBLIC_NON_PROFIT_MEMBERSHIP_FEE;
      }
      const response = await fetch("/api/square/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 123, // Example userId
          amount: amt,
          title: "Membership Fee",
        }), // Send relevant data
      });

      if (!response.ok) {
        throw new Error(t("failRenew")); // "Failed to renew membership"
      }

      const data = await response.json();
      if (data.url) {
        window.open(data.url, "_blank");
        // listen to webhooks
      } else {
      }
    } catch (err) {
      console.error("API call failed:", err);
      throw err; // Let the component show the error message
    }
  };

  return (
    <div
      className={cn(
        "flex items-center px-5 py-3 w-full text-sm font-medium text-red-400 rounded-2xl bg-red-400 bg-opacity-30",
        className,
      )}
    >
      {/* ICON: Warning/alert indicator displayed at left */}
      <div className="flex-shrink-0 mr-3">
        <Image
          src="/icons/General_Icons/Box Important.png"
          alt="Alert icon"
          width={25}
          height={25}
          className="object-contain"
        />
      </div>

      {/* MESSAGE: Expiration notification with renewal call-to-action */}
      <p className="flex-grow">
        {getExpirationMessage(expiresInDays, expiresInWeeks, expiresInMonths, t)}
        {
          <button onClick={handleRenewClick} className="underline cursor-pointer focus:outline-none">
            {t("Renew here with Square (Recommended)")}
          </button>
        }
        <br />
        {t("Or send a check to:")}
        <br />
        {adminAddress?.address.street}, {adminAddress?.address.city}, {adminAddress?.address.state}{" "}
        {adminAddress?.address.zip}
      </p>
    </div>
  );
};

export default MembershipExpirationAlert;
