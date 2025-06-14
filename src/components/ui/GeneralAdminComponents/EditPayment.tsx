"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { DayPicker } from "react-day-picker";
import { useBusinessById } from "@/hooks/swrHooks";
import { mutate } from "swr";
import "react-day-picker/dist/style.css";
import { enUS, es } from "react-day-picker/locale";

interface EditPaymentProps {
  dateType: string;
  bizId: string;
  onClose?: () => void;
  onSubmitSuccess?: () => void;
}

export default function EditPayment({ dateType, bizId, onClose, onSubmitSuccess }: EditPaymentProps) {
  const t = useTranslations();
  const locale = useLocale();
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

  const initialMonth = useMemo(() => {
    if (dateType === "expiryDate") {
      if (business?.membershipExpiryDate) {
        return new Date(business.membershipExpiryDate);
      }
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      return d;
    } else {
      return new Date();
    }
  }, [dateType, business]);

  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);

  const dayPickerLocale = locale === "es" ? es : enUS;

  useEffect(() => {
    setCurrentMonth(initialMonth);
  }, [initialMonth]);

  const handleMonthChange = (year: number, month: number) => {
    const newDate = new Date(year, month, 1);
    setCurrentMonth(newDate);
  };

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
    <article className="fixed inset-0 z-[60] bg-white sm:static sm:rounded-lg sm:h-auto sm:max-h-[90vh] sm:mx-auto sm:w-auto sm:max-w-fit sm:border sm:border-gray-200 flex flex-col">
      <div className="z-10 bg-white px-4 md:px-5 pt-4 md:pt-6 pb-2 rounded-t-lg">
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
        <div className="flex justify-center my-5 flex-col items-center">
          {/* Year + Month Dropdowns */}
          <div className="flex gap-4 mb-4">
            <select
              value={currentMonth.getFullYear()}
              onChange={(e) => handleMonthChange(Number(e.target.value), currentMonth.getMonth())}
              className="border px-2 py-1 rounded"
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>

            <select
              value={currentMonth.getMonth()}
              onChange={(e) => handleMonthChange(currentMonth.getFullYear(), Number(e.target.value))}
              className="border px-2 py-1 rounded"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString(locale, { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          {/* DayPicker */}
          <DayPicker
            animate
            mode="single"
            selected={selected}
            onSelect={setSelected}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={dayPickerLocale}
            footer={selected ? `${t("selected")}: ${selected.toLocaleDateString()}` : t("dayPick")}
          />
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
