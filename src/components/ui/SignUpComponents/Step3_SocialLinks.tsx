import { Input } from "../shadcnComponents/input";
import StepNavigation from "./StepNavigation";
import { useTranslations } from "next-intl";

interface Step3Props {
  register: any;
  onBack: () => void;
  onNext: () => void;
  errors: any;
}

const Step3_SocialLinks = ({ register, onBack, onNext, errors }: Step3Props) => {
  const t = useTranslations();

  return (
    <div className="w-[90%] mt-[8%] mr-auto ml-auto">
      <div className="grid gap-4 mt-5">
        <Input
          className="w-full border-[#8C8C8C]"
          type="text"
          id="Facebook"
          placeholder="Facebook"
          {...register("socialLinks.FB", {
            pattern: { value: /^@/, message: t("socialMediaFormatInvalid") },
          })}
        />
        <Input
          className="w-full border-[#8C8C8C]"
          type="text"
          id="Instagram"
          placeholder="Instagram"
          {...register("socialLinks.IG", {
            pattern: { value: /^@/, message: t("socialMediaFormatInvalid") },
          })}
        />
        <Input
          className="w-full border-[#8C8C8C]"
          type="text"
          id="X"
          placeholder="X"
          {...register("socialLinks.twitter", {
            pattern: { value: /^@/, message: t("socialMediaFormatInvalid") },
          })}
        />

        {(errors.socialLinks?.FB || errors.socialLinks?.IG || errors.socialLinks?.twitter) && (
          <div className="text-red-600 w-full md:pr-[4.3em] md:mt-[-0.5em] text-center md:text-start">
            {errors.socialLinks?.FB?.message || errors.socialLinks?.IG?.message || errors.socialLinks?.twitter?.message}
          </div>
        )}
      </div>

      <StepNavigation showBack={true} showSubmit={false} onBack={onBack} onNext={onNext} />
    </div>
  );
};

export default Step3_SocialLinks;
