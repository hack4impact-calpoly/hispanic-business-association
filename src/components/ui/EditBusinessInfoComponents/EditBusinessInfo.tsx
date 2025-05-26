"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useActiveBusinessRequest, useBusiness } from "@/hooks/swrHooks";
import { useTranslations } from "next-intl";

interface EditBusinessInfoProps {
  onClose?: () => void;
  onSubmitSuccess?: () => void;
}

interface FormDataShape {
  businessName: string;
  businessType: string;
  businessOwner: string;
  website: string;
  organizationType: string;
  businessScale: string;
  numberOfEmployees: string;
  gender: string;
  physicalAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  mailingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  sameAddress: boolean;
}

const initialFormState: FormDataShape = {
  businessName: "",
  businessType: "",
  businessOwner: "",
  website: "",
  organizationType: "",
  businessScale: "",
  numberOfEmployees: "",
  gender: "",
  physicalAddress: {
    street: "",
    city: "",
    state: "",
    zip: "",
  },
  mailingAddress: {
    street: "",
    city: "",
    state: "",
    zip: "",
  },
  sameAddress: false,
};

// Compare objects/values recursively for equality
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

export default function EditBusinessInfo({ onClose, onSubmitSuccess }: EditBusinessInfoProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const { activeRequest, isLoading: isRequestLoading } = useActiveBusinessRequest();
  const { business } = useBusiness();
  const [existingRequestId, setExistingRequestId] = useState<string | undefined>(undefined);

  const [formData, setFormData] = useState<FormDataShape>({ ...initialFormState });
  const [originalFormData, setOriginalFormData] = useState<FormDataShape>({ ...initialFormState });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("physical") || name.startsWith("mailing")) {
      const [addressType, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [addressType]: {
          ...prev[addressType as "physicalAddress" | "mailingAddress"],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      sameAddress: checked,
      mailingAddress: checked ? { ...prev.physicalAddress } : prev.mailingAddress,
    }));
  };

  // Initialize form data
  useEffect(() => {
    const timer = setTimeout(() => {
      let formValues: FormDataShape = { ...initialFormState };

      // Load current business data first
      if (business) {
        const physicalAddressData = business.physicalAddress || { street: "", city: "", state: "", zip: "" };
        const mailingAddressData = business.mailingAddress || { street: "", city: "", state: "", zip: "" };

        formValues = {
          businessName: business.businessName || "",
          businessType: business.businessType || "",
          businessOwner: business.businessOwner || "",
          website: business.website || "",
          organizationType: business.organizationType || "",
          businessScale: business.businessScale || "",
          numberOfEmployees: business.numberOfEmployees || "",
          gender: business.gender || "",
          physicalAddress: {
            street: physicalAddressData.street || "",
            city: physicalAddressData.city || "",
            state: physicalAddressData.state || "",
            zip: physicalAddressData.zip?.toString() || "",
          },
          mailingAddress: {
            street: mailingAddressData.street || "",
            city: mailingAddressData.city || "",
            state: mailingAddressData.state || "",
            zip: mailingAddressData.zip?.toString() || "",
          },
          sameAddress: false,
        };
      }

      // Override with activeRequest data if it exists
      if (activeRequest) {
        if (activeRequest.businessName !== undefined) formValues.businessName = activeRequest.businessName;
        if (activeRequest.businessType !== undefined) formValues.businessType = activeRequest.businessType;
        if (activeRequest.businessOwner !== undefined) formValues.businessOwner = activeRequest.businessOwner;
        if (activeRequest.website !== undefined) formValues.website = activeRequest.website;
        if (activeRequest.organizationType !== undefined) formValues.organizationType = activeRequest.organizationType;
        if (activeRequest.businessScale !== undefined) formValues.businessScale = activeRequest.businessScale;
        if (activeRequest.numberOfEmployees !== undefined)
          formValues.numberOfEmployees = activeRequest.numberOfEmployees;
        if (activeRequest.gender !== undefined) formValues.gender = activeRequest.gender;

        if (activeRequest.physicalAddress) {
          formValues.physicalAddress = {
            street: activeRequest.physicalAddress.street || "",
            city: activeRequest.physicalAddress.city || "",
            state: activeRequest.physicalAddress.state || "",
            zip: activeRequest.physicalAddress.zip?.toString() || "",
          };
        }

        if (activeRequest.mailingAddress) {
          formValues.mailingAddress = {
            street: activeRequest.mailingAddress.street || "",
            city: activeRequest.mailingAddress.city || "",
            state: activeRequest.mailingAddress.state || "",
            zip: activeRequest.mailingAddress.zip?.toString() || "",
          };
        }

        setExistingRequestId((activeRequest as any)._id);
      }

      setFormData(formValues);
      setOriginalFormData(JSON.parse(JSON.stringify(formValues)));
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeRequest, business]);

  // Submit form with only changed field values
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    const changedPayloadFields: any = {};
    let hasChanges = false;

    // Check business name changes
    if (formData.businessName !== originalFormData.businessName) {
      changedPayloadFields.businessName = formData.businessName;
      hasChanges = true;
    }

    // Check business type changes
    if (formData.businessType !== originalFormData.businessType) {
      changedPayloadFields.businessType = formData.businessType;
      hasChanges = true;
    }

    if (formData.businessOwner !== originalFormData.businessOwner) {
      changedPayloadFields.businessOwner = formData.businessOwner;
      hasChanges = true;
    }

    // Check website changes
    if (formData.website !== originalFormData.website) {
      changedPayloadFields.website = formData.website;
      hasChanges = true;
    }

    // Check new schema fields
    if (formData.organizationType !== originalFormData.organizationType) {
      changedPayloadFields.organizationType = formData.organizationType;
      hasChanges = true;
    }

    if (formData.businessScale !== originalFormData.businessScale) {
      changedPayloadFields.businessScale = formData.businessScale;
      hasChanges = true;
    }

    if (formData.numberOfEmployees !== originalFormData.numberOfEmployees) {
      changedPayloadFields.numberOfEmployees = formData.numberOfEmployees;
      hasChanges = true;
    }

    if (formData.gender !== originalFormData.gender) {
      changedPayloadFields.gender = formData.gender;
      hasChanges = true;
    }

    // Check address changes
    if (!deepCompareValues(formData.physicalAddress, originalFormData.physicalAddress)) {
      changedPayloadFields.physicalAddress = { ...formData.physicalAddress };
      hasChanges = true;
    }

    if (!deepCompareValues(formData.mailingAddress, originalFormData.mailingAddress)) {
      changedPayloadFields.mailingAddress = { ...formData.mailingAddress };
      hasChanges = true;
    }

    // Only submit if changes exist
    if (!hasChanges) {
      setFeedback({ type: "info", message: t("No changes detected.") });
      setIsSubmitting(false);
      return;
    }

    try {
      // Continue with submission including only changed fields
      const requestData: any = {
        ...changedPayloadFields,
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
      // Reset baseline values after successful submission
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
          <h1 className="text-lg md:text-xl font-medium text-black">{t("editBizInfo")}</h1>
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
                className="object-contain"
              />
            </button>
          )}
        </header>
        <hr className="mt-4 h-px border border-solid border-stone-300" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-5">
        <form className="space-y-4 pb-20">
          {/* Business Name Input */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium mb-1">
              {t("businessName")}
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              placeholder={t("officialRegisteredName")}
              value={formData.businessName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Business Owner Inputs */}
          <div>
            <label htmlFor="businessOwner" className="block text-sm font-medium mb-1">
              {t("bizowner")}
            </label>
            <input
              id="businessOwner"
              name="businessOwner"
              type="text"
              placeholder={t("bizowner")}
              value={formData.businessOwner}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Organization Type Select */}
          <div>
            <label htmlFor="organizationType" className="block text-sm font-medium mb-1">
              {t("organizationType")}
            </label>
            <select
              id="organizationType"
              name="organizationType"
              value={formData.organizationType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t("selectType")}</option>
              <option value="Nonprofit">Nonprofit</option>
              <option value="Community">Community</option>
              <option value="Business">Business</option>
            </select>
          </div>

          {/* Business Type Select - Only show for Business organizations */}
          {formData.organizationType === "Business" && (
            <>
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium mb-1">
                  {t("businessType")}
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t("selectType")}</option>
                  <option value="Food">Food</option>
                  <option value="Housing">Housing</option>
                  <option value="Banking/Finance">Banking/Finance</option>
                  <option value="Retail shops">Retail shops</option>
                  <option value="Wedding/Events">Wedding/Events</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Education">Education</option>
                  <option value="Technology">Technology</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Business Scale Select */}
              <div>
                <label htmlFor="businessScale" className="block text-sm font-medium mb-1">
                  {t("businessScale")}
                </label>
                <select
                  id="businessScale"
                  name="businessScale"
                  value={formData.businessScale}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t("selectScale")}</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Small Business">Small Business</option>
                </select>
              </div>

              {/* Number of Employees Select */}
              <div>
                <label htmlFor="numberOfEmployees" className="block text-sm font-medium mb-1">
                  {t("numberOfEmployees")}
                </label>
                <select
                  id="numberOfEmployees"
                  name="numberOfEmployees"
                  value={formData.numberOfEmployees}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t("selectEmployeeRange")}</option>
                  <option value="1-10">1-10</option>
                  <option value="11-20">11-20</option>
                  <option value="21-50">21-50</option>
                  <option value="51-99">51-99</option>
                  <option value="100+">100+</option>
                </select>
              </div>
            </>
          )}

          {/* Gender Select */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium mb-1">
              {t("gender")}
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t("selectGender")}</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Website Input */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-1">
              {t("website")}
            </label>
            <input
              id="website"
              name="website"
              type="text"
              placeholder="https://example.com"
              value={formData.website}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Physical Address Inputs */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("physAdd")}</label>
            <input
              name="physicalAddress.street"
              type="text"
              placeholder={t("street")}
              value={formData.physicalAddress.street}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t("physicalStreet")}
            />
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                <input
                  name="physicalAddress.city"
                  type="text"
                  placeholder={t("city")}
                  value={formData.physicalAddress.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={t("physicalCity")}
                />
              </div>
              <div className="col-span-4">
                <input
                  name="physicalAddress.state"
                  type="text"
                  placeholder={t("state")}
                  value={formData.physicalAddress.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={t("physicalState")}
                />
              </div>
              <div className="col-span-3">
                <input
                  name="physicalAddress.zip"
                  type="text"
                  placeholder={t("zip")}
                  value={formData.physicalAddress.zip}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={t("physicalZip")}
                />
              </div>
            </div>
          </div>

          {/* Same Address Checkbox */}
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="sameAddress"
              name="sameAddress"
              checked={formData.sameAddress}
              onChange={handleSameAddressChange}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="sameAddress" className="text-sm">
              {t("mailsame")}
            </label>
          </div>

          {/* Mailing Address Inputs (Conditional) */}
          {!formData.sameAddress && (
            <div>
              <label className="block text-sm font-medium mb-1">{t("mailAdd")}</label>
              <input
                name="mailingAddress.street"
                type="text"
                placeholder={t("street")}
                value={formData.mailingAddress.street}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t("mailingStreet")}
              />
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <input
                    name="mailingAddress.city"
                    type="text"
                    placeholder={t("city")}
                    value={formData.mailingAddress.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={t("mailingCity")}
                  />
                </div>
                <div className="col-span-4">
                  <input
                    name="mailingAddress.state"
                    type="text"
                    placeholder={t("state")}
                    value={formData.mailingAddress.state}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={t("mailingState")}
                  />
                </div>
                <div className="col-span-3">
                  <input
                    name="mailingAddress.zip"
                    type="text"
                    placeholder={t("zip")}
                    value={formData.mailingAddress.zip}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={t("mailingZip")}
                  />
                </div>
              </div>
            </div>
          )}
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
