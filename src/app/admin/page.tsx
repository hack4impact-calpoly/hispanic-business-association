"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import BusinessCard from "@/components/ui/BusinessCard";
import FilterButton from "@/components/ui/FilterButton";
import { useBusinesses, useUser } from "@/lib/swrHooks";
import { SignInButton } from "@clerk/nextjs";

type FilterType = "Business Name A-Z" | "Business Name Z-A" | "Most Recent" | "Oldest";

export default function AdminBusinessesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("Business Name A-Z");
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch data using SWR hooks
  const { user, isLoading: isUserLoading } = useUser();
  const { businesses, isLoading: isBusinessesLoading } = useBusinesses();

  // Handle authentication checks with a delay to prevent immediate redirects
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

  // Apply filter to businesses
  const filteredBusinesses = () => {
    if (!businesses) return [];

    const sorted = [...businesses];

    switch (filter) {
      case "Business Name A-Z":
        return sorted.sort((a, b) => a.businessName.localeCompare(b.businessName));
      case "Business Name Z-A":
        return sorted.sort((a, b) => b.businessName.localeCompare(a.businessName));
      case "Most Recent":
        return sorted.sort((a, b) => b.businessName.localeCompare(a.businessName));
      case "Oldest":
        return sorted.sort((a, b) => a.businessName.localeCompare(a.businessName));
      default:
        return sorted;
    }
  };

  // Split businesses into two columns for desktop
  const businessList = filteredBusinesses();
  const midpoint = Math.ceil(businessList.length / 2);
  const leftColumnBusinesses = businessList.slice(0, midpoint);
  const rightColumnBusinesses = businessList.slice(midpoint);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter as FilterType);
  };

  // Show sign-in UI if not authenticated
  if (isClient && !isUserLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Authentication Required</h2>
          <p className="mb-6 text-gray-600 text-center">You need to be signed in as an admin to view this page.</p>
          <div className="flex justify-center">
            <SignInButton mode="modal">
              <button className="bg-[#405BA9] text-white px-6 py-2 rounded-md hover:bg-[#293241]">Sign In</button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <ResponsiveLayout title="Dashboard">
      <div className="relative min-h-screen bg-white px-2 sm:px-4 md:px-6 py-4 sm:py-6 pb-[142px] md:pb-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header with Filter */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 w-full px-0">
            <h2 className="font-futura font-medium text-xl sm:text-[26px] leading-[34.53px] text-black">Businesses</h2>
            <FilterButton onFilterChange={handleFilterChange} selectedFilter={filter} />
          </div>

          {/* Loading State */}
          {isBusinessesLoading && (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-500">Loading businesses...</p>
            </div>
          )}

          {/* No Businesses State */}
          {!isBusinessesLoading && (!businesses || businesses.length === 0) && (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-500">No businesses found.</p>
            </div>
          )}

          {/* Businesses Grid - Desktop: Two columns, Mobile: Single column */}
          {!isBusinessesLoading && businesses && businesses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 gap-y-0">
              {/* Left Column */}
              <div>
                {leftColumnBusinesses.map((business) => (
                  <div key={business.clerkUserID} className="mb-3 sm:mb-4 md:mb-6 w-full">
                    <BusinessCard
                      id={business.clerkUserID}
                      businessName={business.businessName}
                      logoUrl="/logo/HBA_NoBack_NoWords.png"
                      logoAlt={`${business.businessName} logo`}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div>
                {rightColumnBusinesses.map((business) => (
                  <div key={business.clerkUserID} className="mb-3 sm:mb-4 md:mb-6 w-full">
                    <BusinessCard
                      id={business.clerkUserID}
                      businessName={business.businessName}
                      logoUrl="/logo/HBA_NoBack_NoWords.png"
                      logoAlt={`${business.businessName} logo`}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
}
