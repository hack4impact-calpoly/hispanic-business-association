"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
  // CONDITIONAL: Skip rendering for expiration > 1 month
  if (expiresInMonths > 1) {
    return null;
  }

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
        Membership expires in {expiresInMonths} month{expiresInMonths !== 1 ? "s" : ""}.{" "}
        {onRenewClick ? (
          <button onClick={onRenewClick} className="underline cursor-pointer focus:outline-none">
            Renew here now.
          </button>
        ) : (
          <span className="underline cursor-pointer">Renew here now.</span>
        )}
      </p>
    </div>
  );
};

export default MembershipExpirationAlert;
