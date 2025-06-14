"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useBusinessById } from "@/hooks/swrHooks";
import { mutate } from "swr";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";
import { enUS, es } from "date-fns/locale";
import { useLocale } from "next-intl";

interface EditPaymentProps {
  dateType: string;
  bizId: string;
  onClose?: () => void;
  onSubmitSuccess?: () => void;
}

export default function EditPayment({ dateType, bizId, onClose, onSubmitSuccess }: EditPaymentProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [selected, setSelected] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const { business } = useBusinessById(bizId);

  const getWords = (type: string) =>
    type === "lastPaid" ? `${t("set")} ${t("lastPaid")}` : `${t("set")} ${t("expiryDate")}`;

  const initialMonth = useMemo(() => {
    if (dateType === "expiryDate") {
      if (business?.membershipExpiryDate) return new Date(business.membershipExpiryDate);
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      return d;
    } else {
      return new Date();
    }
  }, [dateType, business]);

  useEffect(() => {
    setSelected(null);
  }, [dateType, business]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const body =
        dateType === "lastPaid"
          ? { lastPayDate: selected, membershipExpiryDate: business?.membershipExpiryDate || null }
          : { lastPayDate: business?.lastPayDate || null, membershipExpiryDate: selected };

      const response = await fetch(`/api/business/${bizId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error();
      }

      await mutate(`/api/business/${bizId}`);
      setFeedback({
        type: "success",
        message: dateType === "lastPaid" ? t("lastPaidSuccess") : t("expirySuccess"),
      });
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      setFeedback({
        type: "error",
        message: dateType === "lastPaid" ? t("lastPaidFail") : t("expiryFail"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="fixed inset-0 z-[60] bg-white sm:static sm:rounded-lg sm:h-auto sm:max-h-[90vh] sm:mx-auto sm:w-auto sm:max-w-fit sm:border sm:border-gray-200 flex flex-col">
      <div className="z-10 bg-white px-4 md:px-5 pt-4 md:pt-6 pb-2 rounded-t-lg">
        <header className="flex flex-wrap gap-2 md:gap-5 justify-between items-start">
          <h1 className="text-lg md:text-xl font-medium text-black">{getWords(dateType)}</h1>
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-full hover:bg-[#f0f0f0]" aria-label="Close">
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
        <div className="flex justify-center my-5 flex-col items-center">
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale === "es" ? es : enUS}>
            <DatePicker
              label={t("selectDate")}
              value={selected}
              onChange={(newValue) => setSelected(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
              defaultValue={initialMonth}
              openTo="day"
            />
          </LocalizationProvider>
        </div>

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
