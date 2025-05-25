import { Input } from "../shadcnComponents/input";
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

  const EMPLOYEE_RANGE = ["1-10", "11-20", "21-50", "51-99", "100+"];
  const BUSINESS_SCALE = ["Corporate", "Small Business"];
  const BUSINESS_TYPES = [
    "Food",
    "Housing",
    "Banking/Finance",
    "Retail shops",
    "Wedding/Events",
    "Automotive",
    "Education",
    "Technology",
    "Marketing",
    "Other",
  ];

  const selectedBusinessType = watch("businessInfo.businessType") || "";
  const selectedBusinessScale = watch("businessInfo.businessScale") || "";
  const selectedEmployeeRange = watch("businessInfo.emplyeeRange") || "";

  return (
    <div className="w-[90%] mr-auto ml-auto">
      <div className="grid gap-4 mt-5 items-center">
        <div className="col-span-6">
          <select
            key="businessType"
            id="businessType"
            className={`w-full border border-[#8C8C8C] text-base rounded-md p-2 focus:outline-black ${
              (selectedBusinessType || "") === "" ? "text-[#5B748C]" : "text-black"
            }`}
            {...register("businessInfo.businessType", { required: "Business Type is required" })}
          >
            <option value="">{t("organizationType") + "*"}</option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(type)}
              </option>
            ))}
          </select>
        </div>

        {formErrorMessage && (
          <div className="text-red-600 w-full md:pr-[4.3em] md:mt-[-0.5em] text-center md:text-start">
            {formErrorMessage}
          </div>
        )}
      </div>

      <StepNavigation showBack={false} showSubmit={false} onBack={onBack} onNext={onNext} />
    </div>
  );
};

export default Step1B_BusinessInfo;
