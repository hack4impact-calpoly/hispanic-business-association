"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import MembershipExpirationAlert from "@/components/ui/MembershipExpirationAlert";
import BusinessInfoCard from "@/components/ui/BusinessInfoCard";
import ContactInfoCard from "@/components/ui/ContactInfoCard";
import AboutCard from "@/components/ui/AboutCard";
import { useIsMobile } from "@/hooks/use-mobile";

// INTERFACE: Business data structure - expanded to include banner customization options
interface BusinessData {
  businessName: string;
  memberSince: string;
  expiresInMonths?: number;
  bannerImage?: string; // URL for custom banner image
  bannerColor?: string; // HEX code for banner background color
}

export default function BusinessDashboardPage() {
  // STATE: Track business data and loading state for API driven content
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  // EFFECT: Fetch business data from API - handles loading states and error cases
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        // Replace with actual API endpoint when available
        const response = await fetch("/api/business");

        if (response.ok) {
          const data = await response.json();
          setBusinessData(data);
        } else {
          console.error("Failed to fetch business data");

          // DEMO: For demonstration, set mock data with the banner image
          setBusinessData({
            businessName: "HALO Hair Studio",
            memberSince: "November 2023",
            expiresInMonths: 1,
            bannerImage: "/logo/Banner_Demo.png",
          });
        }
      } catch (error) {
        console.error("Error fetching business data:", error);

        // DEMO: For demonstration, set mock data with the banner image - DELETE AFTER DEMO
        // TODO: Remove this mock data after demo and rely on actual API responses
        setBusinessData({
          businessName: "HALO Hair Studio",
          memberSince: "November 2023",
          expiresInMonths: 1,
          bannerImage: "/logo/Banner_Demo.png",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  // HANDLER: Handle renewal button click - stub for future implementation
  const handleRenewClick = () => {
    console.log("Renewal requested");
    // Future implementation: Navigate to renewal page or open modal
  };

  return (
    <ResponsiveLayout title="Dashboard">
      <main className="w-full bg-white min-h-screen overflow-x-hidden pb-[142px]">
        {" "}
        {/* 92px navbar + 50px leeway */}
        {/* Cover Image Section - conditional rendering based on data availability */}
        <section
          className="relative w-full h-[193px]"
          style={{ backgroundColor: businessData?.bannerColor || "#293241" }}
        >
          {/* DEMO: Using the Banner_Demo.png from public/logo directory - DELETE AFTER DEMO */}
          {/* TODO: Remove hardcoded banner and restore conditional rendering based on businessData */}
          <Image src="/logo/Banner_Demo.png" alt="Business Cover" fill style={{ objectFit: "cover" }} priority />

          {/* Profile Logo - positioned to overlap banner with negative bottom margin */}
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
        {/* Content Section - constrained width container for consistent spacing */}
        <div className="container mx-auto px-6 md:px-8 max-w-7xl mt-28">
          {/* Welcome Section - conditional rendering based on loading state */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
            <h2 className="text-2xl">Welcome, {loading ? "..." : businessData?.businessName || "Business Owner"}</h2>
            <p className="text-sm text-zinc-500 mt-1 md:mt-0 pr-5">
              Member since {loading ? "..." : businessData?.memberSince || "November 2023"}
            </p>
          </section>

          {/* Membership Alert - container disappears when alert isn't shown. Content will shift up */}
          <div className="mb-7 w-full">
            <MembershipExpirationAlert expiresInMonths={1} onRenewClick={handleRenewClick} />
          </div>

          {/* About Section - full width card for business description */}
          <div className="mb-6 w-full">
            <AboutCard />
          </div>

          {/* Information Cards - grid layout ensures equal widths and responsive stacking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-16 mb-10">
            <BusinessInfoCard />
            <ContactInfoCard />
          </div>
        </div>
      </main>
    </ResponsiveLayout>
  );
}
