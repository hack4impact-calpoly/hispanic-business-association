"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useRef } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import MessageSentPopUp from "@/components/ui/AutomationsCards/MessageSentPopUp";
import { Button } from "@/components/ui/ShadcnComponents/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function BusinessSendNewMessagePage() {
  const t = useTranslations();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [title, setTitle] = useState("");
  const [directTo, setDirectTo] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState(t("selectAttch")); // To display selected file name
  const [message, setMessage] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const maxWords = 500;
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null); // Create a reference to the file input

  const handleFilterClick = () => {
    setIsPopUpVisible(true);
  };

  const closePopUp = () => {
    setIsPopUpVisible(false);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDirectToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDirectTo(event.target.value);
  };

  const handleBusinessTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBusinessType(event.target.value);
  };

  const handleAttachmentButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically trigger the file input's click
    }
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setAttachment(selectedFile);
      setAttachmentName(selectedFile.name); // Update the displayed file name
    } else {
      setAttachment(null);
      setAttachmentName(t("selectAttch"));
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setAttachmentName(t("selectAttch")); // Reset the displayed name
    // Optionally, you might want to clear the file input's value as well:
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean).length;

    if (words <= maxWords) {
      setMessage(text);
      setWordCount(words);
    } else {
      // If they try to type more, prevent input and show an alert
      event.preventDefault(); // Prevents further typing in some scenarios
      alert(`${t("maxWordLimit")} ${maxWords} ${t("words")}.`);
    }
  };

  const handleSave = () => {
    // Implement your save logic here, e.g., sending data to an API
    setIsPopUpVisible(true);
  };

  return (
    <ResponsiveLayout title={t("messages")}>
      <div className={`container ${isMobile ? "max-w-2xl px-1" : "max-w-4xl p-4"}`}>
        <div className={`pt-2 mb-6}`}>
          <div className="mb-6">
            <Button
              onClick={() => router.push("/admin/automations")}
              className="flex items-center gap-2 bg-transparent text-[#405BA9] hover:bg-gray-100"
            >
              <span className="text-xl">←</span> {t("backToAuto")}
            </Button>
          </div>
          <h2 className="font-[500] text-2xl md:text-[26px] mb-4">{t("sendNewMsg")}</h2>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <div>
              <label htmlFor="title" className="block text-[20px]">
                {t("title")}
              </label>
              <input
                type="text"
                id="title"
                className="mt-2 block w-full text-xl rounded-md border-2 border-black pl-1 h-[48px]"
                value={title}
                onChange={handleTitleChange}
              />
            </div>
            <div>
              <label htmlFor="directTo" className="block text-[20px] py-2">
                {t("directlyTo")}
              </label>
              <input
                type="text"
                id="title"
                className="mt-2 block w-full text-xl rounded-md border-2 border-black pl-1 h-[48px]"
                value={directTo}
                onChange={handleDirectToChange}
              />
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-6">
              {" "}
              {/* Nested grid for Business Type and Attachment on larger screens */}
              <div>
                <label htmlFor="businessType" className="block text-[20px] py-2">
                  {t("businessType")}
                </label>
                <select
                  id="businessType"
                  className="mt-2 block w-full text-gray-700 text-md rounded-md border-2 border-black pl-1 h-[48px]"
                  value={businessType}
                  onChange={handleBusinessTypeChange}
                >
                  <option>{t("chooseBizType")}</option>
                  <option value="type1">Business Type 1</option>
                  <option value="type2">Business Type 2</option>
                  <option value="type3">Business Type 3</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div>
                <label htmlFor="attachment" className="block text-[20px] py-2">
                  {t("inclAttach")}
                </label>
                <div className="mt-2 flex flex-row rounded-md shadow-sm">
                  <button
                    type="button"
                    className="w-full inline-flex items-center rounded-md border-2 border-black bg-white px-3 py-2 text-m text-gray-700 h-[48px]"
                    onClick={handleAttachmentButtonClick}
                  >
                    {attachmentName}
                    <div className="flex items-center ml-auto">
                      <Image src="/icons/Attach.png" className="w-5 h-5" alt="Attach" height={10} width={10}></Image>
                    </div>
                  </button>
                  <input
                    type="file"
                    id="attachment"
                    className="hidden" // Hide the default file input
                    onChange={handleAttachmentChange}
                    ref={fileInputRef} // Attach the ref
                  />
                  {attachment && (
                    <button type="button" className="mx-2" onClick={handleRemoveAttachment}>
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-1">
              {" "}
              {/* Ensures the textarea takes full width */}
              <label htmlFor="message" className="block text-[20px] py-2">
                {t("editMsg")}
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full h-[240px] inline-flex items-center rounded-md border-2 border-black bg-white px-3 py-2 text-m text-gray-700"
                value={message}
                onChange={handleMessageChange}
              />
              <p className="mt-2 text-sm text-gray-500 text-right">
                {wordCount}/{maxWords} {t("words")}
              </p>
            </div>
          </div>

          <div className="mt-6 mb-8 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleSave}
            >
              {t("save")}
            </button>
          </div>
          <MessageSentPopUp isOpen={isPopUpVisible} onClose={closePopUp}></MessageSentPopUp>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
