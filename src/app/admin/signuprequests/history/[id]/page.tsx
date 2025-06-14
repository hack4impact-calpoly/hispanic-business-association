"use client";

import { useRouter } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import InformationCard from "@/components/ui/RequestsCards/RequestInformationCard";
import { useSignUpRequest } from "@/hooks/swrHooks";
import { Button } from "@/components/ui/shadcnComponents/button";
import { useTranslations } from "next-intl";

interface SignupHistoryDetailPageProps {
  params: {
    id: string;
  };
}

export default function SignupHistoryDetailPage({ params }: SignupHistoryDetailPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const { id } = params;

  // Fetch the specific signup request using SWR
  const { request: signupRequest, isLoading, isError } = useSignUpRequest(id);

  // Handle back button click
  const handleBackClick = () => {
    router.push("/admin/requests");
  };

  const signupInfo = signupRequest
    ? {
        businessName: signupRequest.businessName,
        businessType: signupRequest.businessType,
        businessOwner: signupRequest.businessOwner,
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
      }
    : null;

  return (
    <ResponsiveLayout title="Signup Request History">
      <div className="relative min-h-screen bg-white px-3 sm:px-4 md:px-6 py-6 pb-[142px] md:pb-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Back to Requests button with status indicator */}
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={handleBackClick}
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
              <p className="text-lg">{t("loadReqHistory")}</p>
            </div>
          )}

          {!isLoading && isError && (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-lg text-red-500">{t("errLoadReq")}</p>
            </div>
          )}

          {!isLoading && !isError && signupInfo && (
            <>
              {/* Business Name Title */}
              <h2 className="font-futura font-bold text-[22px] sm:text-[26px] leading-[34.55px] text-black mb-6 sm:mb-8">
                {signupInfo.businessName}
              </h2>

              {/* Signup Information Card */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-12 lg:mb-16">
                <div className="w-full flex justify-center">
                  <div className="w-full lg:max-w-[600px]">
                    <h3 className="font-futura font-medium text-xl text-black mb-4">{t("signupInfo")}</h3>
                    <InformationCard type="signup" businessInfo={signupInfo} />
                  </div>
                </div>
              </div>

              {/* Denial Message */}
              {signupRequest && signupRequest.decision === "denied" && signupRequest.denialMessage && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                  <h3 className="font-futura font-medium text-xl text-black mb-2">{t("reasonDenial")}</h3>
                  <p className="text-gray-700">{signupRequest.denialMessage}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
}
