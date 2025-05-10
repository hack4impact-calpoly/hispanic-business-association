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
  const englishPageSubtitles = [
    "Business Information",
    "Business Information",
    "Social Links",
    "Payment Information",
    "Payment Method",
    "Contact Information",
  ];
  const spanishPageSubtitles = [
    "Información Comercial",
    "Información Comercial",
    "Enlaces Sociales",
    "Información de Pago",
    "Método de Pago",
    "Información del Contacto",
  ];
  const numPages = 7;
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

  // for payment method / card info
  const englishPaymentInfo = ["Name on Card*", "Billing Address*", "Billing ZIP*", "Card Number*", "MM/YY*", "CVC*"];
  const spanishPaymentInfo = [
    "Nombre en la Tarjeta*",
    "Dirección de Envio*",
    "Código Postal de Facturación*",
    "Número de Tarjeta*",
    "MM/YY*",
    "CVC*",
  ];
  const paymentInfoFieldNames = [englishPaymentInfo, spanishPaymentInfo];

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
  // keeping the password(s) separate from the rest of the form
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [clerkUserID, setClerkUserID] = useState("");
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

  // for fourth page: Payment Information
  const displayPaymentInfo = () => {
    const englishPlans = ["Annual Membership Investment", "Ribbon Cutting", "Additional Category"];
    const spanishPlans = ["Inversión Anual de Membresía", "Corte de Cinta", "Categoría Adicional"];
    const langPlans = [englishPlans, spanishPlans];

    const pricesInOrder = ["$250", "$50", "$20"];

    if (step == 4) {
      return (
        <div className="flex flex-row w-[92%] h-[full] bg-[#3F5EBB] text-white p-1 rounded-lg mt-4 text-[14px]">
          {/* <div className="flex flex-row justify-between p-1 w-full"> */}
          <div className="flex flex-col items-start w-[80%] pl-2">
            <p>{langPlans[langOption][0]}</p>
            <p>{langPlans[langOption][1]}</p>
            <p>{langPlans[langOption][2]}</p>
          </div>
          <div className="flex flex-col items-end w-[20%] pr-2">
            <p>{pricesInOrder[0]}</p>
            <p>{pricesInOrder[1]}</p>
            <p>{pricesInOrder[2]}</p>
          </div>
          {/* </div> */}
        </div>
      );
    } else {
      return <div></div>;
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

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
      // TODO - the following are temp values
      membershipFeeType: "",
      membershipExpiryDate: new Date(),
      lastPayDate: new Date(),
    };

    // await sleep(3000);
    // console.log("new user: ", userData, "\nnew business: ", businessData);
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
      case 4: // payment information page
        validateData();
        break;
      case 5: // payment method page
        validateData();
        break;
      case 6: // contact information page
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
          <div>
            <div className="grid gap-4 mt-[20px] justify-start items-start">
              <div>
                <Input
                  key={`businessName-${step}`}
                  className="w-[550px] border-[#8C8C8C]"
                  type="text"
                  id="BusinessName"
                  placeholder={businessInfoFieldNames[langOption][0]}
                  {...register("businessInfo.businessName", { required: "Business name is required" })}
                />
              </div>

              <div>
                <Input
                  key={`websiteURL-${step}`}
                  className="w-[550px] border-[#8C8C8C]"
                  type="text"
                  id="WebsiteURL"
                  placeholder={businessInfoFieldNames[langOption][1]}
                  {...register("businessInfo.website", { required: "Website URL is required" })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Input
                  key={`businessType-${step}`}
                  className="w-[275px] border-[#8C8C8C]"
                  type="text"
                  id="businessType"
                  placeholder={businessInfoFieldNames[langOption][2]}
                  {...register("businessInfo.businessType", { required: "Business Type is required" })}
                />
                <Input
                  key={`businessOwner-${step}`}
                  className="w-[275px] border-[#8C8C8C]"
                  type="text"
                  id="businessOwner"
                  placeholder={businessInfoFieldNames[langOption][3]}
                  {...register("businessInfo.businessOwner", { required: "Business Owner is required" })}
                />
              </div>

              <div>
                <Input
                  key={`description-${step}`}
                  className="w-[550px] border-[#8C8C8C]"
                  type="text"
                  id="description"
                  placeholder={businessInfoFieldNames[langOption][4]}
                  {...register("businessInfo.description", { required: "Description is required" })}
                />
              </div>
              {formErrorMessage && <div className="text-red-600">{formErrorMessage}</div>}
            </div>
            {renderNavButtons(false, false)}
          </div>
        );
      case 2:
        return (
          <div>
            <div className="grid gap-4 mt-[80px] justify-start items-start">
              <div className="flex items-center gap-2">
                <Input
                  key={`physicalAddress-Addr-${step}`}
                  className="w-[264px] border-[#8C8C8C]"
                  type="text"
                  id="PhysicalAddress-Addr"
                  placeholder={businessInfoFieldNames[langOption][5]}
                  {...register("businessInfo.physicalAddress.street", { required: "Address is required" })}
                />
                <Input
                  key={`physicalAddress-City-${step}`}
                  className="w-[130px] border-[#8C8C8C]"
                  type="text"
                  id="PhysicalAddress-City"
                  placeholder={businessInfoFieldNames[langOption][7]}
                  {...register("businessInfo.physicalAddress.city", { required: "City is required" })}
                />
                <Input
                  key={`physicalAddress-State-${step}`}
                  className="w-[72px] border-[#8C8C8C]"
                  type="text"
                  id="PhysicalAddress-State"
                  placeholder={businessInfoFieldNames[langOption][8]}
                  {...register("businessInfo.physicalAddress.state", { required: "State is required" })}
                />
                <Input
                  key={`physicalAddress-ZIP-${step}`}
                  className="w-[60px] border-[#8C8C8C]"
                  type="text"
                  id="PhysicalAddress-ZIP"
                  placeholder={businessInfoFieldNames[langOption][9]}
                  {...register("businessInfo.physicalAddress.zip", {
                    required: "ZIP is required",
                    pattern: {
                      value: /^\d{5}$/, // Ensures exactly 5 digits
                      message: "ZIP code must be exactly 5 digits",
                    },
                  })}
                />
              </div>

              <div className="flex items-center mt-[-8px] mb-[-8px] text-[13px]">
                <label htmlFor="sameAddress" className="flex items-center">
                  <input
                    type="checkbox"
                    id="sameAddress"
                    onChange={(e) => setIsMailingAddressSame(e.target.checked)} // use state to track if the checkbox is checked
                  />
                  {businessInfoFieldNames[langOption][10]}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  key={`mailingAddress-Addr-${step}`}
                  className="w-[264px] border-[#8C8C8C]"
                  type="text"
                  id="MailAddress-Addr"
                  placeholder={businessInfoFieldNames[langOption][6]}
                  {...register("businessInfo.mailingAddress.street", { required: "Address is required" })}
                />
                <Input
                  key={`mailingAddress-City-${step}`}
                  className="w-[130px] border-[#8C8C8C]"
                  type="text"
                  id="MailAddress-City"
                  placeholder={businessInfoFieldNames[langOption][7]}
                  {...register("businessInfo.mailingAddress.city", { required: "City is required" })}
                />
                <Input
                  key={`mailingAddress-State-${step}`}
                  className="w-[72px] border-[#8C8C8C]"
                  type="text"
                  id="MailAddress-State"
                  placeholder={businessInfoFieldNames[langOption][8]}
                  {...register("businessInfo.mailingAddress.state", { required: "State is required" })}
                />
                <Input
                  key={`mailingAddress-ZIP-${step}`}
                  className="w-[60px] border-[#8C8C8C]"
                  type="text"
                  id="MailAddress-ZIP"
                  placeholder={businessInfoFieldNames[langOption][9]}
                  {...register("businessInfo.mailingAddress.zip", { required: "ZIP is required" })}
                />
              </div>
              {formErrorMessage && <div className="text-red-600">{formErrorMessage}</div>}
            </div>
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
                  {...register("socialLinks.FB", {
                    pattern: {
                      value: /^@/,
                      message: "Not in a familiar format.",
                    },
                  })}
                />
              </div>
              <div>
                <Input
                  className="w-[250px] border-[#8C8C8C]"
                  type="text"
                  id="Instagram"
                  placeholder="Instagram"
                  {...register("socialLinks.IG", {
                    pattern: {
                      value: /^@/,
                      message: "Not in a familiar format.",
                    },
                  })}
                />
              </div>
              <div>
                <Input
                  className="w-[250px] border-[#8C8C8C]"
                  type="text"
                  id="X"
                  placeholder="X"
                  {...register("socialLinks.X", {
                    pattern: {
                      value: /^@/,
                      message: "Not in a familiar format.",
                    },
                  })}
                />
              </div>
            </div>
            {renderNavButtons(true, false)}
          </div>
        );
      case 4:
        // NOTE: There may be code below that is not currently used because field is
        // not required until we have a payment system set up.
        return (
          <div className="w-full flex flex-col items-start justify-start">
            <Input
              key={`amountPaid-${step}`}
              className="w-[350px] border-[#8C8C8C] mt-[140px] ml-[40px]"
              type="text"
              id="AmountPaid"
              placeholder={langOption == 0 ? "Amount Paid ($)*" : "Monto Pagado ($)*"}
              // {...register("amountPaid", {
              // required: "Amount Paid is required",
              // pattern: {
              //   value: /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/,
              //   message: "Not in a familiar format.",
              // },
              // })}
            />
            <div className="w-[350px] mt-[10px] ml-[25px]">
              {formErrorMessage && <div className="text-red-600">{formErrorMessage}</div>}
            </div>
            {renderNavButtons(true, false)}
          </div>
        );
      case 5:
        // NOTE: There may be code below that is not currently used because field is
        // not required until we have a payment system set up.
        return (
          <div>
            <div className="grid gap-4 mt-[60px] justify-start items-start">
              <div>
                <Input
                  key={`cardName-${step}`}
                  className="w-[550px] border-[#8C8C8C]"
                  type="text"
                  id="CardName"
                  placeholder={paymentInfoFieldNames[langOption][0]}
                  // {...register()}
                />
              </div>

              <div className="flex items-center gap-2">
                <Input
                  key={`billingAddress-${step}`}
                  className="w-[372px] border-[#8C8C8C]"
                  type="text"
                  id="BillingAddress"
                  placeholder={paymentInfoFieldNames[langOption][1]}
                  // {...register()}
                />
                <Input
                  key={`billingZIP-${step}`}
                  className="w-[170px] border-[#8C8C8C]"
                  type="text"
                  id="BillingZIP"
                  placeholder={paymentInfoFieldNames[langOption][2]}
                  // {...register()}
                />
              </div>

              <div className="flex items-center gap-2">
                <Input
                  key={`cardNumber-${step}`}
                  className="w-[372px] border-[#8C8C8C]"
                  type="text"
                  id="CardNumber"
                  placeholder={paymentInfoFieldNames[langOption][3]}
                  // {...register(, {
                  //   required: "Card Number is required",
                  //   pattern: {
                  //     value: /^(?:\d{4}[-\s]?){3}\d{4}|\d{13,19}$/,
                  //     message: "Card Number not recognizable digits.",
                  //   },
                  //   onChange: (e) => {
                  //     e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  //   }
                  // })}
                />
                <Input
                  key={`cardExpiration-${step}`}
                  className="w-[81px] border-[#8C8C8C]"
                  type="text"
                  id="CardExpiration"
                  placeholder={paymentInfoFieldNames[langOption][4]}
                  // {...register(, {
                  //   pattern: {
                  //     value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  //     message: "Expiration must follow MM/YY format.",
                  //   },
                  //   onChange: (e) => {
                  //     e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  //   },
                  // })}
                />
                <Input
                  key={`CVC-${step}`}
                  className="w-[81px] border-[#8C8C8C]"
                  type="text"
                  id="CVC"
                  placeholder={paymentInfoFieldNames[langOption][5]}
                  // {...register(, {
                  //   pattern: {
                  //     value: /^\d{3}$/,
                  //     message: "CVC must follow XXX format.",
                  //   },
                  //   onChange: (e) => {
                  //     e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  //   },
                  // })}
                />
              </div>
              {formErrorMessage && <div className="text-red-600">{formErrorMessage}</div>}
            </div>
            {renderNavButtons(true, false)}
          </div>
        );
      case 6:
        return (
          <div>
            <div className="grid gap-4 justify-start items-start">
              <div className="flex items-center gap-2">
                <Input
                  key={`contactName-${step}`}
                  className="w-[450px] border-[#8C8C8C]"
                  type="text"
                  id="ContactName"
                  placeholder={contactInfoFieldNames[langOption][0]}
                  {...register("contactInfo.name", { required: "Contact Name is required" })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Input
                  key={`contactPhone-${step}`}
                  className="w-[450px] border-[#8C8C8C]"
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
              </div>

              <div>
                <Input
                  key={`contactEmail-${step}`}
                  className="w-[450px] border-[#8C8C8C]"
                  type="text"
                  id="ContactEmail"
                  placeholder={contactInfoFieldNames[langOption][2]}
                  {...register("contactInfo.email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^@]+@[^@]+$/,
                      message: "Not in a familiar format.",
                    },
                  })}
                />
              </div>

              <div>
                <Input
                  key={`password1-${step}`}
                  className="w-[450px] border-[#8C8C8C]"
                  type="password"
                  id="Password1"
                  value={password1}
                  placeholder={contactInfoFieldNames[langOption][3]}
                  onChange={(e) => setPassword1(e.target.value)}
                />
              </div>

              <div>
                <Input
                  key={`password2-${step}`}
                  className="w-[450px] border-[#8C8C8C]"
                  type="password"
                  id="Password2"
                  value={password2}
                  placeholder={contactInfoFieldNames[langOption][4]}
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </div>
              {formErrorMessage && <div className="text-red-600">{formErrorMessage}</div>}
            </div>
            {renderNavButtons(true, true)}
          </div>
        );
    }
  };

  if (step < 7) {
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
              {displayPaymentInfo()}
            </div>
            <div className="w-[65%] flex justify-center">{renderStepForm()}</div>
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
