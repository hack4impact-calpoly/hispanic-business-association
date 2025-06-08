"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "../shadcnComponents/card";
import Step1A_BusinessInfo from "./Step1A_BusinessInfo";
import Step1B_BusinessInfo from "./Step1B_BusinessInfo";
import Step2_Address from "./Step2_Address";
import Step3_SocialLinks from "./Step3_SocialLinks";
import Step4_ContactInfo from "./Step4_ContactInfo";
import Step5_Verification from "./Step5_Verification";
import Step6_Submission from "./Step6_Submission";
import Step6_SubmissionFailure from "./Step6_SubmissionFailure";
import LanguageSelector from "./LanguageSelector";
import { ISignupRequest } from "@/database/signupRequestSchema";
import { useClerkSignup } from "@/hooks/useClerkSignup";
import { useTranslations } from "next-intl";
import { BusinessType, OrganizationType, BusinessScale, EmployeeRange, Gender } from "@/database/types";

interface BusinessSignupAppInfo {
  contactInfo: { name: string; phone: string; email: string };
  businessInfo: {
    businessName: string;
    website: string;
    businessOwner: string;
    description?: string;
    businessType?: BusinessType;
    organizationType: OrganizationType;
    businessScale?: BusinessScale;
    numberOfEmployees?: EmployeeRange;
    gender?: Gender;
    physicalAddress: { street: string; city: string; state: string; zip: string };
    mailingAddress: { street: string; city: string; state: string; zip: string };
  };
  socialLinks: { IG?: string; twitter?: string; FB?: string };
}

const ERROR_TRANSLATION_MAP = {
  "Business name is required": "businessNameRequired",
  "Business owner is required": "businessOwnerRequired",
  "Organization type is required": "organizationTypeRequired",
  "Gender is required": "genderRequired",
  "Business type is required for business organizations": "businessTypeRequiredForBusiness",
  "Business scale is required for business organizations": "businessScaleRequiredForBusiness",
  "Number of employees is required for business organizations": "numberOfEmployeesRequiredForBusiness",
  "Physical address street is required": "physicalAddressStreetRequired",
  "Physical address city is required": "physicalAddressCityRequired",
  "Physical address state is required": "physicalAddressStateRequired",
  "Physical address ZIP code is required": "physicalAddressZipRequired",
  "Physical address ZIP code must be exactly 5 digits": "physicalAddressZipInvalid",
  "Mailing address street is required": "mailingAddressStreetRequired",
  "Mailing address city is required": "mailingAddressCityRequired",
  "Mailing address state is required": "mailingAddressStateRequired",
  "Mailing address ZIP code is required": "mailingAddressZipRequired",
  "Mailing address ZIP code must be exactly 5 digits": "mailingAddressZipInvalid",
  "Contact name is required": "contactNameRequired",
  "Contact phone number is required": "contactPhoneRequired",
  "Contact phone number must be exactly 10 digits": "contactPhoneInvalid",
  "Contact email is required": "contactEmailRequired",
  "Contact email format is invalid": "contactEmailInvalid",
} as const;

