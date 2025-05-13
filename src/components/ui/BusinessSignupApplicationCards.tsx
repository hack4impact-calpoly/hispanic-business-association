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
import { IUser } from "@/database/userSchema";
import { IBusiness } from "@/database/businessSchema";
import { Eye, EyeOff } from "lucide-react";

interface BusinessSignupAppInfo {
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  businessInfo: {
    businessName: string;
    website: string;
    businessOwner: string;
    businessType: string;
    description: string;
    physicalAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    mailingAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  socialLinks: {
    IG?: string;
    X?: string;
    FB?: string;
  };
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
  const numPages = 5;
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
    "Re-enter Password*",
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

  const [clerkUserID, setClerkUserID] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // Toggle password visibilities
  const togglePassword1Visibility = () => {
    setShowPassword1(!showPassword1);
  };
  const togglePassword2Visibility = () => {
    setShowPassword2(!showPassword2);
  };

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
    console.log(`formErrorMessage: ${formErrorMessage}`);
    if (
      formErrorMessage !== "" &&
      (errorMsgs[0].includes(formErrorMessage) || errorMsgs[1].includes(formErrorMessage))
    ) {
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

  // POST to Clerk
  const createClerkUser = async (): Promise<string | null> => {
    const isValid = await trigger();
    if (!isValid) {
      setFormErrorMessage(errorMsgs[langOption]);
      return null;
    }

    if (password1 !== password2) {
      const err = langOption === 0 ? "Passwords don't match" : "Las contraseñas no coinciden";
      console.error(err);
      setFormErrorMessage(err);
      return null;
    }

    const email = getValues("contactInfo.email");

    try {
      const res = await fetch("/api/clerkUser", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password1 }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const unknownErr = langOption === 0 ? "Problem creating profile" : "Problema al crear perfil";
        const errMsg = data?.error?.errors?.[0]?.message || unknownErr;
        console.error("Error from server:", errMsg);
        setFormErrorMessage(errMsg);
        return null;
      }

      if (data.user) {
        const id = data.user.id;
        setClerkUserID(id);
        setFormErrorMessage("");
        return id;
      } else {
        const err =
          langOption === 0 ? "Failed to create user from data" : "Error al crear el usuario a partir de los datos";
        console.error(err);
        setFormErrorMessage(err);
        return null;
      }
    } catch (err) {
      console.error("Fetch or parsing error:", err);
      const errMsg = langOption === 0 ? "Network or server error." : "Error de red o del servidor.";
      setFormErrorMessage(errMsg);
      return null;
    }
  };

  // function sleep(ms: number): Promise<void> {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

  const postAllData = async (clerkID: string) => {
    const isValid = await trigger();

    if (!isValid) throw new Error("Problem getting inputs from form.");
    const formValues = getValues();
    const userData: IUser = {
      ...formValues.contactInfo,
      phone: Number(formValues.contactInfo.phone),
      role: "business",
      clerkUserID: clerkID,
    };
    const businessData: IBusiness = {
      clerkUserID: clerkID,
      ...formValues.businessInfo,
      physicalAddress: {
        ...formValues.businessInfo.physicalAddress,
        zip: Number(formValues.businessInfo.physicalAddress.zip),
      },
      mailingAddress: {
        ...formValues.businessInfo.mailingAddress,
        zip: Number(formValues.businessInfo.mailingAddress.zip),
      },
      pointOfContact: {
        name: formValues.contactInfo.name,
        email: formValues.contactInfo.email,
        phoneNumber: Number(formValues.contactInfo.phone),
      },
      // the following are dummy values
      membershipFeeType: "",
      membershipExpiryDate: new Date(),
      lastPayDate: new Date(),
    };

    // await sleep(3000);
    // console.log("new user: ", userData, "\nnew business: ", businessData);
    setStep(Math.min(numPages, step + 1));
    return true;
  };

  // Step navigation (step # corresponds to which modal displays)
  const nextStep = async () => {
    switch (step) {
      case 1: // business information page 1
        validateData();
        break;
      case 2: // business information page 2
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
        const clerkID = await createClerkUser();
        if (clerkID) {
          await postAllData(clerkID);
          setStep(Math.min(numPages, step + 1));
        }
    }
  };
  const prevStep = () => {
    setFormErrorMessage("");
    setStep(Math.max(1, step - 1));
  };

  const handleSameMailingAddressCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormErrorMessage("");
    if (!checked) {
      if (isMailingAddressSame) {
        // flush out mailing address info if checkbox is unchecked
        setValue("businessInfo.mailingAddress.street", "");
        setValue("businessInfo.mailingAddress.city", "");
        setValue("businessInfo.mailingAddress.state", "");
        setValue("businessInfo.mailingAddress.zip", "");
      }
    }
    setIsMailingAddressSame(checked);
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
            variant="outline"
            className="
              text-[#405BA9] border-[#405BA9] rounded-3xl
              focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none
              hover:bg-gray-100
            "
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
            variant="outline"
            className="
              text-[#405BA9] border-[#405BA9] rounded-3xl
              focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none
              hover:bg-gray-100
            "
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

              {formErrorMessage && (
                <div className="text-red-600 w-full md:pr-[4.3em] md:mt-[-0.5em] text-center md:text-start">
                  {formErrorMessage}
                </div>
              )}
            </div>

            {renderNavButtons(false, false)}
          </div>
        );
      case 2:
        return (
          <div className="w-[90%] mr-auto ml-auto mt-[-10px]">
            <div className="grid gap-4 mt-5">
              <Input
                key={`physicalAddress-Addr-${step}`}
                className="w-full border-[#8C8C8C]"
                type="text"
                id="PhysicalAddress-Addr"
                placeholder={businessInfoFieldNames[langOption][5]}
                {...register("businessInfo.physicalAddress.street", { required: "Address is required" })}
              />
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <Input
                    key={`physicalAddress-City-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="text"
                    id="PhysicalAddress-City"
                    placeholder={businessInfoFieldNames[langOption][7]}
                    {...register("businessInfo.physicalAddress.city", { required: "City is required" })}
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    key={`physicalAddress-State-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="text"
                    id="PhysicalAddress-State"
                    placeholder={businessInfoFieldNames[langOption][8]}
                    {...register("businessInfo.physicalAddress.state", { required: "State is required" })}
                  />
                </div>
                <div className="col-span-3">
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

              <div className="flex items-center mt-[-8px] text-[13px]">
                <label htmlFor="sameAddress" className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-[4px]"
                    id="sameAddress"
                    checked={isMailingAddressSame}
                    onChange={handleSameMailingAddressCheckbox}
                  />
                  {businessInfoFieldNames[langOption][10]}
                </label>
              </div>

              {!isMailingAddressSame && (
                <div className="grid gap-4 mt-[-0.25em]">
                  <Input
                    key={`mailingAddress-Addr-${step}`}
                    className="w-full border-[#8C8C8C]"
                    type="text"
                    id="MailAddress-Addr"
                    placeholder={businessInfoFieldNames[langOption][6]}
                    {...register("businessInfo.mailingAddress.street", { required: "Address is required" })}
                  />
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-5">
                      <Input
                        key={`mailingAddress-City-${step}`}
                        className="w-full border-[#8C8C8C]"
                        type="text"
                        id="MailAddress-City"
                        placeholder={businessInfoFieldNames[langOption][7]}
                        {...register("businessInfo.mailingAddress.city", { required: "City is required" })}
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        key={`mailingAddress-State-${step}`}
                        className="w-full border-[#8C8C8C]"
                        type="text"
                        id="MailAddress-State"
                        placeholder={businessInfoFieldNames[langOption][8]}
                        {...register("businessInfo.mailingAddress.state", { required: "State is required" })}
                      />
                    </div>
                    <div className="col-span-3">
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
                </div>
              )}
              {formErrorMessage && (
                <div className="text-red-600 w-full md:pr-[4.3em] md:mt-[-0.5em] text-center md:text-start">
                  {formErrorMessage}
                </div>
              )}
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
            <div className="grid gap-3">
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

              <div className="relative w-full">
                <Input
                  key={`password1-${step}`}
                  className="w-full border-[#8C8C8C] pr-[4.3em]"
                  type={showPassword1 ? "text" : "password"}
                  id="Password1"
                  value={password1}
                  placeholder={contactInfoFieldNames[langOption][3]}
                  onChange={(e) => setPassword1(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePassword1Visibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword1 ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="relative w-full">
                <Input
                  key={`password2-${step}`}
                  className="w-full border-[#8C8C8C] pr-[4.3em]"
                  type={showPassword2 ? "text" : "password"}
                  id="Password2"
                  value={password2}
                  placeholder={contactInfoFieldNames[langOption][4]}
                  onChange={(e) => setPassword2(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePassword2Visibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword2 ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            {formErrorMessage && (
              <div className="text-red-600 w-full md:pr-[4.3em] md:mt-[-0.5em] text-center md:text-start pt-2">
                {formErrorMessage}
              </div>
            )}
            {renderNavButtons(true, true)}
          </div>
        );
    }
  };

  if (step < 5) {
    return (
      <div className="w-full md:max-w-[70vw] md:h-auto">
        <Card className="relative md:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] min-h-screen md:min-h-full rounded-none md:rounded-lg">
          <CardContent className="flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start h-full md:h-[320px] mt-[15px] p-1">
            <div className="w-auto md:w-[35%] flex flex-col justify-center items-center text-center p-4">
              <Image src="/logo/HBA_NoBack_NoWords.png" alt="Logo" width={100} height={100} />
              <div className="mt-[40px]">
                <strong className="text-[24px]">{formTitle[langOption]}</strong>
                <h4 className="pt-2 text-[16px]">{pageSubtitles[langOption][step - 1]}</h4>
              </div>
            </div>
            <div className="w-full md:w-[65%] flex mx-auto">{renderStepForm()}</div>
            <div className="md:hidden flex mx-auto mt-[8%]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-[#405BA9] text-white hover:bg-[#293241] hover:opacity-100 hover:shadow-none"
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
          </CardContent>
        </Card>
        <div className="hidden md:block md:flex md:flex-row md:justify-start">
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
      <div className="w-full md:max-w-[70vw] md:h-auto">
        <Card className="relative shadow-none md:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] min-h-screen md:min-h-full rounded-none md:rounded-lg">
          <CardContent className="md:flex-row h-full md:h-[320px] mt-[15px] items-center p-4">
            <div className="w-full flex justify-center md:justify-start items-center md:items-start p-4">
              <Image src="/logo/HBA_NoBack_NoWords.png" alt="Logo" width={100} height={100} />
            </div>
            <div className="flex flex-col justify-center items-center w-full h-[60%]">
              <Image src="/icons/Request Approved.png" alt="Checkmark" width={60} height={60} />
              <strong className="text-[18px] text-center">{submissionTitle[langOption]}</strong>
              <h5>{submissionSubtitle[langOption]}</h5>
              <div className="bg-[#3F5EBB] text-white p-4 rounded-lg mt-4">
                <ol className="list-decimal list-inside space-y-2 text-left text-[14px]">
                  <li>{submissionSteps[langOption][0]}</li>
                  <li>{submissionSteps[langOption][1]}</li>
                  <li>{submissionSteps[langOption][2]}</li>
                </ol>
              </div>
            </div>
            <div className="md:hidden flex mx-auto justify-center mt-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-[#405BA9] text-white hover:bg-[#293241] hover:opacity-100 hover:shadow-none"
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
          </CardContent>
        </Card>
        <div className="hidden md:block md:flex md:flex-row md:justify-start">
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
