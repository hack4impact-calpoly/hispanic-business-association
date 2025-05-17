"use client";

import { useState, useEffect, useMemo } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { RequestCard } from "@/components/ui/RequestCard";
import StatsCard from "@/components/ui/StatsCard";
import FilterButton from "@/components/ui/FilterButton";
import { useRequests, useUser, useBusinesses, useSignUpRequests, useRequestHistory } from "@/hooks/swrHooks";
import { useRouter } from "next/navigation";

type FilterType = "Most Recent" | "Oldest" | "Business Name A-Z" | "Business Name Z-A";

export default function AdminRequestsPage() {
  const router = useRouter();
  const [pendingFilter, setPendingFilter] = useState<FilterType>("Most Recent");
  const [historyFilter, setHistoryFilter] = useState<FilterType>("Most Recent");
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch data using SWR hooks
  const { user, isLoading: isUserLoading } = useUser();
  const { requests, isLoading: isRequestsLoading } = useRequests();
  const { businesses, isLoading: isBusinessesLoading } = useBusinesses();
  const { historyRequests, isLoading: isHistoryLoading } = useRequestHistory();
  const { signupRequests, isLoading: isSignupRequestsLoading } = useSignUpRequests();

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
    return "(Business Name)";
  };

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

  // Apply filter to history requests
  const filterHistoryRequests = () => {
    if (!requests && !historyRequests) return [];

    const closedCurrentRequests = requests?.filter((req) => req.status === "closed") || [];
    const historicalRequests = historyRequests || [];
    const combinedHistory = [...closedCurrentRequests, ...historicalRequests];

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

    const historyRequests = signupRequests.filter((req) => req.status === "closed");
    const sorted = [...historyRequests];

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

  // Handle filter changes
  const handlePendingFilterChange = (filter: string) => {
    setPendingFilter(filter as FilterType);
  };

  const handleHistoryFilterChange = (filter: string) => {
    setHistoryFilter(filter as FilterType);
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

  // Format relative time (e.g., "2 days ago")
  const getTimeAgo = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
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
    <ResponsiveLayout title="Requests">
      <div className="relative min-h-screen bg-white px-2 sm:px-4 md:px-6 py-6 pb-[142px] md:pb-12">
        <div className="w-full max-w-7xl mx-auto pt-4">
          {/* Responsive Flex Container */}
          <div className="flex flex-col lg:flex-row lg:justify-between">
            {/* Request List Column - Responsive width based on context */}
            <div className="w-full md:max-w-[591px] lg:max-w-none lg:flex-1 lg:min-w-0 xl:max-w-[591px]">
              {/* Pending Requests section */}
              <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 w-full">
                <h2 className="font-futura font-medium text-[18px] sm:text-[22px] md:text-[26px] leading-tight md:leading-[34.53px] text-black truncate pr-2">
                  Pending Requests
                </h2>
                <div className="flex-shrink-0">
                  <FilterButton onFilterChange={handlePendingFilterChange} selectedFilter={pendingFilter} />
                </div>
              </div>

              <div className="space-y-[6px] sm:space-y-[10px] w-full">
                {isLoading ? (
                  <p className="text-center py-4 text-gray-500">Loading requests...</p>
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
                  <p className="text-center py-4 text-gray-500">No pending requests</p>
                )}
              </div>

              <div className="w-full h-0 border-t border-[#BEBEBE] my-6 sm:my-8" />

              {/* History Requests section */}
              <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 w-full">
                <h2 className="font-futura font-medium text-[18px] sm:text-[22px] md:text-[26px] leading-tight md:leading-[34.53px] text-black truncate pr-2">
                  History of Recent Requests
                </h2>
                <div className="flex-shrink-0">
                  <FilterButton onFilterChange={handleHistoryFilterChange} selectedFilter={historyFilter} />
                </div>
              </div>

              <div className="space-y-[6px] sm:space-y-[10px] w-full">
                {isLoading ? (
                  <p className="text-center py-4 text-gray-500">Loading request history...</p>
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
                  <p className="text-center py-4 text-gray-500">No request history</p>
                )}
              </div>
            </div>

            {/* Account Requests Column */}
            <div className="w-full lg:w-auto lg:ml-[30px] lg:min-w-[350px] xl:min-w-[416px] mt-8 lg:mt-0 space-y-4 sm:space-y-[18px]">
              <div className="w-full md:max-w-[591px] lg:max-w-none lg:flex-1 lg:min-w-0 xl:max-w-[591px]">
                {/* Pending Account Requests section */}
                <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 w-full">
                  <h2 className="font-futura font-medium text-[18px] sm:text-[22px] md:text-[26px] leading-tight md:leading-[34.53px] text-black truncate pr-2">
                    Pending Account Requests
                  </h2>
                  <div className="flex-shrink-0">
                    <FilterButton onFilterChange={handlePendingFilterChange} selectedFilter={pendingFilter} />
                  </div>
                </div>

                <div className="space-y-[6px] sm:space-y-[10px] w-full">
                  {isLoading ? (
                    <p className="text-center py-4 text-gray-500">Loading requests...</p>
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
                    <p className="text-center py-4 text-gray-500">No pending account requests</p>
                  )}
                </div>

                <div className="w-full h-0 border-t border-[#BEBEBE] my-6 sm:my-8" />

                {/* Account History Requests section */}
                <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 w-full">
                  <h2 className="font-futura font-medium text-[18px] sm:text-[22px] md:text-[26px] leading-tight md:leading-[34.53px] text-black truncate pr-2">
                    History of Account Requests
                  </h2>
                  <div className="flex-shrink-0">
                    <FilterButton onFilterChange={handleHistoryFilterChange} selectedFilter={historyFilter} />
                  </div>
                </div>

                <div className="space-y-[6px] sm:space-y-[10px] w-full">
                  {isLoading ? (
                    <p className="text-center py-4 text-gray-500">Loading account history...</p>
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
                    <p className="text-center py-4 text-gray-500">No account history</p>
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
