"use client";

import { useRouter } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import InformationCard from "@/components/ui/RequestsCards/RequestInformationCard";
import { useRequestHistoryById, useBusiness } from "@/hooks/swrHooks";
import { Button } from "@/components/ui/shadcnComponents/button";
import { useTranslations } from "next-intl";

interface RequestHistoryDetailPageProps {
  params: {
    id: string;
  };
}

export default function RequestHistoryDetailPage({ params }: RequestHistoryDetailPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const { id } = params;

  // Fetch the specific request history using SWR
  const { historyItem, isLoading: historyLoading, isError: historyError } = useRequestHistoryById(id);

  // Fetch business data associated with the request
  const { business, isLoading: businessLoading, isError: businessError } = useBusiness(historyItem?.clerkUserID);

  const isLoading = historyLoading || businessLoading;
  const isError = historyError || businessError;

  // Handle back button click
  const handleBackClick = () => {
    router.push("/admin/requests");
  };

  return (
    <ResponsiveLayout title="Request History">
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

            {historyItem && (
              <div
                className={`font-futura font-medium text-[24px] leading-[27px] ${
                  historyItem.decision === "approved" ? "text-[#00A819]" : "text-[#AE0000]"
                }`}
              >
                {historyItem.decision === "approved" ? "Approved" : "Denied"}
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

          {!isLoading && !isError && historyItem && (
            <>
              {/* Business Name Title - From old information */}
              <h2 className="font-futura font-bold text-[22px] sm:text-[26px] leading-[34.55px] text-black mb-6 sm:mb-8">
                {historyItem.old?.businessName || "Business Name"}
              </h2>

              {/* Cards Container - Flex column on mobile, row on desktop */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-12 lg:mb-16">
                {/* Old Information Card */}
                <div className="w-full lg:flex-1 lg:min-w-0 lg:max-w-[50%]">
                  <h3 className="font-futura font-medium text-xl text-black mb-4">{t("oldInfo")}</h3>
                  <InformationCard type="old" businessInfo={historyItem.old} otherBusinessInfo={historyItem.new} />
                </div>

                {/* New Information Card */}
                <div className="w-full lg:flex-1 lg:min-w-0 lg:max-w-[50%]">
                  <h3 className="font-futura font-medium text-xl text-black mb-4">{t("newInfo")}</h3>
                  <InformationCard type="new" businessInfo={historyItem.new} otherBusinessInfo={historyItem.old} />
                </div>
              </div>

              {/* Denial Message (if present) */}
              {historyItem.decision === "denied" && historyItem.denialMessage && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                  <h3 className="font-futura font-medium text-xl text-black mb-2">{t("reasonDenial")}</h3>
                  <p className="text-gray-700">{historyItem.denialMessage}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
}
