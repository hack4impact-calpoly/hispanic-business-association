"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "./card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Input } from "./input";
import { Button } from "./button";

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
    trigger,
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
  const nextStep = () => setStep(Math.min(pageSubtitles.length, step + 1));
  const prevStep = () => setStep(Math.max(1, step - 1));

  const onSubmit: SubmitHandler<BusinessSignupAppInfo> = (data) => {
    // TODO: process form data
    console.log(data);
  };

  // populate the socialLinks list with inputs from the form
  const handleSocialLinkInputs = (platform: SocialPlatform, str: string) => {
    const updatedLinks = getValues("socialLinks") || [];
    const newLinks = updatedLinks.filter((link) => link.platform !== platform);

    if (str) {
      newLinks.push({ platform, handle: str });
    }

    setValue("socialLinks", newLinks);
    console.log(getValues("socialLinks")); // logging to check values
  };

  const renderStepForm = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div className="grid grid-cols-2 gap-6 mt-[80px]">
              <div>
                <Input
                  className="w-[250px] border-[#8C8C8C]"
                  type="text"
                  id="Facebook"
                  placeholder="Facebook"
                  onChange={(e) => handleSocialLinkInputs("Facebook", e.target.value)}
                />
              </div>
              <div>
                <Input
                  className="w-[250px] border-[#8C8C8C]"
                  type="text"
                  id="Instagram"
                  placeholder="Instagram"
                  onChange={(e) => handleSocialLinkInputs("Instagram", e.target.value)}
                />
              </div>
              <div>
                <Input
                  className="w-[250px] border-[#8C8C8C]"
                  type="text"
                  id="X"
                  placeholder="X"
                  onChange={(e) => handleSocialLinkInputs("X", e.target.value)}
                />
              </div>
              <div>
                <Input
                  className="w-[250px] border-[#8C8C8C]"
                  type="text"
                  id="LinkedIn"
                  placeholder="LinkedIn"
                  onChange={(e) => handleSocialLinkInputs("LinkedIn", e.target.value)}
                />
              </div>
            </div>
            <div className="absolute bottom-0 left-[35%] right-0 p-4 flex flex-row items-end justify-end">
              <Button className="bg-[#405BA9] rounded-3xl" type="button" onClick={nextStep}>
                Next
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h1>Step = {step}</h1>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-row items-end justify-between">
              <Button
                className="bg-white text-[#405BA9] border border-[#405BA9] rounded-3xl"
                type="button"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button className="bg-[#405BA9] rounded-3xl" type="button" onClick={nextStep}>
                Next
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h1>Step = {step}</h1>
          </div>
        );
    }
  };

  return (
    <Card className="relative w-[70vw] h-[300px] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
      <CardContent className="flex w-full h-[320px] mt-[15px] p-1">
        <div className="w-[35%] flex flex-col items-start text-left p-4">
          <Image src="/logo/HBA_NoBack_NoWords.png" alt="Logo" width={100} height={100} />
          <div className="mt-[40px]">
            <strong className="text-[24px]">Membership Application</strong>
            <h4 className="pt-2 text-[16px]">{pageSubtitles[step - 1]}</h4>
          </div>
        </div>
        <div className="w-[65%] flex justify-center">{renderStepForm()}</div>
      </CardContent>
    </Card>
  );
};

export default BusinessSignupApplication;
