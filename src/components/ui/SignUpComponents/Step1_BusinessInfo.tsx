import { Input } from "../input";
import StepNavigation from "./StepNavigation";

interface Step1Props {
  register: any;
  formErrorMessage: string;
  langOption: number;
  businessInfoFieldNames: string[][];
  navTitles: string[][];
  navSubmit: string[];
  onBack: () => void;
  onNext: () => void;
}

const Step1_BusinessInfo = ({
  register,
  formErrorMessage,
  langOption,
  businessInfoFieldNames,
  navTitles,
  navSubmit,
  onBack,
  onNext,
}: Step1Props) => {
  return (
    <div className="w-[90%] mr-auto ml-auto">
      <div className="grid gap-4 mt-5">
        <Input
          key="businessName"
          className="w-full border-[#8C8C8C]"
          type="text"
          id="BusinessName"
          placeholder={businessInfoFieldNames[langOption][0]}
          {...register("businessInfo.businessName", { required: "Business name is required" })}
        />

        <Input
          key="websiteURL"
          className="w-full border-[#8C8C8C]"
          type="text"
          id="WebsiteURL"
          placeholder={businessInfoFieldNames[langOption][1]}
          {...register("businessInfo.website", { required: "Website URL is required" })}
        />

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <Input
              key="businessType"
              className="w-full border-[#8C8C8C]"
              type="text"
              id="businessType"
              placeholder={businessInfoFieldNames[langOption][2]}
              {...register("businessInfo.businessType", { required: "Business Type is required" })}
            />
          </div>
          <div className="col-span-6">
            <Input
              key="businessOwner"
              className="w-full border-[#8C8C8C]"
              type="text"
              id="businessOwner"
              placeholder={businessInfoFieldNames[langOption][3]}
              {...register("businessInfo.businessOwner", { required: "Business Owner is required" })}
            />
          </div>
        </div>

        <Input
          key="description"
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

      <StepNavigation
        langOption={langOption}
        navTitles={navTitles}
        navSubmit={navSubmit}
        showBack={false}
        showSubmit={false}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
};

export default Step1_BusinessInfo;
