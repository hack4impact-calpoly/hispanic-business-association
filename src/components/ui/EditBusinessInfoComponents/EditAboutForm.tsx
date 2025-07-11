"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useActiveBusinessRequest } from "@/hooks/swrHooks";
import { useTranslations } from "next-intl";

// Define form props for About section editing
interface EditAboutFormProps {
  onClose?: () => void;
  onSubmitSuccess?: () => void;
  initialDescription?: string;
}

export default function EditAboutForm({ onClose, onSubmitSuccess, initialDescription = "" }: EditAboutFormProps) {
  const t = useTranslations();
  // Store current text content
  const [text, setText] = useState("");
  // Track original text for change detection
  const [originalText, setOriginalText] = useState("");
  // Manage submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Control loading state
  const [isLoading, setIsLoading] = useState(true);
  // Hold server response feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  // Set maximum word count
  const WORD_LIMIT = 150;

  // Fetch active request if exists
  const { activeRequest, isLoading: isRequestLoading } = useActiveBusinessRequest();
  // Store request ID if one exists
  const [existingRequestId, setExistingRequestId] = useState<string | undefined>(undefined);

  // Initialize text and originalText from active request or props
  useEffect(() => {
    const timer = setTimeout(() => {
      let currentDescription = initialDescription;
      if (activeRequest && activeRequest.description !== undefined && activeRequest.description !== null) {
        currentDescription = activeRequest.description;
        setExistingRequestId((activeRequest as any)._id);
      }
      setText(currentDescription);
      setOriginalText(currentDescription); // Initialize original text
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [initialDescription, activeRequest]);

  // Calculates current word count
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  // Check for word limit excess
  const isOverLimit = wordCount > WORD_LIMIT;

  // Process text input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (feedback) setFeedback(null); // Clear feedback on new input
  };

  // Submit form when text has changed
  const handleSubmit = async () => {
    if (isOverLimit) {
      setFeedback({ type: "error", message: `${t("reduceDescription")}${WORD_LIMIT} ${t("wordsLess")}` });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // Check if text has actually changed
    if (text === originalText) {
      setFeedback({ type: "info", message: t("No change detected.") });
      setIsSubmitting(false);
      return;
    }

    try {
      const requestData: { description: string; date: string; requestId?: string } = {
        description: text,
        date: new Date().toISOString(),
      };

      if (existingRequestId) {
        requestData.requestId = existingRequestId;
      }

      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("failedChanges"));
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        setFeedback({ type: "success", message: t("changesSent") });
      }
      // Update original text to current text after successful submission
      setOriginalText(text);
    } catch (error: any) {
      console.error("Error submitting changes:", error);
      setFeedback({ type: "error", message: error.message || t("errorSubmittingChanges") });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display loading indicator
  if (isLoading || isRequestLoading) {
    return (
      <article className="rounded-lg shadow-sm w-full max-w-[805px] md:max-w-[805px] border border-gray-200 bg-white">
        <section className="flex flex-col py-4 md:py-6 w-full bg-white rounded-lg">
          <div className="flex justify-center items-center h-[200px] md:h-[400px]">
            <p className="text-gray-500 animate-pulse">{t("loadBizInfo")}</p>
          </div>
        </section>
      </article>
    );
  }

  // Render description edit form
  return (
    <article className="fixed inset-x-0 top-0 bottom-[92px] z-[60] h-[calc(103vh-92px)] bg-white overflow-y-auto sm:rounded-lg w-full max-w-full md:fixed md:inset-0 md:m-auto md:top-auto md:bottom-auto md:h-auto md:max-h-[90vh] md:mx-auto md:left-0 md:right-0 md:w-[805px] border border-gray-200">
      <section className="flex flex-col py-4 md:py-6 w-full bg-white rounded-lg">
        <div className="flex flex-col px-4 md:px-5 w-full">
          <header className="flex flex-wrap gap-2 md:gap-5 justify-between items-start">
            <h1 className="mt-2 md:mt-4 text-lg md:text-xl font-medium text-black">{t("editAbout")}</h1>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#f0f0f0] transition-colors absolute top-2 right-2"
                aria-label="Close"
              >
                <Image
                  src="/icons/General_Icons/Close.png"
                  alt="Close"
                  width={24}
                  height={24}
                  className="md:w-[30px] md:h-[30px] object-contain"
                />
              </button>
            )}
          </header>

          <hr className="shrink-0 mt-4 md:mt-7 h-px border border-solid border-stone-300" />

          <p className="self-start mt-4 md:mt-10 text-sm md:text-base font-[450] text-stone-500">
            {t("descriptionText")}
          </p>

          <textarea
            value={text}
            onChange={handleTextChange}
            className={`flex shrink-0 mt-4 md:mt-8 bg-white rounded-lg border border-solid 
              ${isOverLimit ? "border-red-500" : "border-slate-800"} 
              h-[calc(100vh-350px)] min-h-[200px] md:h-[249px] w-full p-3 md:p-4 resize-none 
              focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder={t("bizDesc")}
            aria-label="Business description"
            aria-describedby="word-count"
            disabled={isSubmitting}
          />
        </div>

        <div className="self-end mt-2 mr-3 md:mr-5 flex items-center gap-2">
          <p
            id="word-count"
            className={`text-sm md:text-base font-medium ${isOverLimit ? "text-red-600" : "text-black"}`}
          >
            {wordCount}/{WORD_LIMIT} {t("words")}
          </p>
          {isOverLimit && <span className="text-xs text-red-600">{t("wordLimitExceeded")}</span>}
        </div>

        {feedback && (
          <div
            className={`mx-3 md:mx-5 mt-2 md:mt-4 p-2 md:p-3 rounded-md text-sm md:text-base
              ${feedback.type === "success" ? "bg-green-50 text-green-800" : feedback.type === "error" ? "bg-red-50 text-red-800" : "bg-blue-50 text-blue-800"}`}
            role="alert"
          >
            {feedback.message}
          </div>
        )}

        <hr className="shrink-0 self-center mt-4 md:mt-6 max-w-full h-px border border-solid border-stone-300 w-[90%] md:w-[765px]" />

        <div className="flex justify-end mt-4 md:mt-6 mx-3 md:mr-6 gap-4 mb-5">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isOverLimit || isLoading}
            className={`gap-2.5 py-2 px-4 md:py-2.5 md:px-5 text-sm md:text-base font-bold text-white 
              ${isOverLimit || isSubmitting || isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-[#405BA9] hover:bg-[#293241]"} 
              rounded-3xl min-h-[36px] md:min-h-[40px] transition-colors w-full md:w-auto flex justify-center items-center`}
          >
            {isSubmitting ? <span className="animate-pulse">{t("saving")}</span> : t("submitChanges")}
          </button>
        </div>
      </section>
    </article>
  );
}
