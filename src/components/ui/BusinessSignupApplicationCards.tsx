"use client";

import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "./card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./input";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

interface BusinessSignupAppInfo {
  contactInfo: { name: string; phone: string; email: string };
  businessInfo: {
    businessName: string;
    website: string;
    businessOwner: string;
    businessType: string;
    description: string;
    physicalAddress: { street: string; city: string; state: string; zip: string };
    mailingAddress: { street: string; city: string; state: string; zip: string };
  };
  socialLinks: { IG?: string; X?: string; FB?: string };
}

const BusinessSignupApplication = () => {
  const router = useRouter();

  const [langOption, setLangOption] = useState(0); // either 0 or 1 for language preference

  // for language toggle
  const langOptions = ["English (United States)", "Español"];

  // for form title
  const formTitle = ["Membership Application", "Solicitud de Membresía"];

  // page subtitles by language
  const englishPageSubtitles = ["Business Information", "Business Information", "Social Links", "Contact Information"];
  const spanishPageSubtitles = [
    "Información Comercial",
    "Información Comercial",
    "Enlaces Sociales",
    "Información del Contacto",
  ];
  const numPages = 4;
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
    "Business Type*",
    "Name of Business Owner*",
    "Description of the Business*",
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
    "Tipo de Negocio*",
    "Nombre del Propietario del Negocio*",
    "Descripción del Negocio*",
    "Dirección Física*",
    "Dirección de Envio",
    "Ciudad*",
    "Estado*",
    "ZIP*",
    "La dirección de envio es la misma que la dirección física",
  ];
  const businessInfoFieldNames = [englishBusinessInfo, spanishBusinessInfo];

  // for contact info page
  const englishContactInfo = [
    "Contact Name*",
    "Phone Number* (XXX) XXX-XXXX",
    "Email Address*",
    "Enter Password*",
    "Renter Password*",
  ];
  const spanishContactInfo = [
    "Nombre de Contacto*",
    "Número de Teléfono* (XXX) XXX-XXXX",
    "Dirección de Correo Electrónico*",
    "Ingrese la Contraseña*",
    "Escriba la Contraseña Otra Vez*",
  ];
  const contactInfoFieldNames = [englishContactInfo, spanishContactInfo];

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
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<BusinessSignupAppInfo>({
    defaultValues: {
      contactInfo: { name: "", phone: "", email: "" },
      businessInfo: {
        businessName: "",
        website: "",
        physicalAddress: { street: "", city: "", state: "", zip: "" },
        mailingAddress: { street: "", city: "", state: "", zip: "" },
      },
      socialLinks: { IG: "", FB: "", X: "" },
    },
  });

  const [formErrorMessage, setFormErrorMessage] = useState("");
  const changeLanguage = (val: number) => {
    setLangOption(val);
    if (errorMsgs[0].includes(formErrorMessage) || errorMsgs[1].includes(formErrorMessage)) {
      setFormErrorMessage(errorMsgs[val]);
    }
  };

  // validate form entries
  const errorMsgs = [
    "Missing data or data is improperly formatted.",
    "Faltan datos o los datos tienen un formato incorrecto.",
  ];
  const validateData = () => {
    trigger()
      .then((result) => {
        if (!result) {
          setFormErrorMessage(errorMsgs[langOption]);
        } else {
          setFormErrorMessage("");
          setStep(Math.min(numPages, step + 1));
        }
      })
      .catch((error) => {
        console.error("Validation error:", error);
        setFormErrorMessage("An unexpected error occurred during validation.");
      });
  };

  const gatherAllData = async () => {
    const isValid = await trigger();

    if (!isValid) throw new Error("Problem getting inputs from form.");

    const formValues = getValues();
    const businessData = {
      ...formValues,
      businessInfo: {
        ...formValues.businessInfo,
        physicalAddress: {
          ...formValues.businessInfo.physicalAddress,
          zip: Number(formValues.businessInfo.physicalAddress.zip),
        },
        mailingAddress: {
          ...formValues.businessInfo.mailingAddress,
          zip: Number(formValues.businessInfo.mailingAddress.zip),
        },
      },
    };

    console.log(formValues);
  };

  // Step navigation (step # corresponds to which modal displays)
  const nextStep = () => {
    switch (step) {
      case 1: // business information page
        validateData();
        break;
      case 2: // address information
        if (isMailingAddressSame) {
          // Copy values from physical address to mailing address if checkbox is checked
          setValue("businessInfo.mailingAddress.street", getValues("businessInfo.physicalAddress.street"));
          setValue("businessInfo.mailingAddress.city", getValues("businessInfo.physicalAddress.city"));
          setValue("businessInfo.mailingAddress.state", getValues("businessInfo.physicalAddress.state"));
          setValue("businessInfo.mailingAddress.zip", getValues("businessInfo.physicalAddress.zip"));
        }
        validateData();
        break;
      case 3: // social links page
        setStep(Math.min(numPages, step + 1));
        break;
      case 4: // contact information page
        validateData();
        break;
    }
  };
  const prevStep = () => {
    setFormErrorMessage("");
    setStep(Math.max(1, step - 1));
  };

  // handle business addresses
  const [isMailingAddressSame, setIsMailingAddressSame] = useState(false);

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
          <div className="w-[90%] mr-auto ml-auto">
            <div className="grid gap-4 mt-5">
              <Input
                key={`businessName-${step}`}
                className="w-full border-[#8C8C8C]"
                type="text"
                id="BusinessName"
                placeholder={businessInfoFieldNames[langOption][0]}
                {...register("businessInfo.businessName", { required: "Business name is required" })}
              />

              <Input
                key={`websiteURL-${step}`}
                className="w-full border-[#8C8C8C]"
                type="text"
                id="WebsiteURL"
                placeholder={businessInfoFieldNames[langOption][1]}
                {...register("businessInfo.website", { required: "Website URL is required" })}
              />

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-6">
                  <Input
                    key={`businessType-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="text"
                    id="businessType"
                    placeholder={businessInfoFieldNames[langOption][2]}
                    {...register("businessInfo.businessType", { required: "Business Type is required" })}
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    key={`businessOwner-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="text"
                    id="businessOwner"
                    placeholder={businessInfoFieldNames[langOption][3]}
                    {...register("businessInfo.businessOwner", { required: "Business Owner is required" })}
                  />
                </div>
              </div>

              <Input
                key={`description-${step}`}
                className="w-full border-[#8C8C8C]"
                type="text"
                id="description"
                placeholder={businessInfoFieldNames[langOption][4]}
                {...register("businessInfo.description", { required: "Description is required" })}
              />

              {formErrorMessage && <div className="text-red-600">{formErrorMessage}</div>}
            </div>

            {renderNavButtons(false, false)}
          </div>
        );
      case 2:
        return (
          <div className="w-[90%] mt-[8%] mr-auto ml-auto">
            <div className="grid gap-4 mt-5">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <Input
                    key={`physicalAddress-Addr-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="text"
                    id="PhysicalAddress-Addr"
                    placeholder={businessInfoFieldNames[langOption][5]}
                    {...register("businessInfo.physicalAddress.street", { required: "Address is required" })}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    key={`physicalAddress-City-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="text"
                    id="PhysicalAddress-City"
                    placeholder={businessInfoFieldNames[langOption][7]}
                    {...register("businessInfo.physicalAddress.city", { required: "City is required" })}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    key={`physicalAddress-State-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="text"
                    id="PhysicalAddress-State"
                    placeholder={businessInfoFieldNames[langOption][8]}
                    {...register("businessInfo.physicalAddress.state", { required: "State is required" })}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    key={`physicalAddress-ZIP-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="text"
                    id="PhysicalAddress-ZIP"
                    placeholder={businessInfoFieldNames[langOption][9]}
                    {...register("businessInfo.physicalAddress.zip", {
                      required: "ZIP is required",
                      pattern: { value: /^\d{5}$/, message: "ZIP code must be exactly 5 digits" },
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 text-[13px]">
                <div className="col-span-10 flex items-center mt-[-8px] mb-[-8px]">
                  <label htmlFor="sameAddress" className="flex items-center">
                    <input
                      type="checkbox"
                      id="sameAddress"
                      onChange={(e) => setIsMailingAddressSame(e.target.checked)}
                    />
                    {businessInfoFieldNames[langOption][10]}
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <Input
                    key={`mailingAddress-Addr-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="text"
                    id="MailAddress-Addr"
                    placeholder={businessInfoFieldNames[langOption][6]}
                    {...register("businessInfo.mailingAddress.street", { required: "Address is required" })}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    key={`mailingAddress-City-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="text"
                    id="MailAddress-City"
                    placeholder={businessInfoFieldNames[langOption][7]}
                    {...register("businessInfo.mailingAddress.city", { required: "City is required" })}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    key={`mailingAddress-State-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="text"
                    id="MailAddress-State"
                    placeholder={businessInfoFieldNames[langOption][8]}
                    {...register("businessInfo.mailingAddress.state", { required: "State is required" })}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    key={`mailingAddress-ZIP-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="text"
                    id="MailAddress-ZIP"
                    placeholder={businessInfoFieldNames[langOption][9]}
                    {...register("businessInfo.mailingAddress.zip", {
                      required: "ZIP is required",
                      pattern: { value: /^\d{5}$/, message: "ZIP code must be exactly 5 digits" },
                    })}
                  />
                </div>
              </div>
              {formErrorMessage && <div className="text-red-600">{formErrorMessage}</div>}
            </div>

            {renderNavButtons(true, false)}
          </div>
        );
      case 3:
        return (
          <div className="w-[90%] mt-[8%] mr-auto ml-auto">
            <div className="grid gap-4 mt-5">
              <Input
                className="w-full border-[#8C8C8C]"
                type="text"
                id="Facebook"
                placeholder="Facebook"
                {...register("socialLinks.FB", { pattern: { value: /^@/, message: "Not in a familiar format." } })}
              />
              <Input
                className="w-full border-[#8C8C8C]"
                type="text"
                id="Instagram"
                placeholder="Instagram"
                {...register("socialLinks.IG", { pattern: { value: /^@/, message: "Not in a familiar format." } })}
              />
              <Input
                className="w-full border-[#8C8C8C]"
                type="text"
                id="X"
                placeholder="X"
                {...register("socialLinks.X", { pattern: { value: /^@/, message: "Not in a familiar format." } })}
              />
            </div>
            {renderNavButtons(true, false)}
          </div>
        );
      case 4:
        return (
          <div className="w-[90%] mr-auto ml-auto">
            <div className="grid gap-4 mt-5">
              <Input
                key={`contactName-${step}`}
                className="w-full border-[#8C8C8C]"
                type="text"
                id="ContactName"
                placeholder={contactInfoFieldNames[langOption][0]}
                {...register("contactInfo.name", { required: "Contact Name is required" })}
              />

              <Input
                key={`contactPhone-${step}`}
                className="w-full border-[#8C8C8C]"
                type="text"
                id="Phone"
                placeholder={contactInfoFieldNames[langOption][1]}
                {...register("contactInfo.phone", {
                  required: "Phone Number is required",
                  pattern: {
                    value: /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
                    message: "Phone Number must have nine digits.",
                  },
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  },
                })}
              />

              <Input
                key={`contactEmail-${step}`}
                className="w-full border-[#8C8C8C]"
                type="text"
                id="ContactEmail"
                placeholder={contactInfoFieldNames[langOption][2]}
                {...register("contactInfo.email", {
                  required: "Email is required",
                  pattern: { value: /^[^@]+@[^@]+$/, message: "Not in a familiar format." },
                })}
              />

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-6">
                  <Input
                    key={`password1-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="password"
                    id="Password1"
                    value={password1}
                    placeholder={contactInfoFieldNames[langOption][3]}
                    onChange={(e) => setPassword1(e.target.value)}
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    key={`password2-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="password"
                    id="Password2"
                    value={password2}
                    placeholder={contactInfoFieldNames[langOption][4]}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {formErrorMessage && <div className="text-red-600">{formErrorMessage}</div>}
            {renderNavButtons(true, true)}
          </div>
        );
    }
  };

  if (step < 5) {
    return (
      <div className="w-[70vw] h-[300px]">
        <Card className="relative bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
          <CardContent className="flex flex-col md:flex-row w-full h-[320px] mt-[15px] p-1">
            <div className="w-[35%] flex flex-col items-start text-left p-4">
              <Image src="/logo/HBA_NoBack_NoWords.png" alt="Logo" width={100} height={100} />
              <div className="mt-[40px]">
                <strong className="text-[24px]">{formTitle[langOption]}</strong>
                <h4 className="pt-2 text-[16px]">{pageSubtitles[langOption][step - 1]}</h4>
              </div>
            </div>
            <div className="w-[65%] flex mx-auto">{renderStepForm()}</div>
          </CardContent>
        </Card>
        <div className="flex flex-row justify-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="bg-[#293241] text-white hover:text-blue-500 hover:bg-[#293241] hover:opacity-100 hover:shadow-none"
                type="button"
              >
                {langOptions[langOption]}
                <Image src="/icons/Sort Down.png" alt="DropDownArrow" width={15} height={15} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => changeLanguage(0)}>{langOptions[0]}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage(1)}>{langOptions[1]}</DropdownMenuItem>
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
                className="bg-[#293241] text-white hover:text-blue-500 hover:bg-[#293241] hover:opacity-100 hover:shadow-none"
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
