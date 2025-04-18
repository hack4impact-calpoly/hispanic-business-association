"use client";

import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MobileTestPage() {
  const isMobile = useIsMobile();
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Mobile Detection Test</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded-md bg-gray-50">
          <p className="text-lg font-semibold">useIsMobile() result:</p>
          <p className={`text-xl font-bold ${isMobile ? "text-green-600" : "text-red-600"}`}>
            {isMobile ? "TRUE ✓" : "FALSE ✗"}
          </p>
        </div>

        <div className="p-4 border rounded-md bg-gray-50">
          <p className="text-lg font-semibold">Current window width:</p>
          <p className="text-xl font-bold">
            {windowWidth}px {windowWidth !== null && windowWidth < 768 ? "(Mobile Range)" : "(Desktop Range)"}
          </p>
        </div>

        <div className="p-4 border rounded-md bg-gray-50">
          <p className="text-lg font-semibold mb-2">Debug Information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Mobile breakpoint: <span className="font-mono">768px</span>
            </li>
            <li>
              CSS media query: <span className="font-mono">(max-width: 767px)</span>
            </li>
            <li>
              Environment: <span className="font-mono">{windowWidth !== null ? "Client-side" : "Server-side"}</span>
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Responsive Elements Test:</h2>
          <div className="bg-blue-100 p-4 rounded-md">
            <p className="hidden md:block text-blue-800">This text only shows on DESKTOP (md and up)</p>
            <p className="block md:hidden text-red-800">This text only shows on MOBILE (smaller than md)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
