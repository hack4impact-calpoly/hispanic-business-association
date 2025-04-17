"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import AboutCard from "@/components/ui/AboutCard";
import BusinessInfoCard from "@/components/ui/BusinessInfoCard";
import ContactInfoCard from "@/components/ui/ContactInfoCard";
import { useBusinessById, useUser } from "@/lib/swrHooks";
import { extractBusinessDisplayData } from "@/lib/formatters";
import { Button } from "@/components/ui/button";

export default function AdminBusinessDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Check if we're in the browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user data to verify admin role
  const { user, isLoading: isUserLoading } = useUser();

  // Fetch business data by ID
  const { business, isLoading: isBusinessLoading } = useBusinessById(params.id);

  // Process business data for display
  const displayData = extractBusinessDisplayData(business);

  // Redirect non-admin users to appropriate page
  useEffect(() => {
    if (!isClient) return;

    const timer = setTimeout(() => {
      if (!isUserLoading && !user) {
        router.push("/");
      } else if (user && user.role !== "admin") {
        router.push("/business");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [user, isUserLoading, isClient, router]);

  // Loading state
  if (isUserLoading || isBusinessLoading) {
    return (
      <ResponsiveLayout title="Business Details">
        <div className="w-full min-h-screen bg-white pt-8 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Loading business details...</h2>
            </div>
            <div className="animate-pulse space-y-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-80 bg-gray-200 rounded"></div>
                <div className="h-80 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  // Handle back button click
  const handleBackClick = () => {
    router.push("/admin");
  };

  // Handle not found state
  if (!displayData) {
    return (
      <ResponsiveLayout title="Business Not Found">
        <div className="container mx-auto max-w-7xl pt-8 px-6">
          <div className="text-center py-10">
            <h2 className="text-2xl font-medium text-gray-700 mb-4">Business Not Found</h2>
            <p className="text-gray-500 mb-6">
              The business you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
            <Button onClick={handleBackClick} className="bg-[#405BA9] text-white px-6 py-2 rounded-full">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="Business Details">
      <main className="w-full bg-white min-h-screen overflow-x-hidden pb-[142px]">
        {/* Header Section with Back Button */}
        <div className="container mx-auto pt-6 px-6 md:px-8 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={handleBackClick}
              className="flex items-center gap-2 bg-transparent text-[#405BA9] hover:bg-gray-100"
            >
              <span className="text-xl">←</span> Back to Businesses
            </Button>
          </div>
        </div>

        {/* Business Banner */}
        <section className="relative w-full h-[193px]" style={{ backgroundColor: "#293241" }}>
          <Image src="/logo/Default_Banner.png" alt="Business Cover" fill style={{ objectFit: "cover" }} priority />

          {/* Business Logo */}
          <div className="absolute bottom-[-75px] left-[65px]">
            <div className="relative w-[150px] h-[150px] rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
              <Image
                src="/logo/Default_Logo.jpg"
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
          {/* Business Name Header */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold">{displayData.businessInfo.name}</h2>
              <p className="text-gray-600">{displayData.businessInfo.type}</p>
            </div>
            <p className="text-sm text-zinc-500 mt-2 md:mt-0">Member since {displayData.membership.memberSince}</p>
          </section>

          {/* About Section */}
          <div className="mb-6 w-full">
            <AboutCard info={{ description: displayData.about.description }} editable={false} />
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-16 mb-10">
            <BusinessInfoCard info={displayData.businessInfo} editable={false} />
            <ContactInfoCard info={displayData.contactInfo} editable={false} />
          </div>
        </div>
      </main>
    </ResponsiveLayout>
  );
}
