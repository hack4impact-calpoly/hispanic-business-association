"use client";

import { useState, useMemo } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { RequestCard } from "@/components/ui/RequestsCards/RequestCard";
import FilterButton from "@/components/ui/GeneralAdminComponents/FilterButton";
import { useRequests, useBusinesses, useSignUpRequests, useRequestHistory } from "@/hooks/swrHooks";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type FilterType = "Most Recent" | "Oldest" | "Business Name A-Z" | "Business Name Z-A";

export default function AdminRequestsPage() {
  const t = useTranslations();
  const router = useRouter();
  const [pendingFilter, setPendingFilter] = useState<FilterType>("Most Recent");
  const [historyFilter, setHistoryFilter] = useState<FilterType>("Most Recent");
  const [pendingAccFilter, setPendingAccFilter] = useState<FilterType>("Most Recent");
  const [historyAccFilter, setHistoryAccFilter] = useState<FilterType>("Most Recent");

  const { requests, isLoading: isRequestsLoading } = useRequests();
  const { businesses, isLoading: isBusinessesLoading } = useBusinesses();
  const { historyRequests, isLoading: isHistoryLoading } = useRequestHistory();
  const { signupRequests, isLoading: isSignupRequestsLoading } = useSignUpRequests();
  const [showOnlyLast30Days, setShowOnlyLast30Days] = useState(true);
  const [showOnlyLast30DaysSignup, setShowOnlyLast30DaysSignup] = useState(true);

  // Create a lookup map of clerkUserID to business name
  const businessNameMap = useMemo(() => {
    if (!businesses) return {};

    const map: Record<string, string> = {};
    businesses.forEach((business) => {
      if (business.clerkUserID && business.businessName) {
        map[business.clerkUserID] = business.businessName;
      }
    });
    return map;
  }, [businesses]);

  // Function to get business name, using original name as fallback
  const getBusinessName = (request: any) => {
    // If request has a business name, use it
    if (request.businessName) return request.businessName;

    // Otherwise, look up the original business name by clerk ID
    if (request.clerkUserID && businessNameMap[request.clerkUserID]) {
      return businessNameMap[request.clerkUserID];
    }

    // Fall back to placeholder if nothing is found
    return t("businessName");
  };

  // Calculate stats based on requests data
  const stats = {
    pending: requests?.filter((req) => req.status === "open").length || 0,
    approved: requests?.filter((req) => req.decision === "approved").length || 0,
    declined: requests?.filter((req) => req.decision === "denied").length || 0,
  };

  // Apply filter to pending requests
  const filterPendingRequests = () => {
    if (!requests) return [];
    const pendingRequests = requests.filter((req) => req.status === "open");
    const sorted = [...pendingRequests];

    switch (pendingFilter) {
      case "Most Recent":
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "Oldest":
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case "Business Name A-Z":
        return sorted.sort((a, b) => (getBusinessName(a) || "").localeCompare(getBusinessName(b) || ""));
      case "Business Name Z-A":
        return sorted.sort((a, b) => (getBusinessName(b) || "").localeCompare(getBusinessName(a) || ""));
      default:
        return sorted;
    }
  };

  const filterPendingSignupRequests = () => {
    if (!signupRequests) return [];

    const pendingRequests = signupRequests.filter((req) => req.status === "open");
    const sorted = [...pendingRequests];

    switch (pendingAccFilter) {
      case "Most Recent":
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "Oldest":
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case "Business Name A-Z":
        return sorted.sort((a, b) => (getBusinessName(a) || "").localeCompare(getBusinessName(b) || ""));
      case "Business Name Z-A":
        return sorted.sort((a, b) => (getBusinessName(b) || "").localeCompare(getBusinessName(a) || ""));
      default:
        return sorted;
    }
  };

  // Apply filter to history requests
  const filterHistoryRequests = () => {
    if (!requests && !historyRequests) return [];

    const closedCurrentRequests = requests?.filter((req) => req.status === "closed") || [];
    const historicalRequests = historyRequests || [];
    let combinedHistory = [...closedCurrentRequests, ...historicalRequests];

    if (showOnlyLast30Days) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      combinedHistory = combinedHistory.filter((req) => new Date(req.date) >= thirtyDaysAgo);
    }

    const sorted = [...combinedHistory];

    switch (historyFilter) {
      case "Most Recent":
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "Oldest":
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case "Business Name A-Z":
        return sorted.sort((a, b) => (getBusinessName(a) || "").localeCompare(getBusinessName(b) || ""));
      case "Business Name Z-A":
        return sorted.sort((a, b) => (getBusinessName(b) || "").localeCompare(getBusinessName(a) || ""));
      default:
        return sorted;
    }
  };

  const filterHistorySignupRequests = () => {
    if (!signupRequests) return [];

    let historyRequests = signupRequests.filter((req) => req.status === "closed");

    if (showOnlyLast30DaysSignup) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      historyRequests = historyRequests.filter((req) => new Date(req.date) >= thirtyDaysAgo);
    }

    switch (historyAccFilter) {
      case "Most Recent":
        return historyRequests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "Oldest":
        return historyRequests.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case "Business Name A-Z":
        return historyRequests.sort((a, b) => (getBusinessName(a) || "").localeCompare(getBusinessName(b) || ""));
      case "Business Name Z-A":
        return historyRequests.sort((a, b) => (getBusinessName(b) || "").localeCompare(getBusinessName(a) || ""));
      default:
        return historyRequests;
    }
  };

  // Handle filter changes
  const handlePendingFilterChange = (filter: string) => {
    setPendingFilter(filter as FilterType);
  };

  const handleHistoryFilterChange = (filter: string) => {
    setHistoryFilter(filter as FilterType);
  };

  const handlePendingAccFilterChange = (filter: string) => {
    setPendingAccFilter(filter as FilterType);
  };

  const handleHistoryAccFilterChange = (filter: string) => {
    setHistoryAccFilter(filter as FilterType);
  };

  // Navigate to pending request detail page
  const handlePendingRequestClick = (id: string) => {
    if (id) {
      router.push(`/admin/requests/${id}`);
    }
  };

  // Navigate to history request detail page
  const handleHistoryRequestClick = (id: string) => {
    if (id) {
      router.push(`/admin/requests/history/${id}`);
    }
  };

  const handleSignUpRequestClick = (id: string) => {
    router.push(`/admin/signuprequests/${id}`);
  };

  // Format relative time to closest minute
  const getTimeAgo = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

    if (diffInMinutes < 60) {
      // Show minimum of 1 minute instead of 0
      const displayMinutes = Math.max(1, diffInMinutes);
      if (displayMinutes === 1) {
        return `1 ${t("minuteAgo")}`;
      }
      return `${displayMinutes} ${t("minutesAgo")}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;

      if (minutes === 0) {
        return `${hours} ${t("hoursAgo")}`;
      } else {
        return `${hours}h ${minutes}m ${t("ago")}`;
      }
    } else {
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `${diffInDays} ${t("daysAgo")}`;
    }
  };

  // Determine if request is urgent (older than 3 days)
  const isUrgent = (dateString: string | Date): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffInHours > 72; // More than 3 days
  };

  // Format date as MM/DD/YY
  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().substr(-2)}`;
  };

  const pendingData = filterPendingRequests();
  const historyData = filterHistoryRequests();
  const pendingSignupData = filterPendingSignupRequests();
  const historySignupData = filterHistorySignupRequests();

  // Determine if data is still loading
  const isLoading = isRequestsLoading || isBusinessesLoading || isHistoryLoading || isSignupRequestsLoading;

  return (
    <ResponsiveLayout title={t("reqs")}>
      <div className="p-6 space-y-6">
        <div className="w-full max-w-7xl mx-auto pt-4">
          {/* Responsive Flex Container */}
          <div className="flex flex-col lg:flex-row lg:justify-between">
            {/* Request List Column - Responsive width based on context */}
            <div className="w-full md:max-w-[591px] lg:max-w-none lg:flex-1 lg:min-w-0 xl:max-w-[591px]">
              {/* Pending Requests section */}
              <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 w-full">
                <h2 className="font-futura font-medium text-[18px] sm:text-[22px] md:text-[26px] leading-tight md:leading-[34.53px] text-black truncate pr-2">
                  {t("pendingReqs")}
                </h2>
                <div className="flex-shrink-0">
                  <FilterButton onFilterChange={handlePendingFilterChange} selectedFilter={pendingFilter} />
                </div>
              </div>

              <div className="space-y-[6px] sm:space-y-[10px] w-full">
                {isLoading ? (
                  <p className="text-center py-4 text-gray-500">{t("loadReq")}</p>
                ) : pendingData.length > 0 ? (
                  pendingData.map((request) => (
                    <div
                      key={(request as any)._id}
                      onClick={() => handlePendingRequestClick((request as any)._id)}
                      className="w-full"
                    >
                      <RequestCard
                        type="pending"
                        businessName={getBusinessName(request)}
                        timeAgo={getTimeAgo(request.date)}
                        isUrgent={isUrgent(request.date)}
                        className="w-full"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">{t("noPending")}</p>
                )}
              </div>

              <div className="w-full h-0 border-t border-[#BEBEBE] my-6 sm:my-8" />

              {/* History Requests section */}
              <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 w-full">
                <h2 className="font-futura font-medium text-[18px] sm:text-[22px] md:text-[26px] leading-tight md:leading-[34.53px] text-black truncate pr-2">
                  {t("reqHistory")}
                </h2>
                <div className="flex-shrink-0">
                  <FilterButton onFilterChange={handleHistoryFilterChange} selectedFilter={historyFilter} />
                </div>
              </div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowOnlyLast30Days((prev) => !prev)}
                  className="text-sm text-blue-600 underline"
                >
                  {showOnlyLast30Days ? "Show All History" : "Show Only Last 30 Days"}
                </button>
              </div>

              <div className="space-y-[6px] sm:space-y-[10px] w-full">
                {isLoading ? (
                  <p className="text-center py-4 text-gray-500">{t("loadReqHistory")}</p>
                ) : historyData.length > 0 ? (
                  historyData.map((request) => (
                    <div
                      key={(request as any)._id}
                      onClick={() => handleHistoryRequestClick((request as any)._id)}
                      className="w-full"
                    >
                      <RequestCard
                        type="history"
                        businessName={getBusinessName(request)}
                        status={request.decision as "approved" | "denied"}
                        date={formatDate(request.date)}
                        className="w-full"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">{t("noReqHistory")}</p>
                )}
              </div>
            </div>

            {/* Account Requests Column */}
            <div className="w-full lg:w-auto lg:ml-[30px] lg:min-w-[350px] xl:min-w-[416px] mt-8 lg:mt-0 space-y-4 sm:space-y-[18px]">
              <div className="w-full md:max-w-[591px] lg:max-w-none lg:flex-1 lg:min-w-0 xl:max-w-[591px]">
                {/* Pending Account Requests section */}
                <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 w-full">
                  <h2 className="font-futura font-medium text-[18px] sm:text-[22px] md:text-[26px] leading-tight md:leading-[34.53px] text-black truncate pr-2">
                    {t("pendingAccReq")}
                  </h2>
                  <div className="flex-shrink-0">
                    <FilterButton onFilterChange={handlePendingAccFilterChange} selectedFilter={pendingAccFilter} />
                  </div>
                </div>

                <div className="space-y-[6px] sm:space-y-[10px] w-full">
                  {isLoading ? (
                    <p className="text-center py-4 text-gray-500">{t("loadReq")}</p>
                  ) : pendingSignupData.length > 0 ? (
                    pendingSignupData.map((request) => (
                      <div
                        key={(request as any)._id}
                        onClick={() => handleSignUpRequestClick((request as any)._id)}
                        className="w-full"
                      >
                        <RequestCard
                          type="pending"
                          businessName={getBusinessName(request)}
                          timeAgo={getTimeAgo(request.date)}
                          isUrgent={isUrgent(request.date)}
                          className="w-full"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-gray-500">{t("noPending")}</p>
                  )}
                </div>

                <div className="w-full h-0 border-t border-[#BEBEBE] my-6 sm:my-8" />

                {/* Account History Requests section */}
                <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 w-full">
                  <h2 className="font-futura font-medium text-[18px] sm:text-[22px] md:text-[26px] leading-tight md:leading-[34.53px] text-black truncate pr-2">
                    {t("accReqHistory")}
                  </h2>
                  <div className="flex-shrink-0">
                    <FilterButton onFilterChange={handleHistoryAccFilterChange} selectedFilter={historyAccFilter} />
                  </div>
                </div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setShowOnlyLast30DaysSignup((prev) => !prev)}
                    className="text-sm text-blue-600 underline"
                  >
                    {showOnlyLast30DaysSignup ? "Show All History" : "Show Only Last 30 Days"}
                  </button>
                </div>

                <div className="space-y-[6px] sm:space-y-[10px] w-full">
                  {isLoading ? (
                    <p className="text-center py-4 text-gray-500">{t("loadReqHistory")}</p>
                  ) : historySignupData.length > 0 ? (
                    historySignupData.map((request) => (
                      <div
                        key={(request as any)._id}
                        onClick={() => handleSignUpRequestClick((request as any)._id)}
                        className="w-full"
                      >
                        <RequestCard
                          type="history"
                          businessName={getBusinessName(request)}
                          status={request.decision as "approved" | "denied"}
                          date={formatDate(request.date)}
                          className="w-full"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-gray-500">{t("noReqHistory")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
