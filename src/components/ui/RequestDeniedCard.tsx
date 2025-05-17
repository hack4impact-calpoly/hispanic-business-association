"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "./card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";

interface RequestDeniedCardProps {
  onClose?: () => void;
}

const RequestDeniedCard = ({ onClose }: RequestDeniedCardProps) => {
  const t = useTranslations();
  const [denialReason, setDenialReason] = useState("");
  const isMobile = useIsMobile();
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // Track window resize for responsive scaling
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const countWords = (text: string) => {
    return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const words = countWords(event.target.value);
    if (words <= 500) {
      setDenialReason(event.target.value);
    }
  };

  const handleSend = () => {
    // Here you could implement sending the denial reason
    if (onClose) onClose();
  };

  // Calculate card dimensions based on viewport
  const cardWidth = isMobile ? "85%" : Math.min(500, windowSize.width * 0.9) + "px";
  const cardHeight = isMobile ? "calc(100vh - 200px)" : Math.min(650, windowSize.height * 0.9) + "px";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${
        isMobile ? "items-start pb-[25%]" : ""
      }`}
      onClick={onClose}
    >
      <div
        style={{
          width: cardWidth,
          height: cardHeight,
          maxWidth: "500px",
          maxHeight: isMobile ? "calc(100vh - 200px)" : "650px",
        }}
        className="relative bg-white rounded-2xl shadow-lg mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-800 z-10"
          aria-label="Close"
        >
          <Image src="/icons/Close.png" alt="Close" width={20} height={20} />
        </button>

        <Card className="w-full h-full bg-[#D9D9D9] shadow-lg rounded-2xl overflow-auto">
          <CardContent className="flex flex-col h-full px-8 sm:px-16 py-4">
            {/* Top content with reduced padding for mobile */}
            <div className={`flex flex-col items-center ${isMobile ? "pt-4" : "pt-10"} mb-4`}>
              <Image
                src="/icons/Request Denied.png"
                alt="Request Denied Icon"
                width={102}
                height={102}
                className="mb-4"
              />
              <p className="text-[26px] font-semibold text-center">{t("deniedChanges")}</p>
            </div>

            {/* Middle section with textarea - takes up remaining space */}
            <div className="w-full flex-1 flex flex-col">
              <textarea
                className="w-full flex-1 p-3 text-sm border border-gray-400 rounded-md resize-none min-h-[100px] mt-5"
                placeholder="Reason for denial"
                value={denialReason}
                onChange={handleInputChange}
              />
              <p className="mt-1 text-xs text-gray-600 text-right">
                {countWords(denialReason)}/500 {t("words")}
              </p>
            </div>

            {/* Button with reduced margins for mobile */}
            <div className={`w-full mt-3 ${isMobile ? "mb-4" : "mb-6"}`}>
              <button className="w-full h-12 bg-[#405BA9] text-white rounded-full font-medium" onClick={handleSend}>
                {t("send")}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestDeniedCard;
