"use client";

import { useState, useEffect, useCallback } from "react";
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

const BUSINESS_DATA_KEY = "hba_business_data";
const CACHE_EXPIRATION = 600000; // 10 minutes

const FALLBACK_BUSINESS_DATA = {
  businessName: "Demo Business",
  businessType: "Technology",
  businessOwner: "Demo Owner",
  website: "example.com",
  description: "This is a demo business for testing purposes.",
  address: {
    street: "123 Main St",
    city: "San Luis Obispo",
    state: "CA",
    zip: 93401,
    county: "SLO County",
  },
  pointOfContact: {
    name: "Contact Person",
    phoneNumber: 1234567890,
    email: "contact@example.com",
  },
  socialMediaHandles: {
    IG: "@demobusiness",
    twitter: "@demobusiness",
    FB: "@demobusiness",
  },
  _id: "demo_id",
  clerkUserID: "demo_user_id",
};

export default function BusinessDashboardPage() {
  const [isEditAboutOpen, setIsEditAboutOpen] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const memberSince = "November 2023";
  const [retryCount, setRetryCount] = useState(0);

  const fetchBusinessData = useCallback(async () => {
    try {
      setLoading(true);

      if (!isSignedIn || !userId) {
        throw new Error("Authentication required");
      }

      const timestamp = new Date().getTime();
      const response = await fetch(`/api/business?_t=${timestamp}`, {
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
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();

      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(BUSINESS_DATA_KEY, JSON.stringify(cacheData));

      setBusinessData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");

      try {
        const cachedDataStr = localStorage.getItem(BUSINESS_DATA_KEY);
        if (cachedDataStr) {
          const { data } = JSON.parse(cachedDataStr);
          setBusinessData(data);
        } else if (retryCount >= 3) {
          setBusinessData(FALLBACK_BUSINESS_DATA as BusinessData);
        }
      } catch (cacheErr) {
        if (retryCount >= 3) {
          setBusinessData(FALLBACK_BUSINESS_DATA as BusinessData);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, userId, retryCount]);

  useEffect(() => {
    const initializeData = async () => {
      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        router.push("/");
        return;
      }

      try {
        const cachedDataStr = localStorage.getItem(BUSINESS_DATA_KEY);
        if (cachedDataStr) {
          const { data, timestamp } = JSON.parse(cachedDataStr);
          const cacheAge = Date.now() - timestamp;

          if (cacheAge < CACHE_EXPIRATION) {
            setBusinessData(data);
            setLoading(false);
            fetchBusinessData();
            return;
          }
        }
      } catch (e) {
        // Ignore error and continue fetching data
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      fetchBusinessData();
    };

    initializeData();
  }, [isLoaded, isSignedIn, userId, router, fetchBusinessData]);

  useEffect(() => {
    if (error && !businessData && retryCount < 3) {
      const timer = setTimeout(
        () => {
          setRetryCount((prevCount) => prevCount + 1);
          fetchBusinessData();
        },
        1500 * (retryCount + 1),
      );

      return () => clearTimeout(timer);
    }
  }, [error, businessData, retryCount, fetchBusinessData]);

  if (!isLoaded) {
    return (
      <ResponsiveLayout title="Dashboard">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-xl">Loading authentication...</div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (loading && !businessData) {
    return (
      <ResponsiveLayout title="Dashboard">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-xl">Loading business information...</div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (error && !businessData) {
    return (
      <ResponsiveLayout title="Dashboard">
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <div className="text-xl text-red-600 mb-4">Error loading business information: {error}</div>
          <Button onClick={fetchBusinessData} className="bg-blue-500 hover:bg-blue-600 text-white">
            Try Again
          </Button>
          {error.includes("Unauthorized") && (
            <div className="mt-4 p-4 text-amber-600 bg-amber-50 border border-amber-200 rounded-md">
              Authentication issue detected. This could be due to:
              <ul className="list-disc ml-6 mt-2">
                <li>Your session might have expired</li>
                <li>You may need to refresh the page</li>
                <li>Try logging out and back in again</li>
              </ul>
            </div>
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
            <div className="text-sm text-zinc-500 text-right relative left-[-5px] top-[10px]">
              Member since {memberSince}
            </div>
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

          <div className="flex flex-col md:flex-row md:gap-[67px] gap-6 mt-6 pb-[150px] md:pb-0">
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
