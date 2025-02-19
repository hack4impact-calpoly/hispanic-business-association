"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "./card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Input } from "./input";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

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

  const [langOption, setLangOption] = useState(0); // either 0 or 1 for language preference

  // for language toggle
  const langOptions = ["English (United States)", "Español"];

  // for form title
  const formTitle = ["Membership Application", "Solicitud de Membresía"];

  // page subtitles by language
  const englishPageSubtitles = [
    "Business Information",
    "Contact Information",
    "Social Links",
    "Payment Information",
    "Payment Method",
  ];
  const spanishPageSubtitles = [
    "Información Comercial",
    "Información del Contacto",
    "Enlaces Sociales",
    "Información de Pago",
    "Método de Pago",
  ];
  const numPages = 6;
  const pageSubtitles = [englishPageSubtitles, spanishPageSubtitles];

  // for navigation buttons
  const englishNav = ["Back", "Next"];
  const spanishNav = ["Atrás", "Próximo"];
  const navSubmit = ["Submit", "Finalizar"];
  const navTitles = [englishNav, spanishNav];

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
  const nextStep = () => setStep(Math.min(numPages, step + 1));
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

  // handle rendering of nav buttons with defaults set
  const renderNavButtons = (back: boolean = true, submit: boolean = false) => {
    // most standard case of both 'Back' and 'Next' displayed
    if (back && !submit) {
      return (
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-row items-end justify-between">
          <Button
            className="bg-white text-[#405BA9] border border-[#405BA9] rounded-3xl"
            type="button"
            onClick={prevStep}
          >
            {navTitles[langOption][0]}
          </Button>
          <Button className="bg-[#405BA9] rounded-3xl" type="button" onClick={nextStep}>
            {navTitles[langOption][1]}
          </Button>
        </div>
      );
    }
    // just 'Next' displayed
    if (!back && !submit) {
      return (
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-row items-end justify-end">
          <Button className="bg-[#405BA9] rounded-3xl" type="button" onClick={nextStep}>
            {navTitles[langOption][1]}
          </Button>
        </div>
      );
    }
    // 'Back' and 'Submit' displayed
    if (back && submit) {
      return (
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-row items-end justify-between">
          <Button
            className="bg-white text-[#405BA9] border border-[#405BA9] rounded-3xl"
            type="button"
            onClick={prevStep}
          >
            {navTitles[langOption][0]}
          </Button>
          <Button className="bg-[#405BA9] rounded-3xl" type="button" onClick={nextStep}>
            {navSubmit[langOption]}
          </Button>
        </div>
      );
    }
  };

  const renderStepForm = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h1>Step = {step}</h1>
            {renderNavButtons(true, false)}
          </div>
        );
      case 2:
        return (
          <div>
            <h1>Step = {step}</h1>
            {renderNavButtons(true, false)}
          </div>
        );
      case 3:
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
            {renderNavButtons(true, false)}
          </div>
        );
      case 4:
        return (
          <div>
            <h1>Step = {step}</h1>
            {renderNavButtons(true, false)}
          </div>
        );
      case 5:
        return (
          <div>
            <h1>Step = {step}</h1>
            {renderNavButtons(true, true)}
          </div>
        );
      case 6:
        return (
          <div>
            <h1>Step = {step}</h1>
          </div>
        );
    }
  };

  return (
    <div className="w-[70vw] h-[300px]">
      <Card className="relative bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
        <CardContent className="flex w-full h-[320px] mt-[15px] p-1">
          <div className="w-[35%] flex flex-col items-start text-left p-4">
            <Image src="/logo/HBA_NoBack_NoWords.png" alt="Logo" width={100} height={100} />
            <div className="mt-[40px]">
              <strong className="text-[24px]">{formTitle[langOption]}</strong>
              <h4 className="pt-2 text-[16px]">{pageSubtitles[langOption][step - 1]}</h4>
            </div>
          </div>
          <div className="w-[65%] flex justify-center">{renderStepForm()}</div>
        </CardContent>
      </Card>
      <div className="flex flex-row justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              className="bg-white text-[#405BA9] hover:bg-white hover:opacity-100 hover:shadow-none"
              type="button"
            >
              {langOptions[langOption]}
              <Image src="/icons/Sort Down.png" alt="DropDownArrow" width={15} height={15} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setLangOption(0)}>{langOptions[0]}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLangOption(1)}>{langOptions[1]}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default BusinessSignupApplication;
