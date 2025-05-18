"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import InformationCard from "@/components/ui/InformationCard";
import { useRequest, useBusiness, updateRequestStatus } from "@/hooks/swrHooks";
import { Button } from "@/components/ui/shadcnComponents/button";
import RequestApprovedCard from "@/components/ui/RequestApprovedCard";
import RequestDeniedCard from "@/components/ui/RequestDeniedCard";
import { useTranslations } from "next-intl";

interface RequestDetailPageProps {
  params: {
    id: string;
  };
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const t = useTranslations();
  const [showApprovedCard, setShowApprovedCard] = useState(false);
  const [showDeniedCard, setShowDeniedCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { id } = params;

  // Fetch the specific request using SWR
  const { request, isLoading: requestLoading, isError: requestError, mutate: mutateRequest } = useRequest(id);

  // Fetch business data associated with the request
  const { business, isLoading: businessLoading, isError: businessError } = useBusiness(request?.clerkUserID);

  const isLoading = requestLoading || businessLoading;
  const isError = requestError || businessError;

  // Handle approving the request
  const handleApprove = async () => {
    if (!request) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/request/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: id,
        }),
      });

      if (!response.ok) {
        throw new Error(t("failedToApprove"));
      }

      // Show approval card after successful API call
      setShowApprovedCard(true);
      mutateRequest();
      router.push("/admin/requests");
    } catch (error) {
      console.error("Error approving request:", error);
      alert(t("approveReqError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle showing the denial card
  const handleDeny = () => {
    setShowDeniedCard(true);
  };

  // Handle the actual denial with reason
  const handleDenyWithReason = async (denialMessage: string) => {
    try {
      const response = await fetch("/api/request/deny", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: id,
          denialMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(t("denyReqError"));
      }

      await mutateRequest();
      router.push("/admin/requests");
    } catch (error) {
      console.error("Error denying request:", error);
      throw error;
    }
  };

  return (
    <ResponsiveLayout title={t("req")}>
      {/* Refined responsive container */}
      <div className="relative min-h-screen bg-white px-3 sm:px-4 md:px-6 py-6 pb-[142px] md:pb-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Back to Requests button with status indicator - modified */}
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => router.push("/admin/requests")}
              className="flex items-center gap-2 bg-transparent text-[#405BA9] hover:bg-gray-100"
            >
              <span className="text-xl">←</span> {t("backToReq")}
            </Button>

            {request && request.status === "closed" && (
              <div
                className={`font-futura font-medium text-[24px] leading-[27px] ${
                  request.decision === "approved" ? "text-[#00A819]" : "text-[#AE0000]"
                }`}
              >
                {request.decision === "approved" ? t("approved") : t("denied")}
              </div>
            )}
          </div>

          {isLoading && (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-lg">{t("loadReq")}</p>
            </div>
          )}

          {isError && (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-lg text-red-500">{t("errLoadReq")}</p>
            </div>
          )}

          {!isLoading && !isError && request && (
            <>
              {/* Business Name Title - From old information */}
              <h2 className="font-futura font-bold text-[22px] sm:text-[26px] leading-[34.55px] text-black mb-6 sm:mb-8">
                {request.old?.businessName || t("businessName")}
              </h2>

              {/* Cards Container - Flex column on mobile, row on desktop */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-12 lg:mb-16">
                {/* Old Information Card */}
                <div className="w-full lg:flex-1 lg:min-w-0 lg:max-w-[50%]">
                  <h3 className="font-futura font-medium text-xl text-black mb-4">{t("oldInfo")}</h3>
                  <InformationCard type="old" businessInfo={request.old} otherBusinessInfo={request.new} />
                </div>

                {/* New Information Card */}
                <div className="w-full lg:flex-1 lg:min-w-0 lg:max-w-[50%]">
                  <h3 className="font-futura font-medium text-xl text-black mb-4">{t("newInfo")}</h3>
                  <InformationCard type="new" businessInfo={request.new} otherBusinessInfo={request.old} />
                </div>
              </div>

              {/* Action Buttons - Centered with proper spacing */}
              {request && request.status === "open" ? (
                <div className="flex flex-col items-center gap-4 mb-8 sm:mb-10">
                  <h3 className="font-futura font-medium text-[20px] sm:text-[24px] leading-[31.88px] text-black">
                    {t("allowChanges")}
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
        {showDeniedCard && (
          <RequestDeniedCard
            onClose={() => setShowDeniedCard(false)}
            onDenyWithReason={handleDenyWithReason}
            requestId={id}
          />
        )}
      </div>
    </ResponsiveLayout>
  );
}
