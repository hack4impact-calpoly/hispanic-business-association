"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";

// Configures component behavior
interface EditAboutFormProps {
  onClose?: () => void;
  onSubmitSuccess?: () => void;
  initialDescription?: string;
}

// Renders edit form
export default function EditAboutForm({ onClose, onSubmitSuccess, initialDescription = "" }: EditAboutFormProps) {
  // Tracks text content
  const [text, setText] = useState("");
  // Tracks submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Tracks loading state
  const [isLoading, setIsLoading] = useState(true);
  // Tracks feedback from server
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  // Word limit constant
  const WORD_LIMIT = 150;

  // Sets text after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setText(initialDescription);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [initialDescription]);

  // Calculates current word count
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  // Checks if word limit is exceeded
  const isOverLimit = wordCount > WORD_LIMIT;

  // Handles text input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (feedback) setFeedback(null);
  };

  // Submits form data
  const handleSubmit = async () => {
    if (isOverLimit) {
      setFeedback({
        type: "error",
        message: `Please reduce your description to ${WORD_LIMIT} words or less.`,
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: text,
          date: new Date().toLocaleDateString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit changes");
      }

      // Calls optional callback when submit succeeds
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        setFeedback({
          type: "success",
          message: "Your changes have been submitted for approval!",
        });
      }
    } catch (error: any) {
      console.error("Error submitting changes:", error);
      setFeedback({
        type: "error",
        message: error.message || "An error occurred while submitting your changes. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shows loading state
  if (isLoading) {
    return (
      <article className="rounded-lg shadow-sm w-full max-w-[805px] md:max-w-[805px] border border-gray-200 bg-white">
        <section className="flex flex-col py-4 md:py-6 w-full bg-white rounded-lg">
          <div className="flex justify-center items-center h-[200px] md:h-[400px]">
            <p className="text-gray-500 animate-pulse">Loading business information...</p>
          </div>
        </section>
      </article>
    );
  }

  // Renders form for editing description
  return (
    <article className="fixed inset-x-0 top-0 bottom-[92px] z-[60] h-[calc(100vh-92px)] bg-white overflow-y-auto sm:rounded-lg w-full max-w-full md:top-12 md:bottom-auto md:h-auto md:max-h-[90vh] md:mx-auto md:left-0 md:right-0 md:w-[805px] border border-gray-200">
      {/* <article className="rounded-lg shadow-sm w-full max-w-full md:max-w-[805px] border border-gray-200"> */}
      <section className="flex flex-col py-4 md:py-6 w-full bg-white rounded-lg">
        <div className="flex flex-col px-4 md:px-5 w-full">
          <header className="flex flex-wrap gap-2 md:gap-5 justify-between items-start">
            <h1 className="mt-2 md:mt-4 text-lg md:text-xl font-medium text-black">Edit About</h1>
            {onClose && (
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <Image
                  src="/icons/Close.png"
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
            Provide brief overview and description about your business, including key services or products offered.
          </p>

          <textarea
            value={text}
            onChange={handleTextChange}
            className={`flex shrink-0 mt-4 md:mt-8 bg-white rounded-lg border border-solid 
              ${isOverLimit ? "border-red-500" : "border-slate-800"} 
              h-[150px] md:h-[249px] w-full p-3 md:p-4 resize-none 
              focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your business description..."
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
            {wordCount}/{WORD_LIMIT} words
          </p>
          {isOverLimit && <span className="text-xs text-red-600">Word limit exceeded</span>}
        </div>

        {feedback && (
          <div
            className={`mx-3 md:mx-5 mt-2 md:mt-4 p-2 md:p-3 rounded-md text-sm md:text-base
              ${feedback.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            role="alert"
          >
            {feedback.message}
          </div>
        )}

        <hr className="shrink-0 self-center mt-4 md:mt-6 max-w-full h-px border border-solid border-stone-300 w-[90%] md:w-[765px]" />

        <div className="flex justify-end mt-4 md:mt-6 mr-3 md:mr-6 gap-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isOverLimit}
            className={`gap-2.5 py-2 px-4 md:py-2.5 md:px-5 text-sm md:text-base font-bold text-white 
              ${isOverLimit || isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-[#405BA9] hover:bg-[#293241]"} 
              rounded-3xl min-h-[36px] md:min-h-[40px] transition-colors w-auto flex justify-center items-center`}
          >
            {isSubmitting ? <span className="animate-pulse">Saving...</span> : "Submit Changes"}
          </button>
        </div>
      </section>
    </article>
  );
}
