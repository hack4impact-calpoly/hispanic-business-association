"use client";

import Image from "next/image";
import { Card, CardContent } from "../shadcnComponents/card";
import React from "react";
import ReactDOM from "react-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";

interface MessageSentPopUpProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessageSentPopUp: React.FC<MessageSentPopUpProps> = ({ isOpen, onClose }) => {
  const t = useTranslations();

  const isMobile = useIsMobile();

  if (!isOpen) {
    return null;
  }

  const cardWidth = isMobile ? "w-[300px]" : "w-[400px]";
  const cardHeight = isMobile ? "h-[300px]" : "h-[400px]";
  const iconSize = isMobile ? 100 : 140;
  const messageFontSize = isMobile ? "text-xl" : "text-2xl";

  return ReactDOM.createPortal(
    <div
      className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <Card
        className={`relative bg-gray-200 rounded-xl shadow-md max-w-md flex justify-center items-center flex-col ${cardWidth} ${cardHeight}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>
        <CardContent className="flex flex-col justify-center items-center p-6">
          <Image src="/icons/Automations/Check In Circle.png" alt="Success Icon" width={iconSize} height={iconSize} />
          <p className={`font-futura mt-4 text-center ${messageFontSize}`}>{t("messageSent")}</p>
        </CardContent>
      </Card>
    </div>,
    document.body,
  );
};

export default MessageSentPopUp;
