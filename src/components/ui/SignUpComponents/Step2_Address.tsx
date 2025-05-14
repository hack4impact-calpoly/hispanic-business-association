import { Input } from "../input";
import StepNavigation from "./StepNavigation";

interface Step2Props {
  register: any;
  getValues: any;
  setValue: any;
  formErrorMessage: string;
  langOption: number;
  businessInfoFieldNames: string[][];
  isMailingAddressSame: boolean;
  handleSameMailingAddressCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void;
  navTitles: string[][];
  navSubmit: string[];
  onBack: () => void;
  onNext: () => void;
}

const Step2_Address = ({
  register,
  getValues,
  setValue,
  formErrorMessage,
  langOption,
  businessInfoFieldNames,
  isMailingAddressSame,
  handleSameMailingAddressCheckbox,
  navTitles,
  navSubmit,
  onBack,
  onNext,
}: Step2Props) => {
  return (
    <div className="w-[90%] mr-auto ml-auto mt-[-5px]">
      <div className="grid gap-4 mt-5">
        <Input
          key="physicalAddress-Addr"
          className="w-full border-[#8C8C8C]"
          type="text"
          id="PhysicalAddress-Addr"
          placeholder={businessInfoFieldNames[langOption][5]}
          {...register("businessInfo.physicalAddress.street", { required: "Address is required" })}
        />
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-5">
            <Input
              key="physicalAddress-City"
              className="w-full border-[#8C8C8C]"
              type="text"
              id="PhysicalAddress-City"
              placeholder={businessInfoFieldNames[langOption][7]}
              {...register("businessInfo.physicalAddress.city", { required: "City is required" })}
            />
          </div>
          <div className="col-span-4">
            <Input
              key="physicalAddress-State"
              className="w-full border-[#8C8C8C]"
              type="text"
              id="PhysicalAddress-State"
              placeholder={businessInfoFieldNames[langOption][8]}
              {...register("businessInfo.physicalAddress.state", { required: "State is required" })}
            />
          </div>
          <div className="col-span-3">
            <Input
              key="physicalAddress-ZIP"
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
              key="mailingAddress-Addr"
              className="w-full border-[#8C8C8C]"
              type="text"
              id="MailAddress-Addr"
              placeholder={businessInfoFieldNames[langOption][6]}
              {...register("businessInfo.mailingAddress.street", { required: "Address is required" })}
            />
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                <Input
                  key="mailingAddress-City"
                  className="w-full border-[#8C8C8C]"
                  type="text"
                  id="MailAddress-City"
                  placeholder={businessInfoFieldNames[langOption][7]}
                  {...register("businessInfo.mailingAddress.city", { required: "City is required" })}
                />
              </div>
              <div className="col-span-4">
                <Input
                  key="mailingAddress-State"
                  className="w-full border-[#8C8C8C]"
                  type="text"
                  id="MailAddress-State"
                  placeholder={businessInfoFieldNames[langOption][8]}
                  {...register("businessInfo.mailingAddress.state", { required: "State is required" })}
                />
              </div>
              <div className="col-span-3">
                <Input
                  key="mailingAddress-ZIP"
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

      <StepNavigation
        langOption={langOption}
        navTitles={navTitles}
        navSubmit={navSubmit}
        showBack={true}
        showSubmit={false}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
};

export default Step2_Address;
