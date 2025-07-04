import { Input } from "../shadcnComponents/input";
import StepNavigation from "./StepNavigation";
import { useTranslations } from "next-intl";

interface Step2Props {
  register: any;
  formErrorMessage: string;
  isMailingAddressSame: boolean;
  handleSameMailingAddressCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onNext: () => void;
  errors: any;
}

const Step2_Address = ({
  register,
  formErrorMessage,
  isMailingAddressSame,
  handleSameMailingAddressCheckbox,
  onBack,
  onNext,
  errors,
}: Step2Props) => {
  const t = useTranslations();

  return (
    <div className="w-[90%] mr-auto ml-auto mt-[-5px]">
      <div className="grid gap-4 mt-5">
        <Input
          key="physicalAddress-Addr"
          className="w-full border-[#8C8C8C]"
          type="text"
          id="PhysicalAddress-Addr"
          placeholder={t("physAdd") + "*"}
          {...register("businessInfo.physicalAddress.street", { required: t("physicalAddressStreetRequired") })}
        />
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-5">
            <Input
              key="physicalAddress-City"
              className="w-full border-[#8C8C8C]"
              type="text"
              id="PhysicalAddress-City"
              placeholder={t("city") + "*"}
              {...register("businessInfo.physicalAddress.city", { required: t("physicalAddressCityRequired") })}
            />
          </div>
          <div className="col-span-4">
            <Input
              key="physicalAddress-State"
              className="w-full border-[#8C8C8C]"
              type="text"
              id="PhysicalAddress-State"
              placeholder={t("state") + "*"}
              {...register("businessInfo.physicalAddress.state", { required: t("physicalAddressStateRequired") })}
            />
          </div>
          <div className="col-span-3">
            <Input
              key="physicalAddress-ZIP"
              className="w-full border-[#8C8C8C]"
              type="text"
              id="PhysicalAddress-ZIP"
              placeholder={t("zip") + "*"}
              {...register("businessInfo.physicalAddress.zip", {
                required: t("physicalAddressZipRequired"),
                pattern: {
                  value: /^\d{5}$/,
                  message: t("physicalAddressZipInvalid"),
                },
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
            {t("mailsame")}
          </label>
        </div>

        {!isMailingAddressSame && (
          <div className="grid gap-4 mt-[-0.25em]">
            <Input
              key="mailingAddress-Addr"
              className="w-full border-[#8C8C8C]"
              type="text"
              id="MailAddress-Addr"
              placeholder={t("mailAdd") + "*"}
              {...register("businessInfo.mailingAddress.street", { required: t("mailingAddressStreetRequired") })}
            />
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                <Input
                  key="mailingAddress-City"
                  className="w-full border-[#8C8C8C]"
                  type="text"
                  id="MailAddress-City"
                  placeholder={t("city") + "*"}
                  {...register("businessInfo.mailingAddress.city", { required: t("mailingAddressCityRequired") })}
                />
              </div>
              <div className="col-span-4">
                <Input
                  key="mailingAddress-State"
                  className="w-full border-[#8C8C8C]"
                  type="text"
                  id="MailAddress-State"
                  placeholder={t("state") + "*"}
                  {...register("businessInfo.mailingAddress.state", { required: t("mailingAddressStateRequired") })}
                />
              </div>
              <div className="col-span-3">
                <Input
                  key="mailingAddress-ZIP"
                  className="w-full border-[#8C8C8C]"
                  type="text"
                  id="MailAddress-ZIP"
                  placeholder={t("zip") + "*"}
                  {...register("businessInfo.mailingAddress.zip", {
                    required: t("mailingAddressZipRequired"),
                    pattern: {
                      value: /^\d{5}$/,
                      message: t("mailingAddressZipInvalid"),
                    },
                  })}
                />
              </div>
            </div>
          </div>
        )}

        {(formErrorMessage ||
          errors.businessInfo?.physicalAddress?.street ||
          errors.businessInfo?.physicalAddress?.city ||
          errors.businessInfo?.physicalAddress?.state ||
          errors.businessInfo?.physicalAddress?.zip ||
          errors.businessInfo?.mailingAddress?.street ||
          errors.businessInfo?.mailingAddress?.city ||
          errors.businessInfo?.mailingAddress?.state ||
          errors.businessInfo?.mailingAddress?.zip) && (
          <div className="text-red-600 w-full md:pr-[4.3em] md:mt-[-0.5em] text-center md:text-start">
            {formErrorMessage ||
              errors.businessInfo?.physicalAddress?.street?.message ||
              errors.businessInfo?.physicalAddress?.city?.message ||
              errors.businessInfo?.physicalAddress?.state?.message ||
              errors.businessInfo?.physicalAddress?.zip?.message ||
              errors.businessInfo?.mailingAddress?.street?.message ||
              errors.businessInfo?.mailingAddress?.city?.message ||
              errors.businessInfo?.mailingAddress?.state?.message ||
              errors.businessInfo?.mailingAddress?.zip?.message}
          </div>
        )}
      </div>

      <StepNavigation showBack={true} showSubmit={false} onBack={onBack} onNext={onNext} />
    </div>
  );
};

export default Step2_Address;
