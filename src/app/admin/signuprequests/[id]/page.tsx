"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import InformationCard from "@/components/ui/RequestsCards/RequestInformationCard";
import { useSignUpRequest, useBusiness, updateRequestStatus, useSignUpRequests } from "@/hooks/swrHooks";
import { Button } from "@/components/ui/shadcnComponents/button";
import RequestApprovedCard from "@/components/ui/RequestsCards/RequestApprovedCard";
import RequestDeniedCard from "@/components/ui/RequestsCards/RequestDeniedCard";
import { useTranslations } from "next-intl";

interface SignupRequestDetailPageProps {
  params: {
    id: string;
  };
}

export default function SignupRequestDetailPage({ params }: SignupRequestDetailPageProps) {
  const t = useTranslations();
  const [showApprovedCard, setShowApprovedCard] = useState(false);
  const [showDeniedCard, setShowDeniedCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { id } = params;

  const {
    request: signupRequest,
    isLoading: requestLoading,
    isError: requestError,
    mutate: mutateRequest,
  } = useSignUpRequest(id);

  const isLoading = requestLoading;
  const isError = requestError;

  const newInfo = signupRequest
    ? {
        name: signupRequest.businessName || "",
        type: signupRequest.businessType || "",
        owner: signupRequest.businessOwner || "",
        website: signupRequest.website || "",
        physicalAddress: signupRequest.physicalAddress,
        mailingAddress: signupRequest.mailingAddress,
        pointOfContact: signupRequest.pointOfContact,
        socialMediaHandles: signupRequest.socialMediaHandles,
        description: signupRequest.description || "",
        logoUrl: signupRequest.logoUrl,
        bannerUrl: signupRequest.bannerUrl,
        organizationType: signupRequest.organizationType,
        businessScale: signupRequest.businessScale,
        numberOfEmployees: signupRequest.numberOfEmployees,
        gender: signupRequest.gender,
      }
    : null;

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
        name: signupRequest.businessName,
        type: signupRequest.businessType,
        owner: signupRequest.businessOwner,
        website: signupRequest.website,
        physicalAddress: signupRequest.physicalAddress,
        mailingAddress: signupRequest.mailingAddress,
        pointOfContact: signupRequest.pointOfContact,
        socialMediaHandles: signupRequest.socialMediaHandles,
        description: signupRequest.description,
        logoUrl: signupRequest.logoUrl,
        bannerUrl: signupRequest.bannerUrl,
        organizationType: signupRequest.organizationType,
        businessScale: signupRequest.businessScale,
        numberOfEmployees: signupRequest.numberOfEmployees,
        gender: signupRequest.gender,
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

      setShowApprovedCard(true);
      mutateRequest();
    } catch (error) {
      console.error("Error approving request:", error);
      alert(t("approveReqError"));
    } finally {
      setIsSubmitting(false);
    }
  };

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

      setShowDeniedCard(true);
      mutateRequest();
    } catch (error) {
      console.error("Error denying request:", error);
      alert(t("denyReqError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ResponsiveLayout title={t("req")}>
      <div className="relative min-h-screen bg-white px-3 sm:px-4 md:px-6 py-6 pb-[142px] md:pb-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => router.push("/admin/requests")}
              className="flex items-center gap-2 bg-transparent text-[#405BA9] hover:bg-gray-100"
            >
              <span className="text-xl">←</span> {t("backToReq")}
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
              <p className="text-lg">{t("loadReqDetails")}</p>
            </div>
          )}

          {isError && (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-lg text-red-500">{t("errLoadReq")}</p>
            </div>
          )}

          {!isLoading && !isError && newInfo && (
            <>
              <h2 className="font-futura font-bold text-[22px] sm:text-[26px] leading-[34.55px] text-black mb-6 sm:mb-8">
                {newInfo.name}
              </h2>
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-12 lg:mb-16">
                <div className="w-full flex justify-center">
                  <div className="w-full lg:max-w-[600px]">
                    <h3 className="font-futura font-medium text-xl text-black mb-4">{t("newInfo")}</h3>
                    <InformationCard type="signup" businessInfo={newInfo} />
                  </div>
                </div>
              </div>

              {signupRequest && signupRequest.status === "open" ? (
                <div className="flex flex-col items-center gap-4 mb-8 sm:mb-10">
                  <h3 className="font-futura font-medium text-[20px] sm:text-[24px] leading-[31.88px] text-black">
                    {t("accCreate")}
                  </h3>

                  <div className="flex gap-4">
                    <button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="w-[130px] sm:w-[154px] h-[41px] bg-[#405BA9] text-white rounded-[23px] font-futura font-medium text-[16px] leading-[21.25px] disabled:opacity-50 hover:bg-[#293241] transition-colors"
                    >
                      {isSubmitting ? t("processing") : t("yes")}
                    </button>

                    <button
                      onClick={handleDeny}
                      disabled={isSubmitting}
                      className="w-[130px] sm:w-[154px] h-[41px] bg-[#405BA9] text-white rounded-[23px] font-futura font-medium text-[16px] leading-[21.25px] disabled:opacity-50 hover:bg-[#293241] transition-colors"
                    >
                      {isSubmitting ? t("processing") : t("no")}
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
