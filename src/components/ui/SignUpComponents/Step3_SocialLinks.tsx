import { Input } from "../shadcnComponents/input";
import StepNavigation from "./StepNavigation";

interface Step3Props {
  register: any;
  onBack: () => void;
  onNext: () => void;
}

const Step3_SocialLinks = ({ register, onBack, onNext }: Step3Props) => {
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
          {...register("socialLinks.twitter", {
            pattern: { value: /^@/, message: "Not in a familiar format." },
          })}
        />
      </div>

      <StepNavigation showBack={true} showSubmit={false} onBack={onBack} onNext={onNext} />
    </div>
  );
};

export default Step3_SocialLinks;
