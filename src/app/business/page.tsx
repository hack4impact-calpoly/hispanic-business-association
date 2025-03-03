"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import BusinessInfoCard from "@/components/ui/BusinessInfoCard";
import ContactInfoCard from "@/components/ui/ContactInfoCard";
import AboutCard from "@/components/ui/AboutCard";
import EditAboutForm from "@/components/ui/EditAboutForm";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface BusinessData {
  businessName: string;
  businessType: string;
  businessOwner: string;
  website: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: number;
    county: string;
  };
  pointOfContact: {
    name: string;
    phoneNumber: number;
    email: string;
  };
  socialMediaHandles: {
    IG?: string;
    twitter?: string;
    FB?: string;
  };
  _id: string;
  clerkUserID: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithAuthAwareness = async (url: string, maxRetries = 5, initialDelay = 1000) => {
  let attempts = 0;
  let lastError;

  await delay(500);

  while (attempts < maxRetries) {
    try {
      const timestamp = new Date().getTime();
      const urlWithTimestamp = `${url}${url.includes("?") ? "&" : "?"}_t=${timestamp}`;

      const response = await fetch(urlWithTimestamp, {
        cache: "no-store",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }));
        const errorMessage = errorData.error || `HTTP error ${response.status}`;

        if (response.status === 401) {
          attempts++;

          if (attempts >= maxRetries) {
            throw new Error(errorMessage);
          }

          const delayTime = initialDelay * Math.pow(1.5, attempts) * (0.9 + Math.random() * 0.2);
          await delay(delayTime);
          continue;
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error: any) {
      lastError = error;
      attempts++;

      if (attempts >= maxRetries) {
        throw error;
      }

      const delayTime = 500 * attempts;
      await delay(delayTime);
    }
  }

  throw lastError;
};

export default function BusinessDashboardPage() {
  const [isEditAboutOpen, setIsEditAboutOpen] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { userId, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  // Modify this when schema supports join date
  const memberSince = "November 2023";

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuthAwareness("/api/business");
      setBusinessData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        router.push("/");
        return;
      }

      await delay(1000);
      fetchBusinessData();
    };

    initializeData();
  }, [isLoaded, isSignedIn, userId, router]);

  useEffect(() => {
    if (error?.includes("Unauthorized") && retryCount < 3) {
      const retryTimer = setTimeout(
        () => {
          setRetryCount(retryCount + 1);
          fetchBusinessData();
        },
        2000 * (retryCount + 1),
      );

      return () => clearTimeout(retryTimer);
    }
  }, [error, retryCount]);

  if (!isLoaded) {
    return (
      <ResponsiveLayout title="Dashboard">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-xl">Loading authentication...</div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (loading) {
    return (
      <ResponsiveLayout title="Dashboard">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-xl">Loading business information...</div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (error) {
    return (
      <ResponsiveLayout title="Dashboard">
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <div className="text-xl text-red-600 mb-4">Error loading business information: {error}</div>
          <Button
            onClick={() => {
              setRetryCount(retryCount + 1);
              fetchBusinessData();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Try Again
          </Button>
          {error.includes("Unauthorized") && (
            <div className="mt-4 text-amber-600">Authentication issue detected. You may need to refresh the page.</div>
          )}
        </div>
      </ResponsiveLayout>
    );
  }

  if (!businessData) {
    return (
      <ResponsiveLayout title="Dashboard">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-xl">No business information found. Please contact support.</div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="Dashboard">
      {isEditAboutOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
          onClick={() => setIsEditAboutOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="z-50 w-full max-w-4xl">
            <EditAboutForm onClose={() => setIsEditAboutOpen(false)} initialDescription={businessData.description} />
          </div>
        </div>
      )}

      <div className="flex flex-col w-full bg-white relative">
        <div className="relative w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] h-[193px] bg-gray-100 md:-mt-1 mt-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#293241] to-[#405BA9] opacity-20"></div>

          <button
            className="absolute top-[15px] right-[11.57px] w-[30px] h-[30px] rounded-full bg-[#D9D9D9] flex items-center justify-center z-10"
            onClick={() => {}}
          >
            <Image src="/icons/Edit.png" alt="Edit Banner" width={15} height={15} />
          </button>
        </div>

        <div className="absolute top-[118px] md:left-[40px] left-[20px] w-[150px] h-[150px] bg-white rounded-full shadow-lg flex items-center justify-center p-1">
          <Image
            src="/logo/HBA_NoBack_NoWords.png"
            alt="Business Logo"
            width={140}
            height={140}
            style={{ height: "auto" }}
            className="rounded-full object-cover"
          />
        </div>

        <div className="mx-5 md:ml-[60px] md:mr-[40px] max-w-full mt-[90px]">
          <div className="flex flex-wrap justify-between items-start md:w-[1155px] w-full">
            <h2 className="text-2xl font-medium text-black">Welcome, {businessData.businessName}</h2>
            <div className="text-sm text-zinc-500 text-right mr-1 pt-2">Member since {memberSince}</div>
          </div>

          <div className="flex items-center gap-2 px-5 py-3 mt-5 w-full md:w-[1155px] h-[38px] text-sm font-medium text-red-600 rounded-[15px] bg-red-100 border border-red-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div className="flex-auto">
              Membership expires in 1 month. <button className="underline font-medium">Renew here now.</button>
            </div>
          </div>

          <div className="mt-6">
            <AboutCard info={{ description: businessData.description }} onEdit={() => setIsEditAboutOpen(true)} />
          </div>

          <div className="flex flex-col md:flex-row md:gap-[67px] gap-6 mt-6 pb-[150px] md:pb-[100px]">
            <BusinessInfoCard
              info={{
                name: businessData.businessName,
                type: businessData.businessType,
                owner: businessData.businessOwner,
                website: businessData.website,
                address: {
                  street: businessData.address.street,
                  suite: "",
                  city: businessData.address.city,
                  state: businessData.address.state,
                  zip: businessData.address.zip.toString(),
                },
              }}
            />
            <ContactInfoCard
              info={{
                pointOfContact: businessData.pointOfContact.name,
                phone: businessData.pointOfContact.phoneNumber.toString(),
                email: businessData.pointOfContact.email,
                socialMedia:
                  businessData.socialMediaHandles.FB ||
                  businessData.socialMediaHandles.IG ||
                  businessData.socialMediaHandles.twitter ||
                  "",
              }}
            />
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
