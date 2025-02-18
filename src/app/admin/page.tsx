"use client";

import { useState } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { RequestCard } from "@/components/ui/RequestCard";
import StatsCard from "@/components/ui/StatsCard";
import FilterButton from "@/components/ui/FilterButton";

type FilterType = "Most Recent" | "Oldest" | "Business Name A-Z" | "Business Name Z-A";
type ViewType = "pending" | "approved" | "declined";

interface PendingRequest {
  businessName: string;
  timeElapsed: string;
  isUrgent: boolean;
}

interface HistoryRequest {
  businessName: string;
  status: "approved" | "denied";
  date: string;
}

export default function AdminDashboardPage() {
  const [pendingFilter, setPendingFilter] = useState<FilterType>("Most Recent");
  const [historyFilter, setHistoryFilter] = useState<FilterType>("Most Recent");

  // TODO: replace placeholder with data
  const pendingRequests = [
    {
      businessName: "(Business Name)",
      timeElapsed: "2 days ago",
      isUrgent: true,
    },
    {
      businessName: "(Business Name)",
      timeElapsed: "5 hours ago",
      isUrgent: false,
    },
  ];

  const historyRequests: HistoryRequest[] = [
    {
      businessName: "(Business Name)",
      status: "denied",
      date: "01/15/24",
    },
    {
      businessName: "(Business Name)",
      status: "approved",
      date: "01/14/24",
    },
  ];

  const stats = {
    pending: 2,
    approved: 5,
    declined: 3,
  };

  const [pendingData, setPendingData] = useState<PendingRequest[]>(pendingRequests);
  const [historyData, setHistoryData] = useState<HistoryRequest[]>(historyRequests);

  const filterPendingRequests = (requests: PendingRequest[], filter: FilterType) => {
    const sorted = [...requests];
    switch (filter) {
      case "Most Recent":
        return sorted;
      case "Oldest":
        return sorted.reverse();
      case "Business Name A-Z":
        return sorted.sort((a, b) => a.businessName.localeCompare(b.businessName));
      case "Business Name Z-A":
        return sorted.sort((a, b) => b.businessName.localeCompare(a.businessName));
      default:
        return sorted;
    }
  };

  const filterHistoryRequests = (requests: HistoryRequest[], filter: FilterType) => {
    const sorted = [...requests];
    switch (filter) {
      case "Most Recent":
        return sorted;
      case "Oldest":
        return sorted.reverse();
      case "Business Name A-Z":
        return sorted.sort((a, b) => a.businessName.localeCompare(b.businessName));
      case "Business Name Z-A":
        return sorted.sort((a, b) => b.businessName.localeCompare(a.businessName));
      default:
        return sorted;
    }
  };

  const handlePendingFilterChange = (filter: string) => {
    setPendingFilter(filter as FilterType);
    setPendingData(filterPendingRequests(pendingRequests, filter as FilterType));
  };

  const handleHistoryFilterChange = (filter: string) => {
    setHistoryFilter(filter as FilterType);
    setHistoryData(filterHistoryRequests(historyRequests, filter as FilterType));
  };

  return (
    <ResponsiveLayout title="Requests">
      <div className="relative min-h-screen bg-white px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="md:w-[591px]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-futura font-medium text-[26px] leading-[34.53px] text-black">Pending Requests</h2>
              <FilterButton onFilterChange={handlePendingFilterChange} selectedFilter={pendingFilter} />
            </div>

            <div className="space-y-[10px]">
              {pendingData.map((request, index) => (
                <RequestCard
                  key={index}
                  type="pending"
                  businessName={request.businessName}
                  timeAgo={request.timeElapsed}
                  isUrgent={request.isUrgent}
                />
              ))}
            </div>

            <div className="w-full h-0 border-t border-[#BEBEBE] my-8" />

            <div className="flex justify-between items-center mb-8">
              <h2 className="font-futura font-medium text-[26px] leading-[34.53px] text-black">
                History of Recent Requests
              </h2>
              <FilterButton onFilterChange={handleHistoryFilterChange} selectedFilter={historyFilter} />
            </div>

            <div className="space-y-[10px]">
              {historyData.map((request, index) => (
                <RequestCard
                  key={index}
                  type="history"
                  businessName={request.businessName}
                  status={request.status as "approved" | "denied"}
                  date={request.date}
                />
              ))}
            </div>
          </div>

          <div className="md:ml-8 mt-8 md:mt-0 space-y-[18px]">
            <StatsCard title="Total Pending Request" count={stats.pending} isHighlighted={true} />
            <StatsCard title="Requests Approved This Month" count={stats.approved} isHighlighted={false} />
            <StatsCard title="Requests Declined This Month" count={stats.declined} isHighlighted={false} />
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
