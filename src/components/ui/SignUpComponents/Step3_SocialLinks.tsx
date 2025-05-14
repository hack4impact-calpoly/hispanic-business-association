import { Input } from "../input";
import StepNavigation from "./StepNavigation";

interface Step3Props {
  register: any;
  langOption: number;
  navTitles: string[][];
  navSubmit: string[];
  onBack: () => void;
  onNext: () => void;
}

const Step3_SocialLinks = ({ register, langOption, navTitles, navSubmit, onBack, onNext }: Step3Props) => {
  return (
    <div className="w-[90%] mt-[8%] mr-auto ml-auto">
      <div className="grid gap-4 mt-5">
        <Input
          className="w-full border-[#8C8C8C]"
          type="text"
          id="Facebook"
          placeholder="Facebook"
          {...register("socialLinks.FB", {
            pattern: { value: /^@/, message: "Not in a familiar format." },
          })}
        />
        <Input
          className="w-full border-[#8C8C8C]"
          type="text"
          id="Instagram"
          placeholder="Instagram"
          {...register("socialLinks.IG", {
            pattern: { value: /^@/, message: "Not in a familiar format." },
          })}
        />
        <Input
          className="w-full border-[#8C8C8C]"
          type="text"
          id="X"
          placeholder="X"
          {...register("socialLinks.X", {
            pattern: { value: /^@/, message: "Not in a familiar format." },
          })}
        />
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

export default Step3_SocialLinks;
