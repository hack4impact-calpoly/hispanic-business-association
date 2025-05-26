import { BUSINESS_SCALES, BUSINESS_TYPES, EMPLOYEE_RANGES } from "@/database/types";
import StepNavigation from "./StepNavigation";
import { useTranslations } from "next-intl";

interface Step1BProps {
  register: any;
  formErrorMessage: string;
  onBack: () => void;
  onNext: () => void;
  watch: (name?: string | string[], defaultValue?: any) => any;
}

const Step1B_BusinessInfo = ({ register, formErrorMessage, onBack, onNext, watch }: Step1BProps) => {
  const t = useTranslations();

  const selectedBusinessType = watch("businessInfo.businessType") || "";
  const selectedBusinessScale = watch("businessInfo.businessScale") || "";
  const selectedEmployeeRange = watch("businessInfo.emplyeeRange") || "";

  return (
    <div className="w-[90%] mr-auto ml-auto">
      <div className="grid gap-4 mt-5 items-center">
        <select
          key="businessType"
          id="businessType"
          className={`w-full h-10 border border-[#8C8C8C] text-[14px] rounded-md p-2 focus:outline-black ${
            (selectedBusinessType || "") === "" ? "text-[#5B748C]" : "text-black"
          }`}
          {...register("businessInfo.businessType", { required: "Business Type is required" })}
        >
          <option value="">{t("businessType") + "*"}</option>
          {BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(type.toLowerCase().replace(/[\W_]+(.)?/g, (_, char) => (char ? char.toUpperCase() : "")))}
            </option>
          ))}
        </select>

        <select
          key="businessScale"
          id="businessScale"
          className={`w-full h-10 border border-[#8C8C8C] text-[14px] rounded-md p-2 focus:outline-black ${
            (selectedBusinessScale || "") === "" ? "text-[#5B748C]" : "text-black"
          }`}
          {...register("businessInfo.businessScale", { required: "Business Scale is required" })}
        >
          <option value="">{t("businessScale") + "*"}</option>
          {BUSINESS_SCALES.map((type) => (
            <option key={type} value={type}>
              {t(type.toLowerCase().replace(/[\W_]+(.)?/g, (_, char) => (char ? char.toUpperCase() : "")))}
            </option>
          ))}
        </select>

        <select
          key="numberOfEmployees"
          id="numberOfEmployees"
          className={`w-full h-10 border border-[#8C8C8C] text-[14px] rounded-md p-2 focus:outline-black ${
            (selectedEmployeeRange || "") === "" ? "text-[#5B748C]" : "text-black"
          }`}
          {...register("businessInfo.numberOfEmployees", { required: "Number of Employees is required" })}
        >
          <option value="">{t("employeeRange") + "*"}</option>
          {EMPLOYEE_RANGES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {formErrorMessage && (
          <div className="text-red-600 w-full md:pr-[4.3em] md:mt-[-0.5em] text-center md:text-start">
            {formErrorMessage}
          </div>
        )}
      </div>

      <StepNavigation showBack={true} showSubmit={false} onBack={onBack} onNext={onNext} />
    </div>
  );
};

export default Step1B_BusinessInfo;
