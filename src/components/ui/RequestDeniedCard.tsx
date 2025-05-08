"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { Card, CardContent } from "./card";
import { useTranslations } from "next-intl";

const RequestDeniedCard = () => {
  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(true);
  const [denialReason, setDenialReason] = useState("");

  //Function to count words
  const countWords = (text: string) => {
    return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const words = countWords(event.target.value);
    if (words <= 500) {
      setDenialReason(event.target.value);
    }
  };

  return isOpen ? (
    <div className="fixed top-[189px] left-[45px] w-[305px] h-[533px] bg-white shadow-lg rounded-2xl z-50 ">
      {/* Close Button */}
      <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-600">
        <Image src="/icons/Close.png" alt="Close Button" width={15} height={20} />
      </button>

      <Card className="w-full h-full bg-[#D9D9D9] shadow-lg rounded-2xl p-4 sm:p-6 flex flex-col items-center">
        <CardContent className="flex flex-col items-center w-full">
          {/* Request Denied Icon */}
          <Image
            src="/icons/Request Denied.png"
            alt="Request Denied Icon"
            width={102}
            height={102}
            className="pt-[42px]"
          />

          {/* Title */}
          <p className="mt-4 text-lg sm:text-[22px] text-center font-semibold">{t("deniedChanges")}</p>

          {/* Textarea and Word Count Container */}
          <div className="w-full mt-4">
            {/* Textarea for Reason */}
            <textarea
              className="w-full h-[212px] p-1 text-sm border border-gray-400 rounded-md resize-none"
              placeholder="Reason for denial"
              value={denialReason}
              onChange={handleInputChange}
            />

            {/* Word Counter Positioned Below the Textarea */}
            <p className="text-xs text-gray-600 text-right">
              {countWords(denialReason)}/500 {t("words")}
            </p>

            {/* Send Button */}
            <button
              className="w-full h-[41px] mt-1 bg-[#405BA9] text-white rounded-full"
              onClick={() => alert("Denial reason sent!")}
            >
              {t("send")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : null;
};

export default RequestDeniedCard;
