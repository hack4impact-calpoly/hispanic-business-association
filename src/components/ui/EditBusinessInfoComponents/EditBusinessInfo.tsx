"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useActiveBusinessRequest } from "@/hooks/swrHooks";
import { useTranslations } from "next-intl";

interface EditBusinessInfoProps {
  onClose?: () => void;
  onSubmitSuccess?: () => void;
}

interface FormDataShape {
  businessName: string;
  businessType: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerAdditionalName: string;
  coOwnerFirstName: string;
  coOwnerLastName: string;
  coOwner2FirstName: string;
  coOwner2LastName: string;
  website: string;
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
  ownerFirstName: "",
  ownerLastName: "",
  ownerAdditionalName: "",
  coOwnerFirstName: "",
  coOwnerLastName: "",
  coOwner2FirstName: "",
  coOwner2LastName: "",
  website: "",
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
      if (activeRequest) {
        let firstName = "";
        let lastName = "";

        if (activeRequest.businessOwner) {
          const nameParts = activeRequest.businessOwner.split(" ");
          firstName = nameParts[0] || "";
          lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
        }

        const physicalAddressData = activeRequest.address || { street: "", city: "", state: "", zip: "" };
        const initialMailingAddress = { street: "", city: "", state: "", zip: "" };
        const initialSameAddress = false;

        const formValues: FormDataShape = {
          businessName: activeRequest.businessName || "",
          businessType: activeRequest.businessType || "",
          ownerFirstName: firstName,
          ownerLastName: lastName,
          ownerAdditionalName: "",
          coOwnerFirstName: "",
          coOwnerLastName: "",
          coOwner2FirstName: "",
          coOwner2LastName: "",
          website: activeRequest.website || "",
          physicalAddress: {
            street: physicalAddressData.street || "",
            city: physicalAddressData.city || "",
            state: physicalAddressData.state || "",
            zip: physicalAddressData.zip?.toString() || "",
          },
          mailingAddress: initialMailingAddress,
          sameAddress: initialSameAddress,
        };

        setFormData(formValues);
        setOriginalFormData(JSON.parse(JSON.stringify(formValues)));
        setExistingRequestId((activeRequest as any)._id);
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeRequest]);

  // Submit form with only changed field values
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    const changedPayloadFields: any = {};
    let hasChanges = false;

    // Extract changed fields for API payload

    // Check business name changes
    if (formData.businessName !== originalFormData.businessName) {
      changedPayloadFields.businessName = formData.businessName;
      hasChanges = true;
    }

    //  Check business type changes
    if (formData.businessType !== originalFormData.businessType) {
      changedPayloadFields.businessType = formData.businessType;
      hasChanges = true;
    }

    //  Check business wwner changes
    const currentOwnerFullName = `${formData.ownerFirstName} ${formData.ownerLastName}`.trim();
    const originalOwnerFullName = `${originalFormData.ownerFirstName} ${originalFormData.ownerLastName}`.trim();
    if (currentOwnerFullName !== originalOwnerFullName) {
      changedPayloadFields.businessOwner = currentOwnerFullName;
      hasChanges = true;
    }

    //  Check website changes
    if (formData.website !== originalFormData.website) {
      changedPayloadFields.website = formData.website;
      hasChanges = true;
    }

    //  Check address changes
    if (!deepCompareValues(formData.physicalAddress, originalFormData.physicalAddress)) {
      changedPayloadFields.address = { ...formData.physicalAddress };
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
        method: "POST", // Consider PUT/PATCH if your API uses them for updates
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

          {/* Business Type Select */}
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
              <option value="Retail">Retail</option>
              <option value="Service">Service</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Business Owner Inputs */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("bizowner")}</label>
            <div className="flex space-x-2 mb-2">
              <input
                name="ownerFirstName"
                type="text"
                placeholder={t("firstName")}
                value={formData.ownerFirstName}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t("ownerFirstName")}
              />
              <input
                name="ownerLastName"
                type="text"
                placeholder={t("lastName")}
                value={formData.ownerLastName}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t("ownerLastName")}
              />
            </div>
            <input
              name="ownerAdditionalName"
              type="text"
              placeholder={t("additionalName")}
              value={formData.ownerAdditionalName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t("ownerAdditionalName")}
            />
          </div>

          {/* Co-Owner 1 Inputs */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("bizCoOwner")}</label>
            <div className="flex space-x-2 mb-2">
              <input
                name="coOwnerFirstName"
                type="text"
                placeholder={t("firstName")}
                value={formData.coOwnerFirstName}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t("coOwner1FirstName")}
              />
              <input
                name="coOwnerLastName"
                type="text"
                placeholder={t("lastName")}
                value={formData.coOwnerLastName}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t("coOwner1LastName")}
              />
            </div>
          </div>

          {/* Co-Owner 2 Inputs */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("bizCoOwner")} 2</label>
            <div className="flex space-x-2">
              <input
                name="coOwner2FirstName"
                type="text"
                placeholder={t("firstName")}
                value={formData.coOwner2FirstName}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t("coOwner2FirstName")}
              />
              <input
                name="coOwner2LastName"
                type="text"
                placeholder={t("lastName")}
                value={formData.coOwner2LastName}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t("coOwner2LastName")}
              />
            </div>
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
            disabled={isSubmitting || isLoading} // Disable if initial loading is not done
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
