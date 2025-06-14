"use client";

import React from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import AboutCard from "@/components/ui/BusinessPreviewComponents/AboutCard";
import BusinessInfoCard from "@/components/ui/BusinessPreviewComponents/BusinessInfoCard";
import ContactInfoCard from "@/components/ui/BusinessPreviewComponents/ContactInfoCard";
import { useBusinessById } from "@/hooks/swrHooks";
import { extractBusinessDisplayData } from "@/lib/formatters";
import { Button } from "@/components/ui/shadcnComponents/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import EditPaymentMessage from "@/components/ui/GeneralAdminComponents/EditPaymentMessage";
import EditPayment from "@/components/ui/GeneralAdminComponents/EditPayment";

export default function BusinessDetailsPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const businessId = params?.id as string;

  // Default image URLs for fallbacks
  const defaultLogo = "/logo/Default_Logo.png";
  const defaultBanner = "/logo/Default_Banner.png";

  // Fetch business data
  const { business, isLoading: isBusinessLoading, mutate } = useBusinessById(businessId);

  // Process business data for display
  const displayData = extractBusinessDisplayData(business);
  const [showLastPay, setShowLastPay] = useState(false);
  const [showEditExpiry, setShowEditExpiry] = useState(false);

  // Extract dates directly from business object
  const lastPaidDate = business?.lastPayDate;
  const expiryDate = business?.membershipExpiryDate;

  const handleEditLastPayClick = () => {
    setShowLastPay(true);
  };

  const handleEditLastPayClose = () => {
    setShowLastPay(false);
  };

  const handleEditLastPaySubmit = () => {
    setShowLastPay(false);
    mutate();
  };

  const handleEditExpiryClick = () => {
    setShowEditExpiry(true);
  };

  const handleEditExpiryClose = () => {
    setShowEditExpiry(false);
  };

  const handleEditExpirySubmit = () => {
    setShowEditExpiry(false);
    mutate();
  };

  // Handle business not found
  if (!business) {
    return (
      <ResponsiveLayout title={t("bizDetails")}>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500">{t("bizNotFound")}</p>
        </div>
      </ResponsiveLayout>
    );
  }

  // Handle back button click
  const handleBackClick = () => {
    router.push("/admin");
  };

  const getExpiry = () => {
    let expiryFormat;
    if (expiryDate) {
      let expiry = new Date(expiryDate);
      expiryFormat = expiry.toLocaleDateString();
    } else {
      expiryFormat = t("notSet");
    }
    return expiryFormat;
  };

  const getLastPay = () => {
    let lastPayFormat;
    if (lastPaidDate) {
      let lastPay = new Date(lastPaidDate);
      lastPayFormat = lastPay.toLocaleDateString();
    } else {
      lastPayFormat = t("notSet");
    }
    return lastPayFormat;
  };

  return (
    <ResponsiveLayout title={t("bizDetails")}>
      <main className="w-full bg-white min-h-screen overflow-x-hidden pb-[142px]">
        {/* Header Section with Back Button */}
        <div className="container mx-auto pt-6 px-6 md:px-8 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={handleBackClick}
              className="flex items-center gap-2 bg-transparent text-[#405BA9] hover:bg-gray-100"
            >
              <span className="text-xl">←</span> {t("backToBiz")}
            </Button>
          </div>
        </div>

        {/* Cover Image Section */}
        <section className="relative w-full h-[193px]" style={{ backgroundColor: "#293241" }}>
          <Image
            src={business?.bannerUrl || defaultBanner}
            alt="Business Cover"
            fill
            style={{ objectFit: "cover" }}
            priority
            onError={(e) => {
              // Fallback to default on error
              const target = e.target as HTMLImageElement;
              target.src = defaultBanner;
            }}
          />

          {/* Profile Logo */}
          <div className="absolute bottom-[-75px] left-[65px]">
            <div className="relative w-[150px] h-[150px] rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
              <Image
                src={business?.logoUrl || defaultLogo}
                alt="Business Logo"
                fill
                style={{ objectFit: "contain" }}
                className="p-2"
                onError={(e) => {
                  // Fallback to default on error
                  const target = e.target as HTMLImageElement;
                  target.src = defaultLogo;
                }}
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="container mx-auto px-6 md:px-8 max-w-7xl mt-28">
          {/* Business Name Section */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
            <h2 className="text-2xl">{displayData?.businessInfo.businessName || t("businessName")}</h2>
          </section>

          <div className="mb-7 w-full">
            <EditPaymentMessage dateType="lastPay" date={getLastPay()} onClick={handleEditLastPayClick} />
          </div>

          <div className="mb-7 w-full">
            <EditPaymentMessage dateType="expiry" date={getExpiry()} onClick={handleEditExpiryClick} />
          </div>

          {/* About Section */}
          <div className="mb-6 w-full">
            <AboutCard info={{ description: displayData?.about.description || "" }} editable={false} />
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-16 mb-10">
            <BusinessInfoCard
              info={
                displayData?.businessInfo
                  ? {
                      ...displayData.businessInfo,
                      physicalAddress: {
                        ...displayData.businessInfo.physicalAddress,
                        zip: Number(displayData.businessInfo.physicalAddress.zip),
                      },
                      mailingAddress: {
                        ...displayData.businessInfo.mailingAddress,
                        zip: Number(displayData.businessInfo.mailingAddress.zip),
                      },
                    }
                  : undefined
              }
              editable={false}
            />
            <ContactInfoCard info={displayData?.contactInfo} editable={false} />
          </div>
        </div>
      </main>

      {showLastPay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex w-full h-full items-start sm:items-center justify-center z-50 p-0 top-0 sm:p-4 overflow-y-auto">
          <EditPayment
            dateType="lastPaid"
            bizId={businessId}
            onClose={handleEditLastPayClose}
            onSubmitSuccess={handleEditLastPaySubmit}
          />
        </div>
      )}

      {showEditExpiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex w-full h-full items-start sm:items-center justify-center z-50 p-0 top-0 sm:p-4 overflow-y-auto">
          <EditPayment
            dateType="expiry"
            bizId={businessId}
            onClose={handleEditExpiryClose}
            onSubmitSuccess={handleEditExpirySubmit}
          />
        </div>
      )}
    </ResponsiveLayout>
  );
}
