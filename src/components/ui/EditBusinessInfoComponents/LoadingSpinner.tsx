"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner = ({ message = "Loading...", size = "md", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn("border-2 border-current border-t-transparent rounded-full animate-spin", sizeClasses[size])}
      />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default LoadingSpinner;
