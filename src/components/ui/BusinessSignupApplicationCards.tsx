"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "./card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";

interface BusinessSignupAppInfo {
  contactInfo: BusinessContactInfo;
  businessInfo: BusinessInfo;
  socialLinks?: SocialLink[];
}

interface BusinessContactInfo {
  name: string;
  title: string;
  phoneNumber?: string;
  cellNumber?: string;
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
  zip: string;
}

type SocialPlatform = "Facebook" | "Instagram" | "X" | "LinkedIn";
interface SocialLink {
  platform: SocialPlatform;
  handle: string;
}

const BusinessSignupApplication = () => {
  const router = useRouter();

  const pageSubtitles = ["Social Links", "Contact Information", "Business Information"];

  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<BusinessSignupAppInfo>({
    defaultValues: {
      contactInfo: { name: "", title: "", phoneNumber: "", cellNumber: "", email: "" },
      businessInfo: {
        name: "",
        websiteURL: "",
        numEmployees: 0,
        physicalAddress: { address: "string", city: "", state: "", zip: "" },
        mailingAddress: { address: "string", city: "", state: "", zip: "" },
      },
      socialLinks: [],
    },
  });

  // Step navigation (step # corresponds to which modal displays)
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const onSubmit: SubmitHandler<BusinessSignupAppInfo> = (data) => {
    // TODO: process form data
    console.log(data);
  };

  return (
    <Card className="relative w-[70vw] h-[250px] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
      <CardContent className="flex w-full h-[320px] mt-[15px] ">
        <div className="w-[35%] bg-gray-200">
          <Image src="/logo/HBA_NoBack_NoWords.png" alt="Logo" width={100} height={100} className="ml-[-110px]" />
          <p>Hello</p>
        </div>
        <div className="w-[65%] flex justify-center">
          <p>Hello</p>
          <h1>much more</h1>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessSignupApplication;
