"use client";

import { useState, useEffect } from "react";

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
import axios from "axios";

export default function RequestsPage() {
  const [oldInfo, setOldInfo] = useState({
    businessName: "",
    businessType: "",
    businessOwner: "",
    website: "",
    address: { street: "", city: "", state: "", zip: 0, county: "" },
    pointOfContact: { name: "", phoneNumber: 0, email: "" },
    socialMediaHandles: { IG: "", twitter: "", FB: "" },
    description: "",
  });

  const [newInfo, setNewInfo] = useState({
    businessName: "",
    businessType: "",
    businessOwner: "",
    website: "",
    address: { street: "", city: "", state: "", zip: 0, county: "" },
    pointOfContact: { name: "", phoneNumber: 0, email: "" },
    socialMediaHandles: { IG: "", twitter: "", FB: "" },
    description: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get list of requests from the API
        const requestsResponse = await axios.get("/api/request");
        const requests = requestsResponse.data;
        if (requests && requests.length > 0) {
          const firstRequest = requests[0];
          const businessResponse = await axios.get(`/api/business/?clerkId=${firstRequest.clerkUserID}`);
          const businessData = businessResponse.data;

          // Store the recent request as newInfo (change later to depend on id)

          setNewInfo({
            businessName: firstRequest.businessName ? firstRequest.businessName : businessData.businessName,
            businessType: firstRequest.businessType ? firstRequest.businessType : businessData.businessType,
            businessOwner: firstRequest.businessOwner ? firstRequest.businessOwner : businessData.businessOwner,
            website: firstRequest.website ? firstRequest.website : businessData.website,
            address: firstRequest.address ? firstRequest.address : businessData.address,
            pointOfContact: firstRequest.pointOfContact
              ? {
                  name: firstRequest.pointOfContact.name || businessData.pointOfContact.name,
                  phoneNumber: firstRequest.pointOfContact.phoneNumber || businessData.pointOfContact.phoneNumber,
                  email: firstRequest.pointOfContact.email || businessData.pointOfContact.email,
                }
              : businessData.pointOfContact,
            socialMediaHandles: firstRequest.socialMediaHandles
              ? {
                  IG: firstRequest.socialMediaHandles.IG || businessData.socialMediaHandles.IG,
                  twitter: firstRequest.socialMediaHandles.twitter || businessData.socialMediaHandles.twitter,
                  FB: firstRequest.socialMediaHandles.FB || businessData.socialMediaHandles.FB,
                }
              : businessData.socialMediaHandles,
            description: firstRequest.description ? firstRequest.description : businessData.description,
          });

          // Fetch business info based on clerkId from the most recent request
          setOldInfo({
            businessName: businessData.businessName,
            businessType: businessData.businessType,
            businessOwner: businessData.businessOwner,
            website: businessData.website,
            address: businessData.address,
            pointOfContact: businessData.pointOfContact,
            socialMediaHandles: businessData.socialMediaHandles,
            description: businessData.description,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveLayout title="Request">
      <div className="min-h-screen bg-white p-4 md:p-0">
        <h2 className="font-futura font-bold text-[26px] leading-[34.55px] text-black mb-8">Business Name</h2>

        <div className="flex flex-col md:flex-row gap-6 md:gap-x-4 mb-16 justify-center items-center">
          <div className="w-full md:w-auto">
            <InformationCard type="old" businessInfo={oldInfo} />
          </div>

          <div className="w-full md:w-auto">
            <InformationCard type="new" businessInfo={newInfo} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mb-8">
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
