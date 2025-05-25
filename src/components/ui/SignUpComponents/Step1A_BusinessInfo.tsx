import { Input } from "../shadcnComponents/input";
import StepNavigation from "./StepNavigation";
import { useTranslations } from "next-intl";

interface Step1AProps {
  register: any;
  formErrorMessage: string;
  onBack: () => void;
  onNext: () => void;
  watch: (name?: string | string[], defaultValue?: any) => any;
}

const ORG_TYPES = ["Nonprofit", "Community", "Business"];

const Step1A_BusinessInfo = ({ register, formErrorMessage, onBack, onNext, watch }: Step1AProps) => {
  const t = useTranslations();

  const selectedOrganizationType = watch("businessInfo.organizationType") || "";

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
              key="organizationType"
              id="organizationType"
              className={`w-full border border-[#8C8C8C] text-base rounded-md p-2 focus:outline-black ${
                (selectedOrganizationType || "") === "" ? "text-[#5B748C]" : "text-black"
              }`}
              {...register("businessInfo.organizationType", { required: "Organization Type is required" })}
            >
              <option value="">{t("organizationType") + "*"}</option>
              {ORG_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(type.toLocaleLowerCase())}
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

export default Step1A_BusinessInfo;
