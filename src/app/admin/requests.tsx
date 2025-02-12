"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import InformationCard from "@/components/ui/InformationCard";

export default function RequestsPage() {
  const router = useRouter();

  // TODO: replace placeholder with data
  const oldInfo = {
    businessName: "Business Name",
  };

  const newInfo = {
    businessName: "Business Name",
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="z-50 pointer-events-auto">
        <DesktopSidebar />
      </div>

      <div className="flex-1">
        <div className="relative z-10">
          <AdminHeader title="Requests" />
        </div>

        <main className="relative z-0">
          <h2 className="absolute left-[116px] top-[148px] font-futura font-bold text-[26px] leading-[34.55px] text-black">
            Business Name
          </h2>

          <div className="absolute top-[206px] left-[119px]">
            <InformationCard type="old" businessInfo={oldInfo} />
          </div>

          <div className="absolute top-[206px] left-[773px]">
            <InformationCard type="new" businessInfo={newInfo} />
          </div>

          <h3 className="absolute top-[831px] left-[635px] font-futura font-medium text-[24px] leading-[31.88px] text-black">
            Allow Changes?
          </h3>

          <button
            onClick={() => router.push("/admin/requests/approved")}
            className="absolute top-[873px] left-[563px] w-[154px] h-[41px] bg-[#405BA9] text-white rounded-[23px] font-futura font-medium text-[16px] leading-[21.25px]"
          >
            Yes
          </button>

          <button
            onClick={() => router.push("/admin/requests/denied")}
            className="absolute top-[873px] left-[733px] w-[154px] h-[41px] bg-[#405BA9] text-white rounded-[23px] font-futura font-medium text-[16px] leading-[21.25px]"
          >
            No
          </button>
        </main>
      </div>
    </div>
  );
}
