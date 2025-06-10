import { GENDER_OPTIONS, ORGANIZATION_TYPES } from "@/database/types";
import { Input } from "../shadcnComponents/input";
import StepNavigation from "./StepNavigation";
import { useTranslations } from "next-intl";

interface Step1AProps {
  register: any;
  formErrorMessage: string;
  onBack: () => void;
  onNext: () => void;
  watch: (name?: string | string[], defaultValue?: any) => any;
  errors: any;
}

const Step1A_BusinessInfo = ({ register, formErrorMessage, onBack, onNext, watch, errors }: Step1AProps) => {
  const t = useTranslations();

  const selectedOrganizationType = watch("businessInfo.organizationType") || "";
  const selectedGender = watch("businessInfo.gender") || "";

  return (
    <div className="w-[90%] mr-auto ml-auto">
      <div className="grid gap-4 mt-5">
        <Input
          key="businessName"
          className="w-full border-[#8C8C8C]"
          type="text"
          id="BusinessName"
          placeholder={t("organizationName") + "*"}
          {...register("businessInfo.businessName", { required: t("businessNameRequired") })}
        />
        <div className="grid grid-cols-12 gap-2">
          <Input
            key="website"
            className="w-full border-[#8C8C8C] col-span-6"
            type="text"
            id="website"
            placeholder={t("website")}
            {...register("businessInfo.website")}
          />
          <div className="col-span-6">
            <select
              key="organizationType"
              id="organizationType"
              className={`w-full h-10 border border-[#8C8C8C] text-[14px] rounded-md p-2 focus:outline-black ${
                (selectedOrganizationType || "") === "" ? "text-[#5B748C]" : "text-black"
              }`}
              {...register("businessInfo.organizationType", { required: t("organizationTypeRequired") })}
            >
              <option value="">{t("organizationType") + "*"}</option>
              {ORGANIZATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(type.toLocaleLowerCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-12 mt-[-10px] mb-[-10px] pr-1">
          <div className="col-span-10">{"*" + t("genderRequirement")}</div>
        </div>

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <Input
              key="businessOwner"
              className="w-full border-[#8C8C8C]"
              type="text"
              id="businessOwner"
              placeholder={t("nameBizOwner") + "*"}
              {...register("businessInfo.businessOwner", { required: t("businessOwnerRequired") })}
            />
          </div>
          <div className="col-span-6">
            <select
              key="gender"
              id="gender"
              className={`w-full h-10 border border-[#8C8C8C] text-[14px] rounded-md p-2 focus:outline-black ${
                (selectedGender || "") === "" ? "text-[#5B748C]" : "text-black"
              }`}
              {...register("businessInfo.gender", { required: t("genderRequired") })}
            >
              <option value="">{t("ownerGender") + "*"}</option>
              {GENDER_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {t(type.toLowerCase().replace(/[\W_]+(.)?/g, (_, char) => (char ? char.toUpperCase() : "")))}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          key="description"
          className="w-full border-[#8C8C8C]"
          type="text"
          id="description"
          placeholder={t("bizDescrip")}
          {...register("businessInfo.description")}
        />

        {(formErrorMessage ||
          errors.businessInfo?.businessName ||
          errors.businessInfo?.organizationType ||
          errors.businessInfo?.businessOwner ||
          errors.businessInfo?.gender) && (
          <div className="text-red-600 w-full md:pr-[4.3em] md:mt-[-0.5em] text-center md:text-start">
            {formErrorMessage ||
              errors.businessInfo?.businessName?.message ||
              errors.businessInfo?.organizationType?.message ||
              errors.businessInfo?.businessOwner?.message ||
              errors.businessInfo?.gender?.message}
          </div>
        )}
      </div>

      <StepNavigation showBack={false} showSubmit={false} onBack={onBack} onNext={onNext} />
    </div>
  );
};

export default Step1A_BusinessInfo;
