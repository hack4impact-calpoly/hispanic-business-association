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
import { useRouter } from "next/navigation";
import { useBusiness } from "@/lib/swrHooks";
import { extractBusinessDisplayData } from "@/lib/formatters";
import { useUser } from "@clerk/nextjs";

export default function BusinessDashboardPage() {
  // State for UI components
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { isLoaded, user } = useUser();

  // Fetch current user's business data
  const { business, isLoading, mutate } = useBusiness(isLoaded ? undefined : null);

  // Process business data for display
  const displayData = extractBusinessDisplayData(business);

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
    <ResponsiveLayout title="Dashboard">
      <main className="w-full bg-white min-h-screen overflow-x-hidden pb-[142px]">
        {/* Cover Image Section */}
        <section className="relative w-full h-[193px]" style={{ backgroundColor: "#293241" }}>
          <Image src="/logo/Banner_Demo.png" alt="Business Cover" fill style={{ objectFit: "cover" }} priority />

          {/* Profile Logo */}
          <div className="absolute bottom-[-75px] left-[65px]">
            <div className="relative w-[150px] h-[150px] rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
              <Image
                src="/logo/HBA_NoBack_NoWords.png"
                alt="Business Logo"
                fill
                style={{ objectFit: "contain" }}
                className="p-2"
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="container mx-auto px-6 md:px-8 max-w-7xl mt-28">
          {/* Welcome Section */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
            <h2 className="text-2xl">
              {loading ? "Welcome..." : `Welcome, ${displayData?.businessInfo.name || "Business Owner"}`}
            </h2>
            <p className="text-sm text-zinc-500 mt-1 md:mt-0 pr-5">
              Member since {displayData?.membership.memberSince || "November 2023"}
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
            <BusinessInfoCard info={displayData?.businessInfo} editable={true} />
            <ContactInfoCard info={displayData?.contactInfo} editable={true} />
          </div>
        </div>
      </main>

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

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ChangeRequestConfirmation onClose={handleConfirmationClose} onBackToHome={handleBackToHome} />
        </div>
      )}
    </ResponsiveLayout>
  );
}
