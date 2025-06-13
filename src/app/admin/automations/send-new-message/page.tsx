"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useRef, useEffect } from "react"; // Import useEffect
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import MessageSentPopUp from "@/components/ui/AutomationsCards/MessageSentPopUp";
import { Button } from "@/components/ui/shadcnComponents/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useBusinesses } from "@/hooks/swrHooks"; // Import useBusinesses hook
import { IBusiness } from "@/database/businessSchema";
import { BUSINESS_TYPES } from "@/database/types";

export default function BusinessSendNewMessagePage() {
  const t = useTranslations();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [subject, setSubject] = useState("");
  // `selectedBusinessId` will store the ID of the selected business for the dropdown
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  // `toAddresses` will still hold the actual email addresses for sending
  const [toAddresses, setToAddresses] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState(t("selectAttch")); // To display selected file name
  const [message, setMessage] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const maxWords = 500;
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch businesses using your SWR hook
  const { businesses, isLoading: isBusinessesLoading } = useBusinesses();

  // Effect to automatically set the email address when a business is selected
  useEffect(() => {
    if (selectedBusinessId && businesses) {
      const selectedBiz = businesses.find((biz) => (biz as IBusiness)._id?.toString() === selectedBusinessId) as
        | IBusiness
        | undefined;

      if (selectedBiz && selectedBiz.pointOfContact.email) {
        setToAddresses(selectedBiz.pointOfContact.email);
      } else {
        // If selected business has no email or is not found, clear toAddresses
        setToAddresses("");
      }
    } else {
      // If no business selected or businesses not loaded, clear toAddresses
      setToAddresses("");
    }
  }, [selectedBusinessId, businesses]);

  useEffect(() => {
    if (!attachment) {
      setAttachmentName(t("selectAttch"));
    }
  }, [t, attachment]);

  const closePopUp = () => {
    setIsPopUpVisible(false);
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  };

  // Modified handler for the business selection dropdown
  const handleBusinessSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setSelectedBusinessId(selectedId); // Update the selected business ID
    if (selectedId) {
      setBusinessType(""); // Clear business type if a business is selected
      // Set toAddresses immediately for single business
      const selectedBiz = businesses?.find((biz) => (biz as IBusiness)._id?.toString() === selectedId) as
        | IBusiness
        | undefined;
      if (selectedBiz && selectedBiz.pointOfContact.email) {
        setToAddresses(selectedBiz.pointOfContact.email);
      } else {
        setToAddresses("");
      }
    } else {
      // Reset everything if no business is selected
      setToAddresses("");
      setBusinessType("");
    }
  };

  const handleBusinessTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value;
    setBusinessType(type);
    if (type) {
      setSelectedBusinessId(""); // Clear selected business if a type is selected
      setToAddresses(""); // Clear toAddresses since it's only for single business
      // Print all emails in the selected type
      // (console.log removed)
    } else {
      // Reset everything if no type is selected
      setSelectedBusinessId("");
      setToAddresses("");
    }
  };

  const handleAttachmentButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setAttachment(selectedFile);
      setAttachmentName(selectedFile.name);
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
      // Removed alert as it can be annoying, consider a small message below the textarea
      // event.preventDefault();
      // alert(`You have reached the maximum word limit of ${maxWords} words.`);
    }
  };

  // Helper to get all emails for a business type
  const getEmailsByBusinessType = (type: string): string[] => {
    if (!businesses) return [];
    if (type === "ALL") {
      return businesses.map((biz) => biz.pointOfContact?.email).filter((email) => !!email);
    }
    return businesses
      .filter((biz) => biz.businessType === type)
      .map((biz) => biz.pointOfContact?.email)
      .filter((email) => !!email);
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    setApiError(null);

    let recipientList: string[] = [];
    if (selectedBusinessId) {
      // Send to selected business only
      // Always get the latest email for the selected business
      const selectedBiz = businesses?.find((biz) => (biz as IBusiness)._id?.toString() === selectedBusinessId) as
        | IBusiness
        | undefined;
      if (selectedBiz && selectedBiz.pointOfContact.email) {
        recipientList = [selectedBiz.pointOfContact.email];
      }
    } else if (businessType) {
      // Send to all businesses of selected type (or all)
      recipientList = getEmailsByBusinessType(businessType === "ALL" ? "ALL" : businessType);
      recipientList = Array.from(new Set(recipientList));
    }

    if (recipientList.length === 0) {
      setApiError("Please select a recipient business or business type.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("toAddresses", JSON.stringify(recipientList));
    formData.append("subject", subject);
    formData.append("body", message);
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsPopUpVisible(true);
        setSubject("");
        setSelectedBusinessId("");
        setToAddresses("");
        setBusinessType("");
        setAttachment(null);
        setAttachmentName("Select attachment");
        setMessage("");
        setWordCount(0);
      } else {
        const errorData = await response.json();
        setApiError(errorData.error || "Failed to send email.");
      }
    } catch (error: any) {
      console.error("Error sending email:", error);
      setApiError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort businesses for the dropdown
  const sortedBusinessesForDropdown = () => {
    if (!businesses) return [];
    let sorted = [...businesses];
    // Removed James' Test business
    return sorted.sort((a, b) => a.businessName.localeCompare(b.businessName));
  };

  if (isBusinessesLoading) {
    return (
      <ResponsiveLayout title="Messages">
        <div className="flex justify-center items-center h-screen">
          <p>Loading businesses for recipient list...</p>
        </div>
      </ResponsiveLayout>
    );
  }

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
              <label htmlFor="subject" className="block text-[20px]">
                {t("subject")}
              </label>
              <input
                type="text"
                id="subject"
                className="mt-2 block w-full text-xl rounded-md border-2 border-black pl-1 h-[48px]"
                value={subject}
                onChange={handleSubjectChange}
              />
            </div>
            {/* New dropdown for "Send To" */}
            <div>
              <label htmlFor="toBusiness" className="block text-[20px] py-2">
                {t("directlyTo")}
              </label>
              <select
                id="toBusiness"
                className="mt-2 block w-full text-gray-700 text-md rounded-md border-2 border-black pl-1 h-[48px]"
                value={selectedBusinessId}
                onChange={handleBusinessSelectChange}
              >
                <option value="">{t("selectBiz")}</option>
                {sortedBusinessesForDropdown().map((business) => (
                  <option key={(business as IBusiness)._id?.toString()} value={(business as IBusiness)._id?.toString()}>
                    {(business as IBusiness).businessName}
                  </option>
                ))}
              </select>
            </div>
            {/* Removed the original textarea for toAddresses */}
            <div className="md:grid md:grid-cols-2 md:gap-6">
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
                  <option value="">{t("chooseBizType")}</option>
                  <option value="ALL">All</option>
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
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
                      <Image
                        src="/icons/Automations/Attach.png"
                        className="w-5 h-5"
                        alt="Attach"
                        height={10}
                        width={10}
                      ></Image>
                    </div>
                  </button>
                  <input
                    type="file"
                    id="attachment"
                    className="hidden"
                    onChange={handleAttachmentChange}
                    ref={fileInputRef}
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
            {apiError && <p className="text-red-500 mr-4">{apiError}</p>}
            <Button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleSendEmail}
              disabled={isLoading}
            >
              {t("send")}
            </Button>
          </div>
          <MessageSentPopUp isOpen={isPopUpVisible} onClose={closePopUp}></MessageSentPopUp>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
