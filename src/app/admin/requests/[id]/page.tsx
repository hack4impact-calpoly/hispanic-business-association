"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import InformationCard from "@/components/ui/InformationCard";
import { useRequest, useBusiness, updateRequestStatus } from "@/lib/swrHooks";

// Define props for the page component
interface RequestDetailPageProps {
  params: {
    id: string;
  };
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const router = useRouter();
  const { id } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the specific request using SWR
  const { request, isLoading: requestLoading, isError: requestError, mutate: mutateRequest } = useRequest(id);

  // Fetch business data associated with the request
  const { business, isLoading: businessLoading, isError: businessError } = useBusiness(request?.clerkUserID);

  const isLoading = requestLoading || businessLoading;
  const isError = requestError || businessError;

  // Only attempt to organize display data when both data sources are available
  const oldInfo = business
    ? {
        businessName: business.businessName,
        businessType: business.businessType,
        businessOwner: business.businessOwner,
        website: business.website,
        address: business.address,
        pointOfContact: business.pointOfContact,
        socialMediaHandles: business.socialMediaHandles,
        description: business.description,
      }
    : null;

  // For new info, use request data where available, falling back to business data
  const newInfo =
    request && business
      ? {
          businessName: request.businessName || business.businessName,
          businessType: request.businessType || business.businessType,
          businessOwner: request.businessOwner || business.businessOwner,
          website: request.website || business.website,
          address: request.address || business.address,
          pointOfContact: request.pointOfContact || business.pointOfContact,
          socialMediaHandles: request.socialMediaHandles || business.socialMediaHandles,
          description: request.description || business.description,
        }
      : null;

  // Handle approving the request
  const handleApprove = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Optimistically update local data
      await mutateRequest((prev) => (prev ? { ...prev, status: "approved" } : undefined), { revalidate: false });

      // Send API request
      const response = await fetch(`/api/request/${id}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to approve request");
      }

      // Navigate back to requests page
      router.push("/admin/requests?status=approved");
    } catch (error) {
      console.error("Error approving request:", error);
      // Revert optimistic update on error
      mutateRequest();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle declining the request
  const handleDecline = async () => {
    if (isSubmitting || !request) return;
    setIsSubmitting(true);

    try {
      // Optimistically update local data
      await mutateRequest((prev) => (prev ? { ...prev, status: "denied" } : undefined), { revalidate: false });

      // Send API request
      const response = await fetch(`/api/request/${id}/deny`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to deny request");
      }

      // Navigate back to requests page
      router.push("/admin/requests?status=denied");
    } catch (error) {
      console.error("Error denying request:", error);
      // Revert optimistic update on error
      mutateRequest();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ResponsiveLayout title="Request">
      {/* Refined responsive container */}
      <div className="relative min-h-screen bg-white px-3 sm:px-4 md:px-6 py-6 pb-[142px] md:pb-12">
        <div className="w-full max-w-7xl mx-auto">
          {isLoading && (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-lg">Loading request details...</p>
            </div>
          )}

          {isError && (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-lg text-red-500">Error loading request. Please try again.</p>
            </div>
          )}

          {!isLoading && !isError && oldInfo && newInfo && (
            <>
              {/* Business Name Title - Above the cards */}
              <h2 className="font-futura font-bold text-[22px] sm:text-[26px] leading-[34.55px] text-black mb-6 sm:mb-8">
                {newInfo.businessName}
              </h2>

              {/* Cards Container - Flex column on mobile, row on desktop */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-12 lg:mb-16">
                {/* Old Information Card - Full width on mobile, fixed proportional on desktop */}
                <div className="w-full lg:flex-1 lg:min-w-0 lg:max-w-[50%]">
                  <h3 className="font-futura font-medium text-xl text-black mb-4">Old Information</h3>
                  <InformationCard type="old" businessInfo={oldInfo} />
                </div>

                {/* New Information Card - Full width on mobile, fixed proportional on desktop */}
                <div className="w-full lg:flex-1 lg:min-w-0 lg:max-w-[50%]">
                  <h3 className="font-futura font-medium text-xl text-black mb-4">New Information</h3>
                  <InformationCard type="new" businessInfo={newInfo} />
                </div>
              </div>

              {/* Action Buttons - Centered with proper spacing */}
              <div className="flex flex-col items-center gap-4 mb-8 sm:mb-10">
                <h3 className="font-futura font-medium text-[20px] sm:text-[24px] leading-[31.88px] text-black">
                  Allow Changes?
                </h3>

                <div className="flex gap-4">
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="w-[130px] sm:w-[154px] h-[41px] bg-[#405BA9] text-white rounded-[23px] font-futura font-medium text-[16px] leading-[21.25px] disabled:opacity-50 hover:bg-[#293241] transition-colors"
                  >
                    {isSubmitting ? "Processing..." : "Yes"}
                  </button>

                  <button
                    onClick={handleDecline}
                    disabled={isSubmitting}
                    className="w-[130px] sm:w-[154px] h-[41px] bg-[#405BA9] text-white rounded-[23px] font-futura font-medium text-[16px] leading-[21.25px] disabled:opacity-50 hover:bg-[#293241] transition-colors"
                  >
                    {isSubmitting ? "Processing..." : "No"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
}
