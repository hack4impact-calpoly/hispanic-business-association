"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { DayPicker } from "react-day-picker";
import { useBusinessById } from "@/hooks/swrHooks";
import { mutate } from "swr";
import "react-day-picker/dist/style.css";

interface EditPaymentProps {
  dateType: string;
  bizId: string;
  onClose?: () => void;
  onSubmitSuccess?: () => void;
}

export default function EditPayment({ dateType, bizId, onClose, onSubmitSuccess }: EditPaymentProps) {
  const t = useTranslations();
  const [selected, setSelected] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const { business, isLoading: isBusinessLoading } = useBusinessById(bizId);

  const getWords = (type: string) => {
    if (type == "lastPaid") {
      return t("set") + " " + t("lastPaid");
    }
    return t("set") + " " + t("expiryDate");
  };

  useEffect(() => {}, [selected]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    if (dateType == "lastPaid") {
      try {
        const response = await fetch(`/api/business/${bizId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lastPayDate: selected, membershipExpiryDate: business?.membershipExpiryDate || null }),
        });

        if (!response.ok) {
          throw new Error(t("lastPaidFail"));
        }

        // Invalidate SWR cache that ensures fresh data displays
        await mutate(`/api/business/${bizId}`);

        setFeedback({ type: "success", message: t("lastPaidSuccess") });
        if (onSubmitSuccess) onSubmitSuccess();
      } catch (error) {
        setFeedback({ type: "error", message: t("lastPaidFail") });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      try {
        const response = await fetch(`/api/business/${bizId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lastPayDate: business?.lastPayDate || null, membershipExpiryDate: selected }),
        });

        if (!response.ok) {
          throw new Error(t("expiryFail"));
        }

        // Invalidate SWR cache that ensures fresh data displays
        await mutate(`/api/business/${bizId}`);

        setFeedback({ type: "success", message: t("expirySuccess") });
        if (onSubmitSuccess) onSubmitSuccess();
      } catch (error) {
        setFeedback({ type: "error", message: t("expiryFail") });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <article className="fixed inset-x-0 top-0 bottom-[92px] z-[60] h-[calc(103vh-92px)] bg-white overflow-y-auto sm:rounded-lg w-full max-w-full md:fixed md:inset-0 md:m-auto md:top-auto md:bottom-auto md:h-auto md:max-h-[90vh] md:mx-auto md:left-0 md:right-0 md:w-[805px] border border-gray-200 flex flex-col">
      <div className="sticky top-0 z-10 bg-white px-4 md:px-5 pt-4 md:pt-6 pb-2">
        <header className="flex flex-wrap gap-2 md:gap-5 justify-between items-start">
          <h1 className="text-lg md:text-xl font-medium text-black">{getWords(dateType)}</h1>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#f0f0f0] transition-colors"
              aria-label="Close"
            >
              <Image
                src="/icons/General_Icons/Close.png"
                alt="Close"
                width={24}
                height={24}
                className="md:w-[30px] md:h-[30px] object-contain"
              />
            </button>
          )}
        </header>
        <hr className="mt-4 h-px border border-solid border-stone-300" />
      </div>

      <div
        className="flex-1 overflow-y-auto overscroll-contain touch-pan-y px-4 md:px-5"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <DayPicker
          animate
          mode="single"
          selected={selected}
          onSelect={setSelected}
          footer={selected ? `${t("selected")}: ${selected.toLocaleDateString()}` : t("dayPick")}
        />

        {feedback && (
          <div
            className={`mb-4 p-2 md:p-3 rounded-md text-sm md:text-base ${
              feedback.type === "success"
                ? "bg-green-50 text-green-800"
                : feedback.type === "error"
                  ? "bg-red-50 text-red-800"
                  : "bg-blue-50 text-blue-800"
            }`}
            role="alert"
          >
            {feedback.message}
          </div>
        )}

        <div className="flex max-sm:justify-center justify-end gap-4 mb-5">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full sm:w-auto gap-2.5 py-2 px-4 md:py-2.5 md:px-5 text-sm md:text-base font-bold text-white 
              ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-[#405BA9] hover:bg-[#293241]"} 
              rounded-3xl min-h-[36px] md:min-h-[40px] transition-colors flex justify-center items-center`}
          >
            {isSubmitting ? <span className="animate-pulse">{t("saving")}</span> : t("submitChanges")}
          </button>
        </div>
      </div>
    </article>
  );
}
