"use client";

import React from "react";
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
  numEmployees?: string;
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

  // for business info page
  const englishBusinessInfo = [
    "Business Name*",
    "Website URL*",
    "Number of Employees",
    "Physical Address*",
    "Mailing Address*",
    "City*",
    "State*",
    "ZIP*",
    "Mailing address is the same as physical address",
  ];
  const spanishBusinessInfo = [
    "Nombre Comercial*",
    "URL del Sitio Web*",
    "Numero de Empleados",
    "Dirección Física*",
    "Dirección de Envio",
    "Ciudad*",
    "Estado*",
    "ZIP*",
    "La dirección de envio es la misma que la dirección física",
  ];
  const businessInfoFieldNames = [englishBusinessInfo, spanishBusinessInfo];

  // for app submission page
  const submissionTitle = ["Application Submitted", "Solicitud Enviada"];
  const submissionSubtitle = [
    "Your membership application is pending review, in the meantime:",
    "Su solicitud de membresía está pendiente de revisión, mientras tanto:",
  ];
  const submissionEnglishSteps = [
    "Check your email for confirmation details",
    "Our team will review your application within 2-3 business days",
    "Once approved, you will receive access to your membership dashboard",
  ];
  const submissionSpanishSteps = [
    "Revise su correo electrónico para obtener detalles de confirmación",
    "Nuestro equipo revisará su solicitud dentro de 2-3 días hábiles",
    "Una vez aprobado, recibirá acceso a su panel de membresía",
  ];
  const submissionSteps = [submissionEnglishSteps, submissionSpanishSteps];

  const [step, setStep] = useState(1);
  const {
    register,
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
        numEmployees: "",
        physicalAddress: { address: "", city: "", state: "", zip: "" },
        mailingAddress: { address: "", city: "", state: "", zip: "" },
      },
      socialLinks: [],
    },
  });

  const [firstErrorMessage, setFirstErrorMessage] = useState("");

  const validateData = () => {
    const msgs = [
      "Missing data or data is improperly formatted.",
      "Faltan datos o los datos tienen un formato incorrecto.",
    ];
    trigger()
      .then((result) => {
        if (!result) {
          setFirstErrorMessage(msgs[langOption]);
          return false;
        } else {
          setFirstErrorMessage("");
          setStep(Math.min(numPages, step + 1));
          return true;
        }
      })
      .catch((error) => {
        console.error("Validation error:", error);
        setFirstErrorMessage("An unexpected error occurred during validation.");
        return false;
      });
  };

  // Step navigation (step # corresponds to which modal displays)
  const nextStep = () => {
    switch (step) {
      // business information page
      case 1:
        console.log("case 1");

        if (isMailingAddressSame) {
          // Copy values from physical address to mailing address if checkbox is checked
          setValue("businessInfo.mailingAddress.address", getValues("businessInfo.physicalAddress.address"));
          setValue("businessInfo.mailingAddress.city", getValues("businessInfo.physicalAddress.city"));
          setValue("businessInfo.mailingAddress.state", getValues("businessInfo.physicalAddress.state"));
          setValue("businessInfo.mailingAddress.zip", getValues("businessInfo.physicalAddress.zip"));
        }
        validateData();
        break;

      // contact information page
      case 2:
        setStep(Math.min(numPages, step + 1));

      // social links page
      case 3:
        setStep(Math.min(numPages, step + 1));

      // payment information page
      case 4:
        setStep(Math.min(numPages, step + 1));

      // payment method page
      case 5:
        setStep(Math.min(numPages, step + 1));
    }
  };
  const prevStep = () => setStep(Math.max(1, step - 1));

  // handle business addresses
  const [isMailingAddressSame, setIsMailingAddressSame] = useState(false);

  // populate the businessInfo structure with inputs form the form

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
            <div className="grid gap-4 mt-[20px] justify-start items-start">
              <div>
                <Input
                  className="w-[550px] border-[#8C8C8C]"
                  type="text"
                  id="BusinessName"
                  placeholder={businessInfoFieldNames[langOption][0]}
                  {...register("businessInfo.name", { required: "Business name is required" })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Input
                  className="w-[356px] border-[#8C8C8C]"
                  type="text"
                  id="WebsiteURL"
                  placeholder={businessInfoFieldNames[langOption][1]}
                  {...register("businessInfo.websiteURL", { required: "Website URL is required" })}
                />
                <Input
                  className="w-[186px] border-[#8C8C8C]"
                  type="text"
                  id="NumEmployees"
                  placeholder={businessInfoFieldNames[langOption][2]}
                  {...register("businessInfo.numEmployees", {
                    validate: (value) => value === "" || Number(value) >= 0 || "Number of employees cannot be negative",
                  })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Input
                  className="w-[264px] border-[#8C8C8C]"
                  type="text"
                  id="PhysicalAddress-Addr"
                  placeholder={businessInfoFieldNames[langOption][3]}
                  {...register("businessInfo.physicalAddress.address", { required: "Address is required" })}
                />
                <Input
                  className="w-[130px] border-[#8C8C8C]"
                  type="text"
                  id="PhysicalAddress-City"
                  placeholder={businessInfoFieldNames[langOption][5]}
                  {...register("businessInfo.physicalAddress.city", { required: "City is required" })}
                />
                <Input
                  className="w-[72px] border-[#8C8C8C]"
                  type="text"
                  id="PhysicalAddress-State"
                  placeholder={businessInfoFieldNames[langOption][6]}
                  {...register("businessInfo.physicalAddress.state", { required: "State is required" })}
                />
                <Input
                  className="w-[60px] border-[#8C8C8C]"
                  type="text"
                  id="PhysicalAddress-ZIP"
                  placeholder={businessInfoFieldNames[langOption][7]}
                  {...register("businessInfo.physicalAddress.zip", { required: "ZIP is required" })}
                />
              </div>

              <div className="flex items-center mt-[-8px] mb-[-8px] text-[13px]">
                <label htmlFor="sameAddress" className="flex items-center">
                  <input
                    type="checkbox"
                    id="sameAddress"
                    onChange={(e) => setIsMailingAddressSame(e.target.checked)} // use state to track if the checkbox is checked
                  />
                  {businessInfoFieldNames[langOption][8]}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  className="w-[264px] border-[#8C8C8C]"
                  type="text"
                  id="MailAddress-Addr"
                  placeholder={businessInfoFieldNames[langOption][4]}
                  {...register("businessInfo.mailingAddress.address", { required: "Address is required" })}
                />
                <Input
                  className="w-[130px] border-[#8C8C8C]"
                  type="text"
                  id="MailAddress-City"
                  placeholder={businessInfoFieldNames[langOption][5]}
                  {...register("businessInfo.mailingAddress.city", { required: "City is required" })}
                />
                <Input
                  className="w-[72px] border-[#8C8C8C]"
                  type="text"
                  id="MailAddress-State"
                  placeholder={businessInfoFieldNames[langOption][6]}
                  {...register("businessInfo.mailingAddress.state", { required: "State is required" })}
                />
                <Input
                  className="w-[60px] border-[#8C8C8C]"
                  type="text"
                  id="MailAddress-ZIP"
                  placeholder={businessInfoFieldNames[langOption][7]}
                  {...register("businessInfo.mailingAddress.zip", { required: "ZIP is required" })}
                />
              </div>
              {firstErrorMessage && <div className="text-red-600">{firstErrorMessage}</div>}
            </div>
            {renderNavButtons(false, false)}
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
            <div className="grid grid-cols-2 gap-6 mt-[80px] justify-start">
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
    }
  };

  if (step < 6) {
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
  } else {
    return (
      <div className="w-[70vw] h-[300px]">
        <Card className="relative bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
          <CardContent className="flex flex-col w-full h-[320px] mt-[15px] p-1 items-center">
            <div className="w-full flex items-start p-4">
              <Image src="/logo/HBA_NoBack_NoWords.png" alt="Logo" width={100} height={100} />
            </div>
            <div className="flex flex-col justify-center items-center w-full h-[60%]">
              <Image src="/icons/Request Approved.png" alt="Checkmark" width={60} height={60} />
              <strong className="text-[18px]">{submissionTitle[langOption]}</strong>
              <h5>{submissionSubtitle[langOption]}</h5>
              <div className="bg-[#3F5EBB] text-white p-4 rounded-lg mt-4">
                <ol className="list-decimal list-inside space-y-2 text-left text-[14px]">
                  <li>{submissionSteps[langOption][0]}</li>
                  <li>{submissionSteps[langOption][1]}</li>
                  <li>{submissionSteps[langOption][2]}</li>
                </ol>
              </div>
            </div>
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
  }
};

export default BusinessSignupApplication;
