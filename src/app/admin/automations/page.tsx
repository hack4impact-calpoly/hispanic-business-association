"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useCallback } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import MessageCard from "@/components/ui/AutomationsCards/MessageCard";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSentMessages } from "@/hooks/swrHooks";

export default function BusinessAutomationsPage() {
  const t = useTranslations();
  const [sortOption, setSortOption] = useState<"latest" | "oldest" | "a-z" | "z-a">("latest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  const [showAll, setShowAll] = useState(false); // false = show last 30 days by default

  const { sentMessages, isLoading } = useSentMessages();

  const sortedMessages = useCallback(() => {
    if (!sentMessages) return [];

    let filtered = [...sentMessages];
    if (!showAll) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      filtered = filtered.filter((msg) => new Date(msg.createdAt) >= cutoff);
    }

    switch (sortOption) {
      case "latest":
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "oldest":
        return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "a-z":
        return filtered.sort((a, b) => (a.recipient?.directlyTo || "").localeCompare(b.recipient?.directlyTo || ""));
      case "z-a":
        return filtered.sort((a, b) => (b.recipient?.directlyTo || "").localeCompare(a.recipient?.directlyTo || ""));
      default:
        return filtered;
    }
  }, [sortOption, sentMessages, showAll]);

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSortOptionSelect = (option: "latest" | "oldest" | "a-z" | "z-a") => {
    setSortOption(option);
    setIsFilterOpen(false);
  };

  const renderMessages = () => (
    <div className="space-y-4">
      {isLoading ? (
        <p>Loading messages...</p>
      ) : sortedMessages().length === 0 ? (
        <p>No messages found.</p>
      ) : (
        sortedMessages().map((message, index) => (
          <MessageCard
            key={index}
            message={{
              _id: String(message._id),
              title: message.recipient?.directlyTo || message.recipient?.businessType || "Unknown",
              description: message.subject,
              date: message.createdAt,
            }}
          />
        ))
      )}
    </div>
  );

  const handleSendMessageClick = () => {
    router.push(`${pathname}/send-new-message`);
  };

  return (
    <ResponsiveLayout title={t("messages")}>
      <div className={`container ${isMobile ? "max-w-2xl px-1" : "max-w-2xl p-4"}`}>
        <button
          className={`bg-[#405BA9] w-full text-white rounded-full flex items-center mb-6 cursor-pointer ${
            isMobile ? "text-md py-1 px-2" : "text-[26px] py-2 px-2 gap-2"
          }`}
          onClick={handleSendMessageClick}
        >
          <Image
            src="/icons/Automations/Plus In Circle.png"
            className={`${isMobile ? "w-[40px] h-[40px]" : ""}`}
            alt="Plus Icon"
            width={40}
            height={40}
          />
          <span className={`flex-grow text-center ${isMobile ? "text-[18px]" : ""}`}>{t("sendNewMsg")}</span>
        </button>

        <div className="flex justify-between items-center mb-3 relative">
          <h2 className={`font-semibold ${isMobile ? "text-lg" : "text-[26px]"}`}>{t("recentMsgSent")}</h2>
          <div className="flex items-center gap-4">
            <button
              className="text-sm underline text-blue-600 hover:text-blue-800"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? t("showLast30Days") : t("showAll")}
            </button>
            <div className="relative">
              <button
                className={`flex items-center gap-1 ${isMobile ? "text-lg" : "text-[24px]"}`}
                onClick={handleFilterClick}
              >
                {t("sortBy")}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6`}>
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-md shadow-md z-10">
                  <button
                    onClick={() => handleSortOptionSelect("latest")}
                    className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${sortOption === "latest" ? "font-semibold" : ""}`}
                  >
                    {t("latest")}
                  </button>
                  <button
                    onClick={() => handleSortOptionSelect("oldest")}
                    className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${sortOption === "oldest" ? "font-semibold" : ""}`}
                  >
                    {t("Oldest")}
                  </button>
                  <button
                    onClick={() => handleSortOptionSelect("a-z")}
                    className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${sortOption === "a-z" ? "font-semibold" : ""}`}
                  >
                    A-Z
                  </button>
                  <button
                    onClick={() => handleSortOptionSelect("z-a")}
                    className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${sortOption === "z-a" ? "font-semibold" : ""}`}
                  >
                    Z-A
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {renderMessages()}
      </div>
    </ResponsiveLayout>
  );
}
