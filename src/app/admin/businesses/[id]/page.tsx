"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import AboutCard from "@/components/ui/AboutCard";
import BusinessInfoCard from "@/components/ui/BusinessInfoCard";
import ContactInfoCard from "@/components/ui/ContactInfoCard";
import { useBusinessById, useUser } from "@/lib/swrHooks";
import { extractBusinessDisplayData } from "@/lib/formatters";
import { Button } from "@/components/ui/button";

export default function BusinessDetailsPage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const params = useParams();
  const businessId = params?.id as string;

  // Default image URLs for fallbacks
  const defaultLogo = "/logo/Default_Logo.jpg";
  const defaultBanner = "/logo/Default_Banner.png";

  // Check user authentication
  const { user, isLoading: isUserLoading } = useUser();

  // Fetch business data
  const { business, isLoading: isBusinessLoading } = useBusinessById(businessId);

  // Process business data for display
  const displayData = extractBusinessDisplayData(business);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle authentication checks
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
  if (isBusinessLoading || !isClient) {
    return (
      <ResponsiveLayout title="Business Details">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500">Loading business details...</p>
        </div>
      </ResponsiveLayout>
    );
  }

  // Handle business not found
  if (!business) {
    return (
      <ResponsiveLayout title="Business Details">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500">Business not found.</p>
        </div>
      </ResponsiveLayout>
    );
  }

  // Handle back button click
  const handleBackClick = () => {
    router.push("/admin");
  };

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
            <h2 className="text-2xl">{displayData?.businessInfo.name || "Business Name"}</h2>
          </section>

          {/* About Section */}
          <div className="mb-6 w-full">
            <AboutCard info={{ description: displayData?.about.description || "" }} editable={false} />
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-16 mb-10">
            <BusinessInfoCard info={displayData?.businessInfo} editable={false} />
            <ContactInfoCard info={displayData?.contactInfo} editable={false} />
          </div>
        </div>
      </main>
    </ResponsiveLayout>
  );
}
