"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import MembershipExpirationAlert from "@/components/ui/MembershipExpirationAlert";
import BusinessInfoCard from "@/components/ui/BusinessInfoCard";
import ContactInfoCard from "@/components/ui/ContactInfoCard";
import AboutCard from "@/components/ui/AboutCard";
import EditAboutForm from "@/components/ui/EditAboutForm";
import ChangeRequestConfirmation from "@/components/ui/ChangeRequestConfirmation";
import ChangeBannerAndLogo from "@/components/ui/ChangeBannerAndLogo";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/lib/swrHooks";
import { extractBusinessDisplayData } from "@/lib/formatters";
import { useUser } from "@clerk/nextjs";
import EditBusinessInfo from "@/components/ui/EditBusinessInfo";
import EditBusinessInfoForm from "@/components/ui/EditContactInfo";
import EditContactInfo from "@/components/ui/EditContactInfo";
import { useTranslations } from "next-intl";

export default function BusinessDashboardPage() {
  const t = useTranslations();

  // State for UI components
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEditBiz, setShowEditBiz] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);
  const [showEditBannerAndLogo, setShowEditBannerAndLogo] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { isLoaded, user } = useUser();

  // Fetch current user's business data
  const { business, isLoading, mutate } = useBusiness(isLoaded ? undefined : null);

  // Process business data for display
  const displayData = extractBusinessDisplayData(business);

  // Default image URLs for fallbacks
  const defaultLogo = "/logo/Default_Logo.jpg";
  const defaultBanner = "/logo/Default_Banner.png";

  // Handle loading state
  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  // Handle edit form display
  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleEditBannerClick = () => {
    setShowEditBannerAndLogo(true);
  };

  const handleEditBannerClose = () => {
    setShowEditBannerAndLogo(false);
  };

  const handleEditBizClick = () => {
    setShowEditBiz(true);
  };

  const handleEditBizClose = () => {
    setShowEditBiz(false);
  };

  const handleEditContactClick = () => {
    setShowEditContact(true);
  };

  const handleEditContactClose = () => {
    setShowEditContact(false);
  };
  // Handle edit form close
  const handleEditClose = () => {
    setShowEditForm(false);
  };

  // Handle edit form submission
  const handleEditSubmit = () => {
    setShowEditForm(false);
    setShowConfirmation(true);
    // Refresh business data
    mutate();
  };

  const handleBannerAndLogoSubmit = () => {
    setShowEditBannerAndLogo(false); // Close the banner modal
    setShowConfirmation(true); // Show confirmation
    // Refresh business data
    mutate();
  };

  // Handle confirmation close
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  // Handle back to home button on confirmation
  const handleBackToHome = () => {
    setShowConfirmation(false);
    router.push("/business");
  };

  // Handle renewal button click
  const handleRenewClick = () => {
    console.log("Renewal requested");
    // Future implementation: Navigate to renewal page or open modal
  };

  return (
    <ResponsiveLayout title={t("dashboard")}>
      <main className="w-full bg-white min-h-screen overflow-x-hidden pb-[142px]">
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

          {/* Edit Banner Button */}
          <button
            onClick={handleEditBannerClick}
            className="absolute top-4 right-4 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all"
            aria-label="Edit banner and logo"
          >
            <Image src="/icons/Edit.png" alt="Edit" width={16} height={16} />
          </button>

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
          {/* Welcome Section */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
            <h2 className="text-2xl">
              {loading
                ? `${t("welcome")}...`
                : `${t("welcome")}, ${displayData?.businessInfo.name || t("businessOwner")}`}
            </h2>
            <p className="text-sm text-zinc-500 mt-1 md:mt-0 pr-5">
              {t("memberSince")} {displayData?.membership.memberSince || "November 2023"}
            </p>
          </section>

          {/* Membership Alert */}
          <div className="mb-7 w-full">
            <MembershipExpirationAlert
              expiresInMonths={displayData?.membership.expiresInMonths || 1}
              onRenewClick={handleRenewClick}
            />
          </div>

          {/* About Section */}
          <div className="mb-6 w-full">
            <AboutCard
              info={{ description: displayData?.about.description || "" }}
              editable={true}
              onEditClick={handleEditClick}
            />
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-16 mb-10">
            <BusinessInfoCard info={displayData?.businessInfo} editable={true} onEditClick={handleEditBizClick} />
            <ContactInfoCard info={displayData?.contactInfo} editable={true} onEditClick={handleEditContactClick} />
          </div>
        </div>
      </main>

      {/* Edit Banner and Logo Modal */}
      {showEditBannerAndLogo && (
        <div className="fixed inset-x-0 top-0 bottom-[92px] z-[60] h-[calc(100vh-92px)] bg-black bg-opacity-50 flex w-full items-start sm:items-center justify-center overflow-y-auto sm:inset-0 sm:h-auto sm:p-4">
          <ChangeBannerAndLogo
            onClose={handleEditBannerClose}
            onSubmitSuccess={handleBannerAndLogoSubmit}
            initialBannerUrl={business?.bannerUrl || defaultBanner}
            initialLogoUrl={business?.logoUrl || defaultLogo}
          />
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <EditAboutForm
            onClose={handleEditClose}
            onSubmitSuccess={handleEditSubmit}
            initialDescription={displayData?.about.description || ""}
          />
        </div>
      )}

      {/*Edit Business Info Modal */}
      {showEditBiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex w-full items-start sm:items-center justify-center z-50 py-0 top-0 sm:p-4">
          <EditBusinessInfo onClose={handleEditBizClose} onSubmitSuccess={handleEditSubmit} />
        </div>
      )}

      {showEditContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex w-full h-full items-start sm:items-center justify-center z-50 p-0 top-0 sm:p-4 overflow-y-auto">
          <EditContactInfo onClose={handleEditContactClose} onSubmitSuccess={handleEditSubmit} />
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ChangeRequestConfirmation onClose={handleConfirmationClose} onBackToHome={handleBackToHome} />
        </div>
      )}
    </ResponsiveLayout>
  );
}
