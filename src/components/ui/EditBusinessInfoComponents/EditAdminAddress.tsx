"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAdminAddress } from "@/hooks/swrHooks";

interface EditAdminAddressProps {
  onClose?: () => void;
  onSubmitSuccess?: () => void;
}

interface AdminAddressFormData {
  address: { street: string; city: string; state: string; zip: string }; // Use string for zip to match input value
}

const initialContactFormState: AdminAddressFormData = {
  address: { street: "", city: "", state: "", zip: "" },
};

const deepCompareValues = (val1: any, val2: any): boolean => {
  if (val1 === val2) return true;
  if (typeof val1 !== "object" || val1 === null || typeof val2 !== "object" || val2 === null) {
    return false;
  }
  const keys1 = Object.keys(val1);
  const keys2 = Object.keys(val2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepCompareValues(val1[key], val2[key])) {
      return false;
    }
  }
  return true;
};

export default function EditAdminAddress({ onClose, onSubmitSuccess }: EditAdminAddressProps) {
  const t = useTranslations();
  const { adminAddress, isLoading: isAdminAddressLoading, mutate } = useAdminAddress();

  const [formData, setFormData] = useState<AdminAddressFormData>(initialContactFormState);
  const [originalFormData, setOriginalFormData] = useState<AdminAddressFormData>(initialContactFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  useEffect(() => {
    if (adminAddress) {
      const newData = {
        address: {
          street: adminAddress.address.street || "",
          city: adminAddress.address.city || "",
          state: adminAddress.address.state || "",
          zip: String(adminAddress.address.zip || ""),
        },
      };
      setFormData(newData);
      setOriginalFormData(newData);
    }
  }, [adminAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split(".");
    if (section === "address") {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/adminMailingAddress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData.address),
      });

      if (!response.ok) {
        throw new Error("Failed to update address");
      }

      setFeedback({ type: "success", message: t("Address updated successfully") });
      setOriginalFormData(formData);
      mutate(); // Revalidate SWR
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      setFeedback({ type: "error", message: t("Failed to update address") });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = !deepCompareValues(formData, originalFormData);
  const isLoading = isAdminAddressLoading;

  return (
    <article className="fixed inset-x-0 top-0 bottom-[92px] z-[60] h-[calc(103vh-92px)] bg-white overflow-y-auto sm:rounded-lg w-full max-w-full md:fixed md:inset-0 md:m-auto md:top-auto md:bottom-auto md:h-auto md:max-h-[90vh] md:mx-auto md:left-0 md:right-0 md:w-[805px] border border-gray-200 flex flex-col">
      <div className="sticky top-0 z-10 bg-white px-4 md:px-5 pt-4 md:pt-6 pb-2">
        <header className="flex flex-wrap gap-2 md:gap-5 justify-between items-start">
          <h1 className="text-lg md:text-xl font-medium text-black">{t("Edit Mailing Address")}</h1>
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
        <form
          className="space-y-4 pt-4 pb-20"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1">{t("mailAdd")}</label>
            <input
              name="address.street"
              type="text"
              placeholder={t("street")}
              value={formData.address.street}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t("mailingStreet")}
            />
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                <input
                  name="address.city"
                  type="text"
                  placeholder={t("city")}
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={t("mailingCity")}
                />
              </div>
              <div className="col-span-4">
                <input
                  name="address.state"
                  type="text"
                  placeholder={t("state")}
                  value={formData.address.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={t("mailingState")}
                />
              </div>
              <div className="col-span-3">
                <input
                  name="address.zip"
                  type="text"
                  placeholder={t("zip")}
                  value={formData.address.zip}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={t("mailingZip")}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
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
            disabled={isSubmitting || isLoading || !hasChanges}
            className={`w-full sm:w-auto gap-2.5 py-2 px-4 md:py-2.5 md:px-5 text-sm md:text-base font-bold text-white ${
              isSubmitting || isLoading || !hasChanges
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-[#405BA9] hover:bg-[#293241]"
            } rounded-3xl min-h-[36px] md:min-h-[40px] transition-colors flex justify-center items-center`}
          >
            {isSubmitting ? <span className="animate-pulse">{t("saving")}</span> : t("submitChanges")}
          </button>
        </div>
      </div>
    </article>
  );
}
