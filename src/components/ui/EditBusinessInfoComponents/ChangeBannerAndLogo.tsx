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
  // Store selected image files
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Set image preview URLs
  const [bannerPreview, setBannerPreview] = useState<string>(initialBannerUrl);
  const [logoPreview, setLogoPreview] = useState<string>(initialLogoUrl);

  // Store original URLs for comparison
  const [originalBannerUrl, setOriginalBannerUrl] = useState<string>(initialBannerUrl);
  const [originalLogoUrl, setOriginalLogoUrl] = useState<string>(initialLogoUrl);

  // Monitor file selection changes
  const [bannerChangedByFile, setBannerChangedByFile] = useState(false);
  const [logoChangedByFile, setLogoChangedByFile] = useState(false);

  // Control submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hold response feedback with info type
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Fetch active request if exists
  const { activeRequest, isLoading: isRequestLoading } = useActiveBusinessRequest();

  // Store request ID if one exists
  const [existingRequestId, setExistingRequestId] = useState<string | undefined>(undefined);

  // Load image URLs from active request or defaults
  useEffect(() => {
    if (activeRequest) {
      const currentBanner = activeRequest.bannerUrl || initialBannerUrl;
      const currentLogo = activeRequest.logoUrl || initialLogoUrl;

      setBannerPreview(currentBanner);
      setLogoPreview(currentLogo);
      setOriginalBannerUrl(currentBanner);
      setOriginalLogoUrl(currentLogo);
      setExistingRequestId((activeRequest as any)._id);
    } else {
      setBannerPreview(initialBannerUrl);
      setLogoPreview(initialLogoUrl);
      setOriginalBannerUrl(initialBannerUrl);
      setOriginalLogoUrl(initialLogoUrl);
    }
  }, [activeRequest, initialBannerUrl, initialLogoUrl]);

  // Process banner file selection
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBannerFile(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setBannerPreview(objectUrl);
      setBannerChangedByFile(true);
      if (feedback) setFeedback(null);
    }
  };

  // Process logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
      setLogoChangedByFile(true);
      if (feedback) setFeedback(null);
    }
  };

  // Submit image changes
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      let finalBannerUrl = bannerPreview;
      let finalLogoUrl = logoPreview;

      if (bannerFile) {
        const uploadedUrl = await uploadToS3(bannerFile);
        if (uploadedUrl) {
          finalBannerUrl = uploadedUrl;
        }
      }

      if (logoFile) {
        const uploadedUrl = await uploadToS3(logoFile);
        if (uploadedUrl) {
          finalLogoUrl = uploadedUrl;
        }
      }

      const requestData: any = {
        date: new Date().toLocaleDateString(),
      };
      let hasChanges = false;

      if (bannerChangedByFile || finalBannerUrl !== originalBannerUrl) {
        requestData.bannerUrl = finalBannerUrl;
        hasChanges = true;
      }

      if (logoChangedByFile || finalLogoUrl !== originalLogoUrl) {
        requestData.logoUrl = finalLogoUrl;
        hasChanges = true;
      }

      if (!hasChanges) {
        setFeedback({ type: "info", message: t("noChangesDetected") });
        setIsSubmitting(false);
        return;
      }

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

      if (requestData.bannerUrl !== undefined) setOriginalBannerUrl(requestData.bannerUrl);
      if (requestData.logoUrl !== undefined) setOriginalLogoUrl(requestData.logoUrl);

      setBannerFile(null);
      setLogoFile(null);
      setBannerChangedByFile(false);
      setLogoChangedByFile(false);

      if (requestData.bannerUrl !== undefined) setBannerPreview(requestData.bannerUrl);
      if (requestData.logoUrl !== undefined) setLogoPreview(requestData.logoUrl);

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

  // Display loading indicator
  if (isRequestLoading) {
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
    <article className="fixed inset-x-0 top-0 bottom-[92px] z-[60] h-[calc(100vh-92px)] bg-white overflow-y-auto sm:rounded-lg w-full max-w-full md:top-12 md:bottom-auto md:h-auto md:max-h-[90vh] md:mx-auto md:left-0 md:right-0 md:w-[805px] border border-gray-200">
      <Card className="rounded-lg shadow-sm w-full border-none">
        <CardContent className="flex flex-col py-4 sm:py-7 px-4 sm:px-8 w-full bg-white rounded-lg">
          <header className="flex justify-between items-center">
            <h1 className="text-lg sm:text-xl font-medium text-black">{t("changeBannerAndLogo")}</h1>
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
                  className="sm:w-[30px] sm:h-[30px] object-contain"
                />
              </button>
            )}
          </header>

          <hr className="mt-4 sm:mt-7 h-px border-t border-solid border-stone-300" />

          <div className="mt-6 sm:mt-8 w-full">
            {/* Banner upload section */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] bg-[#D9D9D9] rounded-full flex items-center justify-center self-start">
                <Image
                  src="/icons/BusinessPreviewAndEdit/Upload.png"
                  alt="Banner upload"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-base font-medium text-black">{t("uploadBanner")}</h2>
                <p className="mt-2 sm:mt-3 text-sm text-stone-500">
                  {t("addHighQualitybanner")}
                  <br className="hidden sm:block" />
                  {t("suggestedImages")}
                </p>
                {bannerPreview && (
                  <div className="relative w-full max-w-[450px] sm:max-w-[500px] h-[70px] sm:h-[100px] mt-3 sm:mt-4 rounded-md overflow-hidden border">
                    <Image src={bannerPreview} alt="Banner preview" fill style={{ objectFit: "cover" }} />
                  </div>
                )}
                <label className="inline-block mt-3 sm:mt-4 py-2 px-3 w-[140px] sm:w-[152px] text-center text-xs sm:text-sm font-bold rounded-3xl border border-solid border-zinc-400 text-zinc-400 cursor-pointer hover:bg-gray-50">
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
            <div className="flex items-start mt-8 sm:mt-10">
              <div className="flex-shrink-0 mr-3 w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] bg-[#D9D9D9] rounded-full flex items-center justify-center self-start">
                <Image
                  src="/icons/BusinessPreviewAndEdit/Upload.png"
                  alt="Logo upload"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-base font-medium text-black">{t("uploadLogo")}</h2>
                <p className="mt-2 sm:mt-3 text-sm text-stone-500">{t("addHighQualityLogo")}</p>
                {logoPreview && (
                  <div className="relative w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] mt-3 sm:mt-4 rounded-full overflow-hidden bg-white border border-gray-300">
                    <Image src={logoPreview} alt="Logo preview" fill style={{ objectFit: "contain", padding: "5px" }} />
                  </div>
                )}
                <label className="inline-block mt-3 sm:mt-4 py-2 px-3 w-[140px] sm:w-[152px] text-center text-xs sm:text-sm font-bold rounded-3xl border border-solid border-zinc-400 text-zinc-400 cursor-pointer hover:bg-gray-50">
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

          {feedback && (
            <div
              className={`mt-4 p-2 md:p-3 rounded-md text-sm sm:text-base
               ${feedback.type === "success" ? "bg-green-50 text-green-800" : feedback.type === "error" ? "bg-red-50 text-red-800" : "bg-blue-50 text-blue-800"}`}
              role="alert"
            >
              {feedback.message}
            </div>
          )}

          <hr className="mt-6 sm:mt-8 h-px border-t border-solid border-stone-300" />

          <footer className="flex justify-end mt-4 sm:mt-5">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isRequestLoading}
              className={`py-2 px-4 sm:py-2.5 sm:px-5 text-sm sm:text-base font-bold text-white 
               ${isSubmitting || isRequestLoading ? "bg-blue-400 cursor-not-allowed" : "bg-[#405BA9] hover:bg-[#293241]"}
               rounded-3xl flex items-center justify-center min-h-[36px] sm:min-h-10 transition-colors`}
            >
              {isSubmitting ? <span className="animate-pulse">{t("saving")}</span> : t("submitChanges")}
            </Button>
          </footer>
        </CardContent>
      </Card>
    </article>
  );
}
