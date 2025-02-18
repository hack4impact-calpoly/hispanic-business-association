"use client";

/**
 * TODO: Architectural Decision Needed
 *
 * This code currently exists as /admin/requests.tsx but needs proper placement in the Next.js app router structure.
 *
 * Options:
 * 1. If this is meant to be a standalone page for reviewing all requests:
 *    - Move to: /src/app/admin/requests/page.tsx
 *
 * 2. If this is meant to be a detailed view of a specific request:
 *    - Move to: /src/app/admin/requests/[id]/page.tsx
 *    - Add a parent route at /src/app/admin/requests/page.tsx that shows a list of requests
 *
 * 3. If this is meant to be a component used within other pages:
 *    - Move to: /src/components/admin/RequestsReview.tsx
 *
 * Current code shows a comparison view of old vs new business information with approve/deny actions.
 * Need to determine the proper user flow to decide placement.
 */

import React from "react";
import { useRouter } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
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
    <ResponsiveLayout title="Requests">
      <div className="min-h-screen bg-white p-4 md:p-0">
        <h2 className="font-futura font-bold text-[26px] leading-[34.55px] text-black mb-8">Business Name</h2>

        <div className="flex flex-col md:flex-row gap-6 md:gap-x-24 mb-16">
          <div className="w-full md:w-auto">
            <InformationCard type="old" businessInfo={oldInfo} />
          </div>

          <div className="w-full md:w-auto">
            <InformationCard type="new" businessInfo={newInfo} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h3 className="font-futura font-medium text-[24px] leading-[31.88px] text-black">Allow Changes?</h3>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/admin/requests/approved")}
              className="w-[154px] h-[41px] bg-[#405BA9] text-white rounded-[23px] font-futura font-medium text-[16px] leading-[21.25px]"
            >
              Yes
            </button>

            <button
              onClick={() => router.push("/admin/requests/denied")}
              className="w-[154px] h-[41px] bg-[#405BA9] text-white rounded-[23px] font-futura font-medium text-[16px] leading-[21.25px]"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
