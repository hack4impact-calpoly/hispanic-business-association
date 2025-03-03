"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface EditAboutFormProps {
  onClose?: () => void;
  onSubmitSuccess?: () => void;
  initialDescription?: string;
}

export default function EditAboutForm({ onClose, onSubmitSuccess, initialDescription = "" }: EditAboutFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const WORD_LIMIT = 150;

  useEffect(() => {
    const timer = setTimeout(() => {
      setText(initialDescription);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [initialDescription]);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const isOverLimit = wordCount > WORD_LIMIT;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (feedback) setFeedback(null);
  };

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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit changes");
      }

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

  if (isLoading) {
    return (
      <article className="rounded-lg shadow-sm max-w-[805px] border border-gray-200 bg-white">
        <section className="flex flex-col py-6 w-full bg-white rounded-lg">
          <div className="flex justify-center items-center h-[400px]">
            <p className="text-gray-500 animate-pulse">Loading business information...</p>
          </div>
        </section>
      </article>
    );
  }

  return (
    <article className="rounded-lg shadow-sm max-w-[805px] border border-gray-200">
      <section className="flex flex-col py-6 w-full bg-white rounded-lg max-md:max-w-full">
        <div className="flex flex-col px-5 w-full max-md:max-w-full">
          <header className="flex flex-wrap gap-5 justify-between items-start text-xl font-medium text-black max-md:mr-2.5 max-md:max-w-full">
            <h1 className="mt-4">Edit About</h1>
            {onClose && (
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <Image src="/icons/Close.png" alt="Close" width={30} height={30} className="object-contain" />
              </button>
            )}
          </header>

          <hr className="shrink-0 mt-7 h-px border border-solid border-stone-300 max-md:max-w-full" />

          <p className="self-start mt-10 text-base font-[450] text-stone-500 max-md:max-w-full">
            Provide a brief overview and description about your business, including the key services or products it
            offers.
          </p>

          <textarea
            value={text}
            onChange={handleTextChange}
            className={`flex shrink-0 mt-8 bg-white rounded-lg border border-solid ${
              isOverLimit ? "border-red-500" : "border-slate-800"
            } h-[249px] w-full p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-md:max-w-full`}
            placeholder="Enter your business description..."
            aria-label="Business description"
            aria-describedby="word-count"
            disabled={isSubmitting}
          />
        </div>

        <div className="self-end mt-2.5 mr-5 flex items-center gap-2 max-md:mr-2.5">
          <p id="word-count" className={`text-base font-medium ${isOverLimit ? "text-red-600" : "text-black"}`}>
            {wordCount}/{WORD_LIMIT} words
          </p>
          {isOverLimit && <span className="text-xs text-red-600">Word limit exceeded</span>}
        </div>

        {feedback && (
          <div
            className={`mx-5 mt-4 p-3 rounded-md ${
              feedback.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
            role="alert"
          >
            {feedback.message}
          </div>
        )}

        <hr className="shrink-0 self-center mt-6 max-w-full h-px border border-solid border-stone-300 w-[765px] max-md:mt-4" />

        <div className="flex justify-end mt-6 mr-6 gap-4 max-md:mr-2.5">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isOverLimit}
            className={`gap-2.5 p-2.5 text-base font-bold text-white 
              ${isOverLimit || isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-[#405BA9] hover:bg-[#293241]"} 
              rounded-3xl min-h-10 transition-colors w-44 flex justify-center`}
          >
            {isSubmitting ? <span className="animate-pulse">Saving...</span> : "Submit Changes"}
          </button>
        </div>
      </section>
    </article>
  );
}
