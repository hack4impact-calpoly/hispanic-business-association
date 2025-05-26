"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import BusinessCard from "@/components/ui/GeneralAdminComponents/BusinessCard";
import FilterButton from "@/components/ui/GeneralAdminComponents/FilterButton";
import { useBusinesses } from "@/hooks/swrHooks";
import { useTranslations } from "next-intl";

type FilterType = "Business Name A-Z" | "Business Name Z-A" | "Most Recent" | "Oldest";

export default function AdminBusinessesPage() {
  const t = useTranslations();

  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("Business Name A-Z");

  // Fetch data using SWR hooks
  const { businesses, isLoading: isBusinessesLoading } = useBusinesses();

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
        // Sort by creation date if available, otherwise fallback to name
        return sorted.sort((a, b) => b.businessName.localeCompare(a.businessName));
      case "Oldest":
        // Sort by creation date if available, otherwise fallback to name
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

  // Handle business card click
  const handleBusinessClick = (id: string) => {
    router.push(`/admin/businesses/${id}`);
  };

  // Main content
  return (
    <ResponsiveLayout title={t("dashboard")}>
      <div className="relative min-h-screen bg-white px-2 sm:px-4 md:px-6 py-4 sm:py-6 pb-[142px] md:pb-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header with Filter */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 w-full px-0">
            <h2 className="font-futura font-medium text-xl sm:text-[26px] leading-[34.53px] text-black">
              {t("businesses")}
            </h2>
            <FilterButton onFilterChange={handleFilterChange} selectedFilter={filter} />
          </div>

          {/* Loading State */}
          {isBusinessesLoading && (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-500">{t("loadBiz")}</p>
            </div>
          )}

          {/* No Businesses State */}
          {!isBusinessesLoading && (!businesses || businesses.length === 0) && (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-500">{t("noBizFound")}</p>
            </div>
          )}

          {/* Businesses Grid - Desktop: Two columns, Mobile: Single column */}
          {!isBusinessesLoading && businesses && businesses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 gap-y-0">
              {/* Left Column */}
              <div>
                {leftColumnBusinesses.map((business) => {
                  // Safely access MongoDB document ID using type assertion or optional chaining
                  const businessId = (business as any)._id?.toString() || business.clerkUserID;

                  return (
                    <div key={businessId} className="mb-3 sm:mb-4 md:mb-6 w-full">
                      <BusinessCard
                        id={businessId}
                        businessName={business.businessName}
                        logoUrl={business.logoUrl || "/logo/Default_Logo.jpg"}
                        logoAlt={`${business.businessName} logo`}
                        className="w-full"
                        onClick={() => handleBusinessClick(businessId)}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Right Column */}
              <div>
                {rightColumnBusinesses.map((business) => {
                  // Safely access MongoDB document ID using type assertion or optional chaining
                  const businessId = (business as any)._id?.toString() || business.clerkUserID;

                  return (
                    <div key={businessId} className="mb-3 sm:mb-4 md:mb-6 w-full">
                      <BusinessCard
                        id={businessId}
                        businessName={business.businessName}
                        logoUrl={business.logoUrl || "/logo/Default_Logo.jpg"}
                        logoAlt={`${business.businessName} logo`}
                        className="w-full"
                        onClick={() => handleBusinessClick(businessId)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
}
