"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useTranslations } from "next-intl";

interface MembershipExpirationAlertProps {
  // Months until expiration
  expiresInMonths?: number;
  // Handler for renewal click
  onRenewClick?: () => void;
  // Extra class names
  className?: string;
}

// Alert component shown when membership nears expiration
const MembershipExpirationAlert = ({
  expiresInMonths = 1,
  onRenewClick,
  className,
}: MembershipExpirationAlertProps) => {
  const t = useTranslations();
  // CONDITIONAL: Skip rendering for expiration > 1 month
  if (expiresInMonths > 1) {
    return null;
  }

  const handleRenewClick = async () => {
    try {
      // Make your API call (Example with fetch)
      const response1 = await fetch(`/api/business/`);
      const data1 = await response1.json();
      const membershipFeeType = data1.membershipFeeType;
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
        await fetch(`/api/business/payment`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        });
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
        {t("membershipexpiration")} {expiresInMonths} {t("month")}
        {expiresInMonths !== 1 ? "s" : ""}.{" "}
        {
          <button onClick={handleRenewClick} className="underline cursor-pointer focus:outline-none">
            {t("renew")}
          </button>
        }
      </p>
    </div>
  );
};

export default MembershipExpirationAlert;
