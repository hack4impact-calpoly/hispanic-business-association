import { Input } from "../shadcnComponents/input";
import StepNavigation from "./StepNavigation";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

interface Step4Props {
  register: any;
  password1: string;
  password2: string;
  setPassword1: (val: string) => void;
  setPassword2: (val: string) => void;
  showPassword1: boolean;
  showPassword2: boolean;
  togglePassword1Visibility: () => void;
  togglePassword2Visibility: () => void;
  formErrorMessage: string;
  onBack: () => void;
  onNext: () => void;
}

const Step4_ContactInfo = ({
  register,
  password1,
  password2,
  setPassword1,
  setPassword2,
  showPassword1,
  showPassword2,
  togglePassword1Visibility,
  togglePassword2Visibility,
  formErrorMessage,
  onBack,
  onNext,
}: Step4Props) => {
  const t = useTranslations();
  return (
    <div className="w-[90%] mr-auto ml-auto">
      <div className="grid gap-2 pt-1">
        <Input
          key="contactName"
          className="w-full border-[#8C8C8C]"
          type="text"
          id="ContactName"
          placeholder={t("contactName") + "*"}
          {...register("contactInfo.name", { required: "Contact Name is required" })}
        />

        <Input
          key="contactPhone"
          className="w-full border-[#8C8C8C]"
          type="text"
          id="Phone"
          placeholder={t("bizPhoneNum") + "*"}
          {...register("contactInfo.phone", {
            required: "Phone Number is required",
            pattern: {
              value: /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
              message: "Phone Number must have nine digits.",
            },
            onChange: (e: { target: { value: string } }) => {
              e.target.value = e.target.value.replace(/\D/g, "");
            },
          })}
        />

        <Input
          key="contactEmail"
          className="w-full border-[#8C8C8C]"
          type="text"
          id="ContactEmail"
          placeholder={t("email") + "*"}
          {...register("contactInfo.email", {
            required: "Email is required",
            pattern: { value: /^[^@]+@[^@]+$/, message: "Not in a familiar format." },
          })}
        />

        <div className="relative w-full">
          <Input
            key="password1"
            className="w-full border-[#8C8C8C] pr-[4.3em]"
            type={showPassword1 ? "text" : "password"}
            id="Password1"
            value={password1}
            placeholder={t("enterPass") + "*"}
            onChange={(e) => setPassword1(e.target.value)}
          />
          <button
            type="button"
            onClick={togglePassword1Visibility}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword1 ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>

        <div className="relative w-full">
          <Input
            key="password2"
            className="w-full border-[#8C8C8C] pr-[4.3em]"
            type={showPassword2 ? "text" : "password"}
            id="Password2"
            value={password2}
            placeholder={t("reEnterPass") + "*"}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <button
            type="button"
            onClick={togglePassword2Visibility}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword2 ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
      </div>

      {formErrorMessage && (
        <div className="text-red-600 w-full md:pr-[4.3em] md:mt-[-0.5em] text-center md:text-start pt-3">
          {formErrorMessage}
        </div>
      )}

      <StepNavigation showBack={true} showSubmit={true} onBack={onBack} onNext={onNext} />
    </div>
  );
};

export default Step4_ContactInfo;
