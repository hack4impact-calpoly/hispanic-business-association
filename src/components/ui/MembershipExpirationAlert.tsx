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
      const response = await fetch("/api/square/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 123, // Example userId
          amount: 2500,
          title: "Membership Fee",
        }), // Send relevant data
      });

      if (!response.ok) {
        throw new Error(t("failRenew")); // "Failed to renew membership"
      }

      const data = await response.json();

      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        console.log(data.url);
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
        <Image src="/icons/Box Important.png" alt="Alert icon" width={25} height={25} className="object-contain" />
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
