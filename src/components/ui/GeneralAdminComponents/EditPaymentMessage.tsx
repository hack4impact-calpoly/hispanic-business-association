"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useTranslations } from "next-intl";

interface MembershipExpirationAlertProps {
  dateType: string;
  // date of
  date: string;
  // Handler for renewal click
  onClick?: () => void;
  // Extra class names
  className?: string;
}

// Alert component shown when membership nears expiration
const EditPaymentMessage = ({
  // expiresInMonths = 1,
  dateType,
  date,
  onClick,
  className,
}: MembershipExpirationAlertProps) => {
  const t = useTranslations();

  const getWords = (type: string) => {
    if (type == "lastPay") {
      return t("lastPaid");
    }
    return t("expiryDate");
  };

  return (
    <div
      className={cn(
        "flex items-center px-5 py-3 w-full text-sm font-medium text-black-400 rounded-2xl bg-blue-400 bg-opacity-30",
        className,
      )}
    >
      {/* MESSAGE: Date notification with call-to-action */}
      <p className="flex-grow">
        {getWords(dateType) + ": "}
        {date + "  "}
        {
          <button onClick={onClick} className="underline cursor-pointer focus:outline-none">
            {t("edit")}
          </button>
        }
      </p>
    </div>
  );
};

export default EditPaymentMessage;
