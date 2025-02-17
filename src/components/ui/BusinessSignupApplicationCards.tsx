"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "./card";
import { useRouter } from "next/navigation";
import { StringToBoolean } from "class-variance-authority/types";

interface BusinessSignupAppInfo {
  contactInfo: BusinessContactInfo;
  businessInfo: BusinessInfo;
  socialLinks?: SocialLink[];
}

interface BusinessContactInfo {
  name: string;
  title: string;
  phoneNumber?: number;
  cellNumber?: number;
  email: string;
}

interface BusinessInfo {
  name: string;
  websiteURL?: string;
  numEmployees?: number;
  physicalAddress: Address;
  mailingAddress: Address;
}

interface Address {
  address: string;
  city: string;
  state: string;
  zip: number;
}

type SocialPlatform = "Facebook" | "Instagram" | "X" | "LinkedIn";
interface SocialLink {
  platform: SocialPlatform;
  handle: string;
}

const BusinessSignupApplication = () => {
  const router = useRouter();

  return (
    <Card className="relative w-[70vw] h-[350px] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
      <CardContent className="flex flex-col h-screen"></CardContent>
    </Card>
  );
};

export default BusinessSignupApplication;
