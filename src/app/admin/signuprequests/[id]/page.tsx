"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import InformationCard from "@/components/ui/InformationCard";
import { useSignUpRequest, useBusiness, updateRequestStatus, useSignUpRequests } from "@/hooks/swrHooks";
import { Button } from "@/components/ui/button";
import RequestApprovedCard from "@/components/ui/RequestApprovedCard";
import RequestDeniedCard from "@/components/ui/RequestDeniedCard";

// Define props for the page component
interface SignupRequestDetailPageProps {
  params: {
    id: string;
  };
}

export default function SignupRequestDetailPage({ params }: SignupRequestDetailPageProps) {
  const [showApprovedCard, setShowApprovedCard] = useState(false);
  const [showDeniedCard, setShowDeniedCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { id } = params;

  // Fetch the specific request using SWR
  const {
    request: signupRequest,
    isLoading: requestLoading,
    isError: requestError,
    mutate: mutateRequest,
  } = useSignUpRequest(id);

  // Fetch business data associated with the request

  const isLoading = requestLoading;
  const isError = requestError;

  // Only attempt to organize display data when both data sources are available
  // For new info, use request data where available, falling back to business data
  const newInfo = signupRequest
    ? {
        businessName: signupRequest.businessName || "",
        businessType: signupRequest.businessType || "",
        businessOwner: signupRequest.businessOwner || "",
        website: signupRequest.website || "",
        address: signupRequest.address || "",
        pointOfContact: signupRequest.pointOfContact || "",
        socialMediaHandles: signupRequest.socialMediaHandles,
        description: signupRequest.description || "",
        logoUrl: signupRequest.logoUrl,
      }
    : null;

  // Handle approving the request
  const handleApprove = async () => {
    if (!signupRequest) return;

    setIsSubmitting(true);

    fetch("/api/business", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkUserID: signupRequest.clerkUserID,
        businessName: signupRequest.businessName,
        businessType: signupRequest.businessType,
        membershipFeeType: signupRequest.membershipFeeType,
        businessOwner: signupRequest.businessOwner,
        website: signupRequest.website,
        address: signupRequest.address,
        pointOfContact: signupRequest.pointOfContact,
        socialMediaHandles: signupRequest.socialMediaHandles,
        description: signupRequest.description,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    try {
      const response = await fetch("/api/signup/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve request");
      }

      // Show approval card after successful API call
      setShowApprovedCard(true);
      mutateRequest();
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Error approving request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle declining the request
  const handleDeny = async () => {
    if (!signupRequest) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/signup/deny", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to deny request");
      }

      // Show denial card after successful API call
      setShowDeniedCard(true);
      mutateRequest();
    } catch (error) {
      console.error("Error denying request:", error);
      alert("Error denying request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ResponsiveLayout title="Request">
      {/* Refined responsive container */}
      <div className="relative min-h-screen bg-white px-3 sm:px-4 md:px-6 py-6 pb-[142px] md:pb-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Back to Requests button with status indicator - modified */}
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => router.push("/admin/requests")}
              className="flex items-center gap-2 bg-transparent text-[#405BA9] hover:bg-gray-100"
            >
              <span className="text-xl">←</span> Back to Requests
            </Button>

            {signupRequest && signupRequest.status === "closed" && (
              <div
                className={`font-futura font-medium text-[24px] leading-[27px] ${
                  signupRequest.decision === "approved" ? "text-[#00A819]" : "text-[#AE0000]"
                }`}
              >
                {signupRequest.decision === "approved" ? "Approved" : "Denied"}
              </div>
            )}
          </div>

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

          {!isLoading && !isError && newInfo && (
            <>
              {/* Business Name Title - Above the cards */}
              <h2 className="font-futura font-bold text-[22px] sm:text-[26px] leading-[34.55px] text-black mb-6 sm:mb-8">
                {newInfo.businessName}
              </h2>
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-12 lg:mb-16">
                {/* Cards Container - Flex column on mobile, row on desktop */}
                <div className="w-full flex justify-center">
                  <div className="w-full lg:max-w-[600px]">
                    <h3 className="font-futura font-medium text-xl text-black mb-4">New Information</h3>
                    <InformationCard type="signup" businessInfo={newInfo} />
                  </div>
                </div>
              </div>

              {/* Action Buttons - Centered with proper spacing */}
              {signupRequest && signupRequest.status === "open" ? (
                <div className="flex flex-col items-center gap-4 mb-8 sm:mb-10">
                  <h3 className="font-futura font-medium text-[20px] sm:text-[24px] leading-[31.88px] text-black">
                    Allow Account Creation?
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
                      onClick={handleDeny}
                      disabled={isSubmitting}
                      className="w-[130px] sm:w-[154px] h-[41px] bg-[#405BA9] text-white rounded-[23px] font-futura font-medium text-[16px] leading-[21.25px] disabled:opacity-50 hover:bg-[#293241] transition-colors"
                    >
                      {isSubmitting ? "Processing..." : "No"}
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
        {showApprovedCard && <RequestApprovedCard onClose={() => setShowApprovedCard(false)} />}
        {showDeniedCard && <RequestDeniedCard onClose={() => setShowDeniedCard(false)} />}
      </div>
    </ResponsiveLayout>
  );
}
