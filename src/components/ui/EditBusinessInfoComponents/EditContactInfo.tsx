"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useActiveBusinessRequest, useBusiness } from "@/hooks/swrHooks";
import { useTranslations } from "next-intl";

interface EditContactInfoProps {
  onClose?: () => void;
  onSubmitSuccess?: () => void;
}

// Contact form field structure matching backend expectations
interface ContactFormData {
  pocName: string;
  phoneNumber: string;
  email: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

// Validation errors state
interface ValidationErrors {
  pocName?: string;
  phoneNumber?: string;
  email?: string;
}

// Initialize empty contact form state
const initialContactFormState: ContactFormData = {
  pocName: "",
  phoneNumber: "",
  email: "",
  instagram: "",
  facebook: "",
  twitter: "",
};

// Email validation matching backend logic exactly
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Reject invalid patterns matching backend validation
  if (
    email.includes("..") ||
    email.startsWith(".") ||
    email.endsWith(".") ||
    email.includes("@.") ||
    email.includes(".@")
  ) {
    return false;
  }

  return emailRegex.test(email);
};

// Phone number validation matching backend processing
const validatePhoneNumber = (phone: string): boolean => {
  const phoneStr = phone.toString().replace(/\D/g, "");
  return phoneStr.length === 10;
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
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const { activeRequest, isLoading: isRequestLoading } = useActiveBusinessRequest();
  const { business } = useBusiness();
  const [existingRequestId, setExistingRequestId] = useState<string | undefined>(undefined);

  const [formData, setFormData] = useState<ContactFormData>({ ...initialContactFormState });
  const [originalFormData, setOriginalFormData] = useState<ContactFormData>({ ...initialContactFormState });

  // Phone number input formatting and validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Strip non-digits like backend
    if (value.length <= 10) {
      setFormData((prev) => ({ ...prev, phoneNumber: value }));

      // Clear phone validation error when user starts typing valid digits
      if (validationErrors.phoneNumber && value.length > 0) {
        setValidationErrors((prev) => ({ ...prev, phoneNumber: undefined }));
      }
    }
  };

  // Standard input change handler with validation clearing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Initialize form data from business and activeRequest
  useEffect(() => {
    // Only run when data ready
    if (isRequestLoading) return;

    let loadedFormData: ContactFormData = { ...initialContactFormState };

    if (business) {
      const poc = business.pointOfContact || {};
      const socialMedia = business.socialMediaHandles || {};

      loadedFormData = {
        pocName: poc.name || "",
        phoneNumber: poc.phoneNumber ? poc.phoneNumber.toString() : "",
        email: poc.email || "",
        instagram: socialMedia.IG || "",
        facebook: socialMedia.FB || "",
        twitter: socialMedia.twitter || "",
      };
    }

    if (activeRequest) {
      const poc = activeRequest.pointOfContact;

      if (poc && (poc.name || poc.phoneNumber || poc.email)) {
        if (poc.name) loadedFormData.pocName = poc.name;
        if (poc.phoneNumber) loadedFormData.phoneNumber = poc.phoneNumber.toString();
        if (poc.email) loadedFormData.email = poc.email;
      }

      const socialMedia = activeRequest.socialMediaHandles;
      if (socialMedia) {
        if (socialMedia.IG) loadedFormData.instagram = socialMedia.IG;
        if (socialMedia.FB) loadedFormData.facebook = socialMedia.FB;
        if (socialMedia.twitter) loadedFormData.twitter = socialMedia.twitter;
      }

      setExistingRequestId((activeRequest as any)._id);
    }

    setFormData(loadedFormData);
    setOriginalFormData(JSON.parse(JSON.stringify(loadedFormData)));
    setIsLoading(false);
  }, [activeRequest, business, isRequestLoading]);

  // Submit form data with validation
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    // Frontend validation matching backend requirements
    const errors: ValidationErrors = {};

    if (!formData.pocName.trim()) {
      errors.pocName = t("contactNameRequired");
    }

    if (!formData.email.trim()) {
      errors.email = t("contactEmailRequired");
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = t("contactEmailInvalid");
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = t("contactPhoneRequired");
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = t("contactPhoneInvalid");
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const changedPayload: any = {};
    let hasChanges = false;

    const currentPOCName = formData.pocName.trim();
    const originalPOCName = originalFormData.pocName.trim();
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
        <form className="space-y-4 pt-4 pb-20">
          <div>
            <label className="block text-sm font-medium mb-1">{t("pointOfContact")} *</label>
            <div className="flex space-x-2 mb-2">
              <input
                name="pocName"
                type="text"
                placeholder={t("pointOfContact")}
                value={formData.pocName}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.pocName ? "border-red-500" : "border-gray-300"
                }`}
                aria-label={t("pointOfContact")}
              />
            </div>
            {validationErrors.pocName && <p className="text-red-600 text-sm mt-1">{validationErrors.pocName}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
              {t("phoneNumber")} *
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              placeholder="(XXX)-XXX-XXXX"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              maxLength={10}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {validationErrors.phoneNumber && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              {t("email")} *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="xxxx@xxx.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {validationErrors.email && <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>}
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
            disabled={isSubmitting || isLoading}
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