const BusinessSignupApplication = () => {
  const t = useTranslations();

  const [step, setStep] = useState(1);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [isMailingAddressSame, setIsMailingAddressSame] = useState(false);

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [clerkCode, setClerkCode] = useState("");
  const [submissionError, setSubmissionError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { startSignup, verifyCode, error } = useClerkSignup();

  useEffect(() => {
    if (error) setFormErrorMessage(error);
  }, [error]);

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    trigger,
    watch,
  } = useForm<BusinessSignupAppInfo>({
    defaultValues: {
      contactInfo: { name: "", phone: "", email: "" },
      businessInfo: {
        businessName: "",
        website: "",
        businessOwner: "",
        businessType: undefined,
        organizationType: undefined,
        businessScale: undefined,
        numberOfEmployees: undefined,
        gender: undefined,
        description: "",
        physicalAddress: { street: "", city: "", state: "", zip: "" },
        mailingAddress: { street: "", city: "", state: "", zip: "" },
      },
      socialLinks: {},
    },
  });

  const pageSubtitles = [t("businessInformation"), t("businessInformation"), t("socialLink"), t("contactInfo")];

  const validateData = async () => {
    const result = await trigger();
    if (!result) {
      return false;
    } else {
      setFormErrorMessage("");
      return true;
    }
  };

  const nextStep = async () => {
    switch (step) {
      case 1:
        if (getValues("businessInfo.organizationType") === "Business") {
          if (await validateData()) setStep(15); // for 1.5
        } else {
          if (await validateData()) setStep(2);
        }
        break;
      case 15: // only whent org type is business
        if (await validateData()) setStep(2);
        break;
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
          setFormErrorMessage(t("pwdNoMatch"));
          return;
        }
        const status = await startSignup(email, password1);
        if (status === "verified") {
          // Check if postAllData succeeds before setting step 6
          const success = await postAllData("");
          if (success) {
            setStep(6);
          }
          // If postAllData fails, it sets step 7 internally - don't override
        } else if (status === "needs_verification") {
          setStep(5);
        } else if (status === "error") {
          setFormErrorMessage(error);
        }
        break;
    }
  };

  const prevStep = () => {
    if (step == 15) {
      setStep(1);
    } else if (step == 2 && getValues("businessInfo.organizationType") === "Business") {
      setStep(15);
    } else {
      setFormErrorMessage("");
      setStep(Math.max(1, step - 1));
    }
  };

  const setPageSubtitle = () => {
    if (step === 15) return pageSubtitles[0];
    return pageSubtitles[step - 1];
  };

  // CRITICAL FIX: Return boolean to indicate success/failure
  const postAllData = async (clerkID: string): Promise<boolean> => {
    const values = getValues();

    const socialMediaHandles: Partial<typeof values.socialLinks> = {};
    if (values.socialLinks.IG) socialMediaHandles.IG = values.socialLinks.IG;
    if (values.socialLinks.twitter) socialMediaHandles.twitter = values.socialLinks.twitter;
    if (values.socialLinks.FB) socialMediaHandles.FB = values.socialLinks.FB;

    const businessData: ISignupRequest = {
      clerkUserID: clerkID,
      businessName: values.businessInfo.businessName,
      website: values.businessInfo.website,
      businessOwner: values.businessInfo.businessOwner,
      businessType: values.businessInfo.businessType,
      description: values.businessInfo.description,
      organizationType: values.businessInfo.organizationType,
      businessScale: values.businessInfo.businessScale,
      numberOfEmployees: values.businessInfo.numberOfEmployees,
      gender: values.businessInfo.gender,
      status: "open",
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
      ...(Object.keys(socialMediaHandles).length > 0 && {
        socialMediaHandles,
      }),
      date: new Date(),
    };

    try {
      const response = await fetch("api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(businessData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        const translatedErrors = (errorData.errors || []).map((error: string) => {
          const translationKey = ERROR_TRANSLATION_MAP[error as keyof typeof ERROR_TRANSLATION_MAP];
          return translationKey ? t(translationKey) : error;
        });

        setSubmissionError(errorData.message || t("errorMsgs"));
        setValidationErrors(translatedErrors);
        setStep(7);
        return false; // Signal failure to caller
      }

      return true; // Signal success to caller
    } catch (err) {
      console.error("Error creating request:", err);
      setSubmissionError(t("unknownError"));
      setValidationErrors([]);
      setStep(7);
      return false; // Signal failure to caller
    }
  };

  const handleClerkVerification = async () => {
    const success = await verifyCode(clerkCode, async (userId: string) => {
      await postAllData(userId);
    });
    if (success) {
      setStep(step + 1);
    } else {
      setFormErrorMessage(error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1A_BusinessInfo
            register={register}
            formErrorMessage={formErrorMessage}
            onBack={prevStep}
            onNext={nextStep}
            watch={watch}
            errors={errors}
          />
        );
      case 15:
        return (
          <Step1B_BusinessInfo
            register={register}
            formErrorMessage={formErrorMessage}
            onBack={prevStep}
            onNext={nextStep}
            watch={watch}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step2_Address
            register={register}
            formErrorMessage={formErrorMessage}
            isMailingAddressSame={isMailingAddressSame}
            handleSameMailingAddressCheckbox={(e) => {
              const checked = e.target.checked;
              if (!checked) {
                setValue("businessInfo.mailingAddress", { street: "", city: "", state: "", zip: "" });
              }
              setIsMailingAddressSame(checked);
            }}
            onBack={prevStep}
            onNext={nextStep}
            errors={errors}
          />
        );
      case 3:
        return <Step3_SocialLinks register={register} onBack={prevStep} onNext={nextStep} errors={errors} />;
      case 4:
        return (
          <Step4_ContactInfo
            register={register}
            password1={password1}
            password2={password2}
            setPassword1={setPassword1}
            setPassword2={setPassword2}
            showPassword1={showPassword1}
            showPassword2={showPassword2}
            togglePassword1Visibility={() => setShowPassword1((prev) => !prev)}
            togglePassword2Visibility={() => setShowPassword2((prev) => !prev)}
            formErrorMessage={formErrorMessage}
            onBack={prevStep}
            onNext={nextStep}
            errors={errors}
          />
        );
      case 5:
        return (
          <Step5_Verification
            clerkCode={clerkCode}
            onCodeChange={(e) => setClerkCode(e.target.value)}
            onVerify={handleClerkVerification}
            error={formErrorMessage}
          />
        );
      case 7:
        return (
          <Step6_SubmissionFailure
            onFinalAction={() => {
              setSubmissionError("");
              setValidationErrors([]);
              setFormErrorMessage("");
              setStep(4);
            }}
            errorMessage={submissionError}
            errorDetails={validationErrors}
          />
        );
    }
  };

  if (step === 6 || step === 7) {
    const StepComponent = step === 6 ? <Step6_Submission /> : renderStep();

    return <div className="w-full md:max-w-[70vw] md:h-auto">{StepComponent}</div>;
  }

  return (
    <div className="w-full md:max-w-[70vw] md:h-auto">
      <Card className="relative md:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] min-h-screen md:min-h-full rounded-none md:rounded-lg">
        <CardContent className="flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start h-full md:h-[320px] mt-[15px] p-1">
          <div className="w-auto md:w-[29%] flex flex-col justify-center items-center text-center p-4">
            <Image src="/logo/HBA_NoBack_NoWords.png" alt="Logo" width={100} height={100} />
            <div className="mt-[40px]">
              <strong className="text-[24px]">{t("formTitleSign")}</strong>
              {step !== 6 && <h4 className="pt-2 text-[16px]">{setPageSubtitle()}</h4>}
            </div>
          </div>

          <div className="w-full md:w-[71%] flex mx-auto">{renderStep()}</div>

          <div className="md:hidden flex mx-auto mt-[8%]">
            <LanguageSelector />
          </div>
        </CardContent>
      </Card>

      <div className="hidden md:block md:flex md:flex-row md:justify-start mt-2">
        <LanguageSelector />
      </div>
    </div>
  );
};

export default BusinessSignupApplication;
