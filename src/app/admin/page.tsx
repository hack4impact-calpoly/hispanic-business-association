"use client";

import { useState } from "react";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
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

  const separatorPosition = pendingData.length > 0 ? 194 + 67 * pendingData.length + 20 + 18 : 148 + 34.53 + 18;

  return (
    <div className="flex min-h-screen bg-white">
      <div className="z-50 pointer-events-auto">
        <DesktopSidebar />
      </div>

      <div className="flex-1">
        <div className="relative z-10">
          <AdminHeader title="Requests" />
        </div>

        <main className="relative w-[1440px] h-[1024px] bg-white">
          <section>
            <h2 className="absolute top-[148px] left-[119px] font-futura font-medium text-[26px] leading-[34.53px] text-black">
              Pending Requests
            </h2>

            <div className="absolute top-[150px] left-[629px]">
              <FilterButton onFilterChange={handlePendingFilterChange} selectedFilter={pendingFilter} />
            </div>

            <div className="absolute top-[194px] left-[119px] space-y-[10px]">
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

            <div
              className="absolute left-[119px] w-[591px] h-0 border-t border-[#BEBEBE]"
              style={{
                top: pendingData.length > 0 ? `${194 + 67 * pendingData.length + 20 + 18}px` : `${148 + 34.53 + 18}px`,
              }}
            />
          </section>

          <section className="absolute top-[191px] right-[32px] space-y-[18px]">
            <StatsCard title="Total Pending Request" count={stats.pending} isHighlighted={true} />
            <StatsCard title="Requests Approved This Month" count={stats.approved} isHighlighted={false} />
            <StatsCard title="Requests Declined This Month" count={stats.declined} isHighlighted={false} />
          </section>

          <section
            style={{
              position: "absolute",
              top: `${separatorPosition + 200}px`,
              left: 0,
              right: 0,
            }}
          >
            <h2 className="absolute left-[119px] font-futura font-medium text-[26px] leading-[34.53px] text-black">
              History of Recent Requests
            </h2>

            <div className="absolute left-[629px] top-[3px]">
              {" "}
              <FilterButton onFilterChange={handleHistoryFilterChange} selectedFilter={historyFilter} />
            </div>

            <div className="absolute top-[56px] left-[119px] space-y-[10px]">
              {" "}
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
          </section>
        </main>
      </div>
    </div>
  );
}
