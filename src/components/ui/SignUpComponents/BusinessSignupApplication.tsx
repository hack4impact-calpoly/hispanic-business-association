"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { Card, CardContent } from "../card";
import { Button } from "../button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../dropdown-menu";

import Step1_BusinessInfo from "./Step1_BusinessInfo";
import Step2_Address from "./Step2_Address";
import Step3_SocialLinks from "./Step3_SocialLinks";
import Step4_ContactInfo from "./Step4_ContactInfo";
import Step5_Submission from "./Step5_Submission";
import LanguageSelector from "./LanguageSelector";

import { IUser } from "@/database/userSchema";
import { IBusiness } from "@/database/businessSchema";

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

  const [step, setStep] = useState(1);
  const [langOption, setLangOption] = useState(0);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [isMailingAddressSame, setIsMailingAddressSame] = useState(false);

  const { signUp, setActive, isLoaded } = useSignUp();
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

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
        businessOwner: "",
        businessType: "",
        description: "",
        physicalAddress: { street: "", city: "", state: "", zip: "" },
        mailingAddress: { street: "", city: "", state: "", zip: "" },
      },
      socialLinks: {},
    },
  });

  const langOptions = ["English (United States)", "Español"];
  const formTitle = ["Membership Application", "Solicitud de Membresía"];
  const pageSubtitles = [
    ["Business Information", "Business Information", "Social Links", "Contact Information"],
    ["Información Comercial", "Información Comercial", "Enlaces Sociales", "Información del Contacto"],
  ];

  const navTitles = [
    ["Back", "Next"],
    ["Atrás", "Próximo"],
  ];
  const navSubmit = ["Submit", "Finalizar"];

  const businessInfoFieldNames = [
    [
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
    ],
    [
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
    ],
  ];

  const contactInfoFieldNames = [
    ["Contact Name*", "Phone Number* (XXX) XXX-XXXX", "Email Address*", "Enter Password*", "Re-enter Password*"],
    [
      "Nombre de Contacto*",
      "Número de Teléfono* (XXX) XXX-XXXX",
      "Dirección de Correo Electrónico*",
      "Ingrese la Contraseña*",
      "Escriba la Contraseña Otra Vez*",
    ],
  ];

  const submissionTitle = ["Application Submitted", "Solicitud Enviada"];
  const submissionSubtitle = [
    "Your membership application is pending review, in the meantime:",
    "Su solicitud de membresía está pendiente de revisión, mientras tanto:",
  ];
  const submissionSteps = [
    [
      "Check your email for confirmation details",
      "Our team will review your application within 2-3 business days",
      "Once approved, you will receive access to your membership dashboard",
    ],
    [
      "Revise su correo electrónico para obtener detalles de confirmación",
      "Nuestro equipo revisará su solicitud dentro de 2-3 días hábiles",
      "Una vez aprobado, recibirá acceso a su panel de membresía",
    ],
  ];

  const errorMsgs = [
    "Missing data or data is improperly formatted.",
    "Faltan datos o los datos tienen un formato incorrecto.",
  ];

  const changeLanguage = (val: number) => {
    setLangOption(val);
    if (formErrorMessage && (errorMsgs[0] === formErrorMessage || errorMsgs[1] === formErrorMessage)) {
      setFormErrorMessage(errorMsgs[val]);
    }
  };

  const validateData = async () => {
    const result = await trigger();
    if (!result) {
      setFormErrorMessage(errorMsgs[langOption]);
      return false;
    } else {
      setFormErrorMessage("");
      return true;
    }
  };

  const nextStep = async () => {
    switch (step) {
      case 1:
      case 2:
        if (step === 2 && isMailingAddressSame) {
          const phys = getValues("businessInfo.physicalAddress");
          setValue("businessInfo.mailingAddress", phys);
        }
        if (await validateData()) setStep(step + 1);
        break;
      case 3:
        setStep(step + 1);
        break;
      case 4:
        const email = getValues("contactInfo.email");
        if (!(await validateData())) return;
        if (password1 !== password2) {
          setFormErrorMessage(langOption === 0 ? "Passwords don't match" : "Las contraseñas no coinciden");
          return;
        }
        try {
          if (!isLoaded || !signUp) return;
          const res = await signUp.create({ emailAddress: email, password: password1 });
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
          if (res.status === "complete") {
            await setActive({ session: res.createdSessionId });
            await postAllData(res.createdUserId || "");
            setStep(step + 1);
          } else {
            setFormErrorMessage(res.status || "Incomplete signup.");
          }
        } catch (e: any) {
          const err = e?.errors?.[0]?.message || "Unknown signup error";
          setFormErrorMessage(err);
          console.error("Signup error:", e);
        }
        break;
    }
  };

  const prevStep = () => {
    setFormErrorMessage("");
    setStep(Math.max(1, step - 1));
  };

  const postAllData = async (clerkID: string) => {
    const values = getValues();
    const userData: IUser = {
      ...values.contactInfo,
      phone: Number(values.contactInfo.phone),
      role: "business",
      clerkUserID: clerkID,
    };
    const businessData: IBusiness = {
      clerkUserID: clerkID,
      ...values.businessInfo,
      physicalAddress: {
        ...values.businessInfo.physicalAddress,
        zip: Number(values.businessInfo.physicalAddress.zip),
      },
      mailingAddress: {
        ...values.businessInfo.mailingAddress,
        zip: Number(values.businessInfo.mailingAddress.zip),
      },
      pointOfContact: {
        name: values.contactInfo.name,
        email: values.contactInfo.email,
        phoneNumber: Number(values.contactInfo.phone),
      },
      membershipFeeType: "",
      membershipExpiryDate: new Date(),
      lastPayDate: new Date(),
    };

    // Send userData and businessData to your backend
    console.log("User:", userData);
    console.log("Business:", businessData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1_BusinessInfo
            register={register}
            formErrorMessage={formErrorMessage}
            langOption={langOption}
            businessInfoFieldNames={businessInfoFieldNames}
            navTitles={navTitles}
            navSubmit={navSubmit}
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2_Address
            register={register}
            getValues={getValues}
            setValue={setValue}
            formErrorMessage={formErrorMessage}
            langOption={langOption}
            businessInfoFieldNames={businessInfoFieldNames}
            isMailingAddressSame={isMailingAddressSame}
            handleSameMailingAddressCheckbox={(e) => {
              const checked = e.target.checked;
              if (!checked) {
                setValue("businessInfo.mailingAddress", { street: "", city: "", state: "", zip: "" });
              }
              setIsMailingAddressSame(checked);
            }}
            navTitles={navTitles}
            navSubmit={navSubmit}
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <Step3_SocialLinks
            register={register}
            langOption={langOption}
            navTitles={navTitles}
            navSubmit={navSubmit}
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case 4:
        return (
          <Step4_ContactInfo
            register={register}
            langOption={langOption}
            contactInfoFieldNames={contactInfoFieldNames}
            password1={password1}
            password2={password2}
            setPassword1={setPassword1}
            setPassword2={setPassword2}
            showPassword1={showPassword1}
            showPassword2={showPassword2}
            togglePassword1Visibility={() => setShowPassword1((prev) => !prev)}
            togglePassword2Visibility={() => setShowPassword2((prev) => !prev)}
            formErrorMessage={formErrorMessage}
            navTitles={navTitles}
            navSubmit={navSubmit}
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case 5:
        return (
          <Step5_Submission
            langOption={langOption}
            submissionTitle={submissionTitle}
            submissionSubtitle={submissionSubtitle}
            submissionSteps={submissionSteps}
            langOptions={langOptions}
            changeLanguage={changeLanguage}
          />
        );
    }
  };

  return (
    <div className="w-full md:max-w-[70vw] md:h-auto">
      <Card className="relative md:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] min-h-screen md:min-h-full rounded-none md:rounded-lg">
        <CardContent className="flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start h-full md:h-[320px] mt-[15px] p-1">
          <div className="w-auto md:w-[29%] flex flex-col justify-center items-center text-center p-4">
            <Image src="/logo/HBA_NoBack_NoWords.png" alt="Logo" width={100} height={100} />
            <div className="mt-[40px]">
              <strong className="text-[24px]">{formTitle[langOption]}</strong>
              {step <= 4 && <h4 className="pt-2 text-[16px]">{pageSubtitles[langOption][step - 1]}</h4>}
            </div>
          </div>
          <div className="w-full md:w-[71%] flex mx-auto">{renderStep()}</div>
          <div className="md:hidden flex mx-auto mt-[8%]">
            <LanguageSelector langOptions={langOptions} langOption={langOption} changeLanguage={changeLanguage} />
          </div>
        </CardContent>
      </Card>

      <div className="hidden md:block md:flex md:flex-row md:justify-start mt-2">
        <LanguageSelector langOptions={langOptions} langOption={langOption} changeLanguage={changeLanguage} />
      </div>
    </div>
  );
};

export default BusinessSignupApplication;
