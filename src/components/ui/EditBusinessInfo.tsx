"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useActiveBusinessRequest } from "@/lib/swrHooks";

// Configures component behavior
interface EditBusinessInfoProps {
  onClose?: () => void;
  onSubmitSuccess?: () => void;
}

interface BusinessFormData {
  businessName: string;
  businessType: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerAdditionalName: string;
  coOwnerFirstName: string;
  coOwnerLastName: string;
}

// Renders edit form
export default function EditBusinessInfo({ onClose, onSubmitSuccess }: EditBusinessInfoProps) {
  // Tracks submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Tracks loading state
  const [isLoading, setIsLoading] = useState(true);
  // Tracks feedback from server
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  // Fetch active request if exists
  const { activeRequest, isLoading: isRequestLoading } = useActiveBusinessRequest();
  // Store request ID if one exists
  const [existingRequestId, setExistingRequestId] = useState<string | undefined>(undefined);

  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: "",
    businessType: "",
    ownerFirstName: "",
    ownerLastName: "",
    ownerAdditionalName: "",
    coOwnerFirstName: "",
    coOwnerLastName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Sets initial data and check for existing request
  useEffect(() => {
    const timer = setTimeout(() => {
      // If active request exists, use that data to populate form
      if (activeRequest) {
        // Extract first/last name from owner name if available
        let firstName = "";
        let lastName = "";

        if (activeRequest.businessOwner) {
          const nameParts = activeRequest.businessOwner.split(" ");
          firstName = nameParts[0] || "";
          lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
        }

        setFormData({
          businessName: activeRequest.businessName || "",
          businessType: activeRequest.businessType || "",
          ownerFirstName: firstName,
          ownerLastName: lastName,
          ownerAdditionalName: "",
          coOwnerFirstName: "",
          coOwnerLastName: "",
        });

        // Store request ID for update
        setExistingRequestId((activeRequest as any)._id);
      }

      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeRequest]);

  // Submits form data
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      // Create request data
      const requestData = {
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessOwner: `${formData.ownerFirstName} ${formData.ownerLastName}`,
        date: new Date().toLocaleDateString(),
      };

      // If we have an existing request ID, include it for update
      if (existingRequestId) {
        Object.assign(requestData, { requestId: existingRequestId });
      }

      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit changes");
      }

      // Calls optional callback when submit succeeds
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        setFeedback({
          type: "success",
          message: "Your changes have been submitted for approval!",
        });
      }
    } catch (error: any) {
      console.error("Error submitting changes:", error);
      setFeedback({
        type: "error",
        message: error.message || "An error occurred while submitting your changes. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shows loading state
  if (isLoading || isRequestLoading) {
    return (
      <article className="rounded-lg shadow-sm w-full max-w-[805px] md:max-w-[805px] border border-gray-200 bg-white">
        <section className="flex flex-col py-4 md:py-6 w-full bg-white rounded-lg">
          <div className="flex justify-center items-center h-[200px] md:h-[400px]">
            <p className="text-gray-500 animate-pulse">Loading business information...</p>
          </div>
        </section>
      </article>
    );
  }

  // Renders form for editing description
  return (
    <article className="fixed inset-x-0 top-0 bottom-[92px] z-[60] h-[calc(100vh-92px)] bg-white overflow-y-auto sm:rounded-lg w-full max-w-full md:top-12 md:bottom-auto md:h-auto md:max-h-[90vh] md:mx-auto md:left-0 md:right-0 md:w-[805px] border border-gray-200">
      <section className="flex flex-col py-4 md:py-6 w-full bg-white rounded-lg overflow-y-auto">
        <div className="flex flex-col px-4 md:px-5 w-full">
          <header className="flex flex-wrap gap-2 md:gap-5 justify-between items-start">
            <h1 className="mt-2 md:mt-4 text-lg md:text-xl font-medium text-black">Edit Business Information</h1>
            {onClose && (
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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

          <hr className="shrink-0 mt-4 md:mt-7 h-px border border-solid border-stone-300" />

          <p className="self-start mt-4 text-sm text-stone-500 mb-4">
            <span className="text-red-500">*</span> indicates required
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                name="businessName"
                type="text"
                placeholder="Official Registered Name"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="Retail">Retail</option>
                <option value="Service">Service</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Business Owner */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Business Owner <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  name="ownerFirstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.ownerFirstName}
                  onChange={handleChange}
                  className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  name="ownerLastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.ownerLastName}
                  onChange={handleChange}
                  className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <input
                name="ownerAdditionalName"
                type="text"
                placeholder="Additional Name"
                value={formData.ownerAdditionalName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Business Co-owner */}
            <div>
              <label className="block text-sm font-medium mb-1">Business Co-owner</label>
              <div className="flex space-x-2">
                <input
                  name="coOwnerFirstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.coOwnerFirstName}
                  onChange={handleChange}
                  className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="coOwnerLastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.coOwnerLastName}
                  onChange={handleChange}
                  className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <hr className="shrink-0 self-center mt-4 md:mt-6 max-w-full h-px border border-solid border-stone-300 w-[90%] md:w-[765px]" />

            <div className="flex max-sm:justify-center justify-end mt-4 md:mt-6 mr-3 md:mr-6 gap-4 ">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full sm:w-3/12 gap-2.5 py-2 px-4 md:py-2.5 md:px-5 text-sm md:text-base font-bold text-white 
              ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-[#405BA9] hover:bg-[#293241]"} 
              rounded-3xl min-h-[36px] md:min-h-[40px] transition-colors w-auto flex justify-center items-center`}
              >
                {isSubmitting ? <span className="animate-pulse">Saving...</span> : "Submit Changes"}
              </button>
            </div>
          </form>
        </div>

        {feedback && (
          <div
            className={`mx-3 md:mx-5 mt-2 md:mt-4 p-2 md:p-3 rounded-md text-sm md:text-base
              ${feedback.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            role="alert"
          >
            {feedback.message}
          </div>
        )}
      </section>
    </article>
  );
}
