"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "./card";

interface RequestDeniedCardProps {
  onClose?: () => void;
  onDenyWithReason: (reason: string) => Promise<void>;
  requestId: string;
}

const RequestDeniedCard = ({ onClose, onDenyWithReason, requestId }: RequestDeniedCardProps) => {
  const [denialReason, setDenialReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countWords = (text: string) => {
    return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = countWords(e.target.value);
    if (words <= 500) {
      setDenialReason(e.target.value);
    }
  };

  const handleSend = async () => {
    if (denialReason.trim() === "") return;

    setIsSubmitting(true);
    try {
      await onDenyWithReason(denialReason);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error denying request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6 overflow-y-auto">
      <article className="fixed inset-x-0 top-0 bottom-[92px] z-[60] h-[calc(100vh-92px)] bg-white overflow-y-auto rounded-none md:rounded-2xl w-full max-w-full md:relative md:top-auto md:bottom-auto md:h-auto md:min-h-[600px] md:max-h-[calc(100vh-48px)] md:mx-auto md:left-0 md:right-0 md:w-[500px] border border-gray-200">
        <Card className="w-full h-full bg-[#D9D9D9] shadow-lg rounded-none md:rounded-2xl overflow-hidden border-none">
          <CardContent className="flex flex-col h-full px-4 sm:px-8 py-4 md:min-h-[600px]">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-800 z-10"
              aria-label="Close"
            >
              <Image src="/icons/Close.png" alt="Close" width={20} height={20} />
            </button>

            <div className="flex flex-col items-center pt-4 md:pt-10 mb-4">
              <Image
                src="/icons/Request Denied.png"
                alt="Request Denied Icon"
                width={102}
                height={102}
                className="mb-4"
              />
              <p className="text-[26px] font-semibold text-center">Changes Denied!</p>
            </div>

            <div className="w-full flex-1 flex flex-col">
              <textarea
                className="w-full flex-1 p-3 text-lg border border-gray-400 rounded-md resize-none min-h-[100px] mt-5"
                placeholder="Reason for denial"
                value={denialReason}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <p className="mt-1 text-medium text-gray-600 text-right">{countWords(denialReason)}/500 words</p>
            </div>

            <div className="w-full mt-4 mb-4">
              <button
                className="w-full h-12 bg-[#405BA9] text-white rounded-full font-lg disabled:bg-blue-300"
                onClick={handleSend}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  );
};

export default RequestDeniedCard;
