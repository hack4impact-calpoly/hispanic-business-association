"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import InformationCard from "@/components/ui/InformationCard";

interface BusinessInfo {
  businessName: string;
  businessType: string;
  businessOwner: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: number;
    county: string;
  };
  pointOfContact: {
    name: string;
    phoneNumber: number;
    email: string;
  };
  socialMediaHandles: {
    IG: string;
    twitter: string;
    FB: string;
  };
  description: string;
}

export default function RequestsPage() {
  const router = useRouter();

  const oldInfo: BusinessInfo = {
    businessName: "Business Name",
    businessType: "Business Type",
    businessOwner: "Business Owner",
    website: "example.com",
    address: {
      street: "123 Main St",
      city: "City",
      state: "State",
      zip: 12345,
      county: "County",
    },
    pointOfContact: {
      name: "Contact Name",
      phoneNumber: 1234567890,
      email: "contact@example.com",
    },
    socialMediaHandles: {
      IG: "@instagram",
      twitter: "@twitter",
      FB: "@facebook",
    },
    description: "Business description",
  };

  const newInfo: BusinessInfo = {
    businessName: "Business Name",
    businessType: "Business Type",
    businessOwner: "Business Owner",
    website: "example.com",
    address: {
      street: "123 Main St",
      city: "City",
      state: "State",
      zip: 12345,
      county: "County",
    },
    pointOfContact: {
      name: "Contact Name",
      phoneNumber: 1234567890,
      email: "contact@example.com",
    },
    socialMediaHandles: {
      IG: "@instagram",
      twitter: "@twitter",
      FB: "@facebook",
    },
    description: "Business description",
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
