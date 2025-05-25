import { Input } from "../shadcnComponents/input";
import StepNavigation from "./StepNavigation";
import { useTranslations } from "next-intl";

interface Step1Props {
  register: any;
  formErrorMessage: string;
  onBack: () => void;
  onNext: () => void;
  watch: (name?: string | string[], defaultValue?: any) => any;
}

const ORG_TYPES = ["nonprofit", "community", "business"];

const Step1_BusinessInfo = ({ register, formErrorMessage, onBack, onNext, watch }: Step1Props) => {
  const t = useTranslations();

  const selectedBusinessType = watch("businessInfo.businessType") || "";

  return (
    <div className="w-[90%] mr-auto ml-auto">
      <div className="grid gap-4 mt-5">
        <Input
          key="businessName"
          className="w-full border-[#8C8C8C]"
          type="text"
          id="BusinessName"
          placeholder={t("organizationName") + "*"}
          {...register("businessInfo.businessName", { required: "Organization name is required" })}
        />

        <Input
          key="websiteURL"
          className="w-full border-[#8C8C8C]"
          type="text"
          id="WebsiteURL"
          placeholder={t("website")}
        />

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <select
              key="businessType"
              id="businessType"
              className={`w-full border border-[#8C8C8C] text-base rounded-md p-2 focus:outline-black ${
                (selectedBusinessType || "") === "" ? "text-[#5B748C]" : "text-black"
              }`}
              {...register("businessInfo.businessType", { required: "Organization Type is required" })}
            >
              <option value="">{t("organizationType") + "*"}</option>
              {ORG_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(type)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-6">
            <Input
              key="businessOwner"
              className="w-full border-[#8C8C8C]"
              type="text"
              id="businessOwner"
              placeholder={t("nameBizOwner") + "*"}
              {...register("businessInfo.businessOwner", { required: "Business Owner is required" })}
            />
          </div>
        </div>

        <Input
          key="description"
          className="w-full border-[#8C8C8C]"
          type="text"
          id="description"
          placeholder={t("bizDescrip")}
        />

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

export default Step1_BusinessInfo;
