"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { Card, CardContent } from "../shadcnComponents/card";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface RequestApprovedCardProps {
  onClose?: () => void;
  message?: string;
}

const RequestApprovedCard = ({ onClose, message }: RequestApprovedCardProps) => {
  const t = useTranslations();
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

  // Calculate card dimensions based on viewport
  const cardWidth = isMobile ? "85%" : Math.min(500, windowSize.width * 0.9) + "px";

  const cardHeight = isMobile ? "280px" : Math.min(500, windowSize.height * 0.9) + "px";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${
        isMobile ? "items-start pb-[25%]" : ""
      }`}
      onClick={onClose}
    >
      <div
        style={{ width: cardWidth, height: cardHeight, maxWidth: "500px" }}
        className="relative bg-white rounded-2xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-800 z-10"
          aria-label="Close"
        >
          <Image src="/icons/General_Icons/Close.png" alt="Close" width={20} height={20} />
        </button>

        <Card className="w-full h-full bg-[#D9D9D9] shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center h-full p-8">
            <Image
              src="/icons/Requests/Request Approved.png"
              alt="Request Approved Icon"
              width={102}
              height={102}
              className="mb-6"
            />
            <p className="text-[26px] text-center font-medium">{t("changesApproved")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestApprovedCard;
