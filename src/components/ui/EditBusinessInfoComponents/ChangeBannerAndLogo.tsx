"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/shadcnComponents/card";
import { Button } from "@/components/ui/shadcnComponents/button";
import { uploadToS3 } from "@/lib/s3Client";
import { useActiveBusinessRequest } from "@/hooks/swrHooks";
import { useTranslations } from "next-intl";

interface ChangeBannerAndLogoProps {
  onClose?: () => void;
  onSubmitSuccess?: () => void;
  initialBannerUrl?: string;
  initialLogoUrl?: string;
}

export default function ChangeBannerAndLogo({
  onClose,
  onSubmitSuccess,
  initialBannerUrl = "/logo/Default_Banner.jpg",
  initialLogoUrl = "/logo/Default_Logo.jpg",
}: ChangeBannerAndLogoProps) {
  const t = useTranslations();
  // Track file inputs and previews
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(initialBannerUrl);
  const [logoPreview, setLogoPreview] = useState<string>(initialLogoUrl);

  // Track submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch active request if exists
  const { activeRequest, isLoading: isRequestLoading } = useActiveBusinessRequest();
  // Store request ID if one exists
  const [existingRequestId, setExistingRequestId] = useState<string | undefined>(undefined);

  // Check for existing request and set initial URLs if available
  useEffect(() => {
    if (activeRequest) {
      // Set banner and logo URLs from active request if available
      if (activeRequest.bannerUrl) {
        setBannerPreview(activeRequest.bannerUrl);
      }

      if (activeRequest.logoUrl) {
        setLogoPreview(activeRequest.logoUrl);
      }

      // Store request ID for update
      setExistingRequestId((activeRequest as any)._id);
    }
  }, [activeRequest]);

  // Handle banner file selection
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBannerFile(file);

    // Create preview URL for selected file
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setBannerPreview(objectUrl);
    }
  };

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);

    // Create preview URL for selected file
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      // Upload files to S3 if selected
      const bannerUrl = bannerFile ? await uploadToS3(bannerFile) : bannerPreview;
      const logoUrl = logoFile ? await uploadToS3(logoFile) : logoPreview;

      // Create request data
      const requestData = { bannerUrl, logoUrl, date: new Date().toLocaleDateString() };

      // If we have an existing request ID, include it for update
      if (existingRequestId) {
        Object.assign(requestData, { requestId: existingRequestId });
      }

      // Submit change request to API
      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("failedChanges"));
      }

      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        setFeedback({ type: "success", message: t("changesSent") });
      }
    } catch (error: any) {
      console.error("Error submitting changes:", error);
      setFeedback({ type: "error", message: error.message || t("errorSubmittingChanges") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="fixed inset-x-0 top-0 bottom-[92px] z-[60] h-[calc(100vh-92px)] bg-white overflow-y-auto sm:rounded-lg w-full max-w-full md:top-12 md:bottom-auto md:h-auto md:max-h-[90vh] md:mx-auto md:left-0 md:right-0 md:w-[805px] border border-gray-200">
      <Card className="rounded-lg shadow-sm w-full border border-gray-200">
        <CardContent className="flex flex-col py-4 sm:py-7 px-6 sm:px-8 w-full bg-white rounded-lg">
          {/* Header */}
          <header className="flex justify-between items-center">
            <h1 className="text-lg sm:text-xl font-medium text-black">{t("changeBannerAndLogo")}</h1>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#f0f0f0] transition-colors absolute top-2 right-2"
                aria-label="Close"
              >
                <Image
                  src="/icons/Close.png"
                  alt="Close"
                  width={24}
                  height={24}
                  className="sm:w-[30px] sm:h-[30px] object-contain"
                />
              </button>
            )}
          </header>

          {/* Thin line */}
          <hr className="mt-4 sm:mt-7 h-px border-t border-solid border-stone-300" />

          <div className="mt-8 w-full pl-1">
            {/* Banner upload section */}
            <div className="flex items-start">
              {/* Upload icon in gray circle, aligned with text */}
              <div className="flex-shrink-0 mr-3 w-[44px] h-[44px] bg-[#D9D9D9] rounded-full flex items-center justify-center self-start mt-0">
                <Image src="/icons/Upload.png" alt="Banner upload" width={24} height={24} className="object-contain" />
              </div>

              <div className="flex-grow">
                <h2 className="text-base font-medium text-black">{t("uploadBanner")}</h2>
                <p className="mt-8 text-sm text-stone-500">
                  {t("addHighQualitybanner")}
                  <br className="hidden sm:block" />
                  {t("suggestedImages")}
                </p>

                {/* Banner preview */}
                {bannerPreview && (
                  <div className="relative w-full max-w-[500px] h-[80px] sm:h-[100px] mt-8 rounded-md overflow-hidden">
                    <Image src={bannerPreview} alt="Banner preview" fill style={{ objectFit: "cover" }} />
                  </div>
                )}

                {/* Banner upload button - left-aligned and fixed width */}
                <label className="inline-block mt-8 py-2 px-3 w-[152px] text-center text-xs sm:text-sm font-bold rounded-3xl border border-solid border-zinc-400 text-zinc-400 cursor-pointer">
                  {t("uploadPhoto")}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerChange}
                    disabled={isSubmitting}
                  />
                </label>
              </div>
            </div>

            {/* Logo upload section */}
            <div className="flex items-start mt-12">
              {/* Upload icon in gray circle, aligned with text */}
              <div className="flex-shrink-0 mr-3 w-[44px] h-[44px] bg-[#D9D9D9] rounded-full flex items-center justify-center self-start mt-0">
                <Image src="/icons/Upload.png" alt="Logo upload" width={24} height={24} className="object-contain" />
              </div>

              <div className="flex-grow">
                <h2 className="text-base font-medium text-black">{t("uploadLogo")}</h2>
                <p className="mt-8 text-sm text-stone-500">{t("addHighQualityLogo")}</p>

                {/* Logo preview */}
                {logoPreview && (
                  <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] mt-8 rounded-full overflow-hidden bg-white border border-gray-200">
                    <Image src={logoPreview} alt="Logo preview" fill style={{ objectFit: "contain", padding: "5px" }} />
                  </div>
                )}

                {/* Logo upload button - left-aligned and fixed width */}
                <label className="inline-block mt-8 py-2 px-3 w-[152px] text-center text-xs sm:text-sm font-bold rounded-3xl border border-solid border-zinc-400 text-zinc-400 cursor-pointer">
                  {t("uploadPhoto")}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                    disabled={isSubmitting}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Feedback message */}
          {feedback && (
            <div
              className={`mt-4 p-3 rounded-md text-sm sm:text-base
                ${feedback.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
              role="alert"
            >
              {feedback.message}
            </div>
          )}

          {/* Regular bottom line */}
          <hr className="mt-6 sm:mt-11 h-px border-t border-solid border-stone-300" />

          {/* Footer with submit button */}
          <footer className="flex justify-end mt-5">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`py-2.5 px-5 text-base font-bold text-white 
                ${isSubmitting ? "bg-blue-400" : "bg-[#405BA9] hover:bg-[#293241]"}
                rounded-3xl flex items-center justify-center min-h-10`}
            >
              {isSubmitting ? <span className="animate-pulse">{t("saving")}</span> : "Submit Changes"}
            </Button>
          </footer>
        </CardContent>
      </Card>
    </article>
  );
}
