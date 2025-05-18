"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useActiveBusinessRequest } from "@/hooks/swrHooks";
import { useTranslations } from "next-intl";

interface EditContactInfoProps {
  onClose?: () => void;
  onSubmitSuccess?: () => void;
}

// Declare contact form field structure
interface ContactFormData {
  pocFirstName: string;
  pocLastName: string;
  pocAdditionalName: string; // Currently not sent to API, form-only field
  altPocFirst: string; // Currently not sent to API, form-only field
  altPocLast: string; // Currently not sent to API, form-only field
  altPocAdditional: string; // Currently not sent to API, form-only field
  phoneNumber: string;
  email: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

// Initialize empty contact form state
const initialContactFormState: ContactFormData = {
  pocFirstName: "",
  pocLastName: "",
  pocAdditionalName: "",
  altPocFirst: "",
  altPocLast: "",
  altPocAdditional: "",
  phoneNumber: "",
  email: "",
  instagram: "",
  facebook: "",
  twitter: "",
};

// Compare objects recursively for equality
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

export default function EditContactInfo({ onClose, onSubmitSuccess }: EditContactInfoProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Add info status for non-error notifications
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const { activeRequest, isLoading: isRequestLoading } = useActiveBusinessRequest();
  const [existingRequestId, setExistingRequestId] = useState<string | undefined>(undefined);

  const [formData, setFormData] = useState<ContactFormData>({ ...initialContactFormState });
  // Track initial form values for change detection
  const [originalFormData, setOriginalFormData] = useState<ContactFormData>({ ...initialContactFormState });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Initialize form data from active business request
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeRequest) {
        const poc = activeRequest.pointOfContact || {};
        let firstName = "";
        let lastName = "";

        if (poc.name) {
          const nameParts = poc.name.split(" ");
          firstName = nameParts[0] || "";
          lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
        }

        const socialMedia = activeRequest.socialMediaHandles || {};

        const loadedFormData: ContactFormData = {
          pocFirstName: firstName,
          pocLastName: lastName,
          pocAdditionalName: "", // Store UI-only field
          altPocFirst: "", // Store UI-only field
          altPocLast: "", // Store UI-only field
          altPocAdditional: "", // Store UI-only field
          phoneNumber: poc.phoneNumber ? poc.phoneNumber.toString() : "",
          email: poc.email || "",
          instagram: socialMedia.IG || "",
          facebook: socialMedia.FB || "",
          twitter: socialMedia.twitter || "",
        };
        setFormData(loadedFormData);
        // Clone data to prevent reference issues
        setOriginalFormData(JSON.parse(JSON.stringify(loadedFormData)));
        setExistingRequestId((activeRequest as any)._id);
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeRequest]);

  // Submit form data, sending only changed fields
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    const changedPayload: any = {};
    let hasChanges = false;

    // Point of Contact object
    const currentPOCName = `${formData.pocFirstName} ${formData.pocLastName}`.trim();
    const originalPOCName = `${originalFormData.pocFirstName} ${originalFormData.pocLastName}`.trim();
    const currentPhoneNumber = formData.phoneNumber;
    const originalPhoneNumber = originalFormData.phoneNumber;
    const currentEmail = formData.email;
    const originalEmail = originalFormData.email;

    let pocChanges: any = {};
    if (currentPOCName !== originalPOCName) {
      pocChanges.name = currentPOCName;
      hasChanges = true;
    }
    if (currentPhoneNumber !== originalPhoneNumber) {
      pocChanges.phoneNumber = currentPhoneNumber;
      hasChanges = true;
    }
    if (currentEmail !== originalEmail) {
      pocChanges.email = currentEmail;
      hasChanges = true;
    }

    if (Object.keys(pocChanges).length > 0) {
      changedPayload.pointOfContact = pocChanges;
    }

    // Social Media Handles object
    const currentSocialMedia = {
      IG: formData.instagram,
      FB: formData.facebook,
      twitter: formData.twitter,
    };
    const originalSocialMedia = {
      IG: originalFormData.instagram,
      FB: originalFormData.facebook,
      twitter: originalFormData.twitter,
    };

    if (!deepCompareValues(currentSocialMedia, originalSocialMedia)) {
      changedPayload.socialMediaHandles = currentSocialMedia;
      hasChanges = true;
    }

    if (!hasChanges) {
      setFeedback({ type: "info", message: t("No changes detected.") });
      setIsSubmitting(false);
      return;
    }

    try {
      const requestData: any = {
        ...changedPayload,
        date: new Date().toLocaleDateString(),
      };

      if (existingRequestId) {
        requestData.requestId = existingRequestId;
      }

      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("failedChanges"));
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        setFeedback({ type: "success", message: t("changesSent") });
      }
      // Reset baseline data after successful submission
      setOriginalFormData(JSON.parse(JSON.stringify(formData)));
    } catch (error: any) {
      console.error("Error submitting changes:", error);
      setFeedback({ type: "error", message: error.message || t("errorSubmittingChanges") });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isRequestLoading) {
    return (
      <article className="rounded-lg shadow-sm w-full max-w-[805px] border border-gray-200 bg-white">
        <section className="flex flex-col py-4 md:py-6 w-full bg-white rounded-lg">
          <div className="flex justify-center items-center h-[200px] md:h-[400px]">
            <p className="text-gray-500 animate-pulse">{t("loadBizInfo")}</p>
          </div>
        </section>
      </article>
    );
  }

  return (
    <article className="fixed inset-x-0 top-0 bottom-[92px] z-[60] h-[calc(103vh-92px)] bg-white overflow-y-auto sm:rounded-lg w-full max-w-full md:fixed md:inset-0 md:m-auto md:top-auto md:bottom-auto md:h-auto md:max-h-[90vh] md:mx-auto md:left-0 md:right-0 md:w-[805px] border border-gray-200 flex flex-col">
      <div className="sticky top-0 z-10 bg-white px-4 md:px-5 pt-4 md:pt-6 pb-2">
        <header className="flex flex-wrap gap-2 md:gap-5 justify-between items-start">
          <h1 className="text-lg md:text-xl font-medium text-black">{t("editContactInfo")}</h1>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#f0f0f0] transition-colors"
              aria-label="Close"
            >
              <Image
                src="/icons/Close.png"
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
        <form className="space-y-4 pt-4 pb-20">
          <div>
            <label className="block text-sm font-medium mb-1">{t("pointOfContact")}</label>
            <div className="flex space-x-2 mb-2">
              <input
                name="pocFirstName"
                type="text"
                placeholder={t("firstName")}
                value={formData.pocFirstName}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t("pocFirstName")}
              />
              <input
                name="pocLastName"
                type="text"
                placeholder={t("lastName")}
                value={formData.pocLastName}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t("pocLastName")}
              />
            </div>
            <input
              name="pocAdditionalName"
              type="text"
              placeholder={t("additionalName")}
              value={formData.pocAdditionalName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t("pocAdditionalName")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("altPointofContact")}</label>
            <div className="flex space-x-2 mb-2">
              <input
                name="altPocFirst"
                type="text"
                placeholder={t("firstName")}
                value={formData.altPocFirst}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t("altPocFirstName")}
              />
              <input
                name="altPocLast"
                type="text"
                placeholder={t("lastName")}
                value={formData.altPocLast}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t("altPocLastName")}
              />
            </div>
            <input
              name="altPocAdditional"
              type="text"
              placeholder={t("additionalName")}
              value={formData.altPocAdditional}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t("altPocAdditionalName")}
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
              {t("phoneNumber")}
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              placeholder="(XXX)-XXX-XXXX"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="xxxx@xxx.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("socialMedia")}</label>
            <div className="space-y-2">
              <input
                name="instagram"
                type="text"
                placeholder="Instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Instagram"
              />
              <input
                name="facebook"
                type="text"
                placeholder="Facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Facebook"
              />
              <input
                name="twitter"
                type="text"
                placeholder="Twitter/X"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Twitter"
              />
            </div>
          </div>
        </form>
      </div>

      <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
        {feedback && (
          <div
            className={`mb-4 p-2 md:p-3 rounded-md text-sm md:text-base
              ${feedback.type === "success" ? "bg-green-50 text-green-800" : feedback.type === "error" ? "bg-red-50 text-red-800" : "bg-blue-50 text-blue-800"}`}
            role="alert"
          >
            {feedback.message}
          </div>
        )}

        <div className="flex max-sm:justify-center justify-end gap-4 mb-5">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading} // Also disable if initial data is loading
            className={`w-full sm:w-auto gap-2.5 py-2 px-4 md:py-2.5 md:px-5 text-sm md:text-base font-bold text-white 
              ${isSubmitting || isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-[#405BA9] hover:bg-[#293241]"} 
              rounded-3xl min-h-[36px] md:min-h-[40px] transition-colors flex justify-center items-center`}
          >
            {isSubmitting ? <span className="animate-pulse">{t("saving")}</span> : t("submitChanges")}
          </button>
        </div>
      </div>
    </article>
  );
}
