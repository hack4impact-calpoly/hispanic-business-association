import { Input } from "../shadcnComponents/input";
import { Button } from "../shadcnComponents/button";
import { useTranslations } from "next-intl";

interface Step5VerificationProps {
  clerkCode: string;
  onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  error?: string;
}

const Step5_Verification = ({ clerkCode, onCodeChange, onVerify, error }: Step5VerificationProps) => {
  const t = useTranslations();

  return (
    <div className="w-[90%] mr-auto ml-auto mt-4 space-y-4">
      <Input placeholder="Enter verification code" value={clerkCode} onChange={onCodeChange} />
      <Button onClick={onVerify} className="bg-[#405BA9] rounded-3xl">
        {t("verifyEmail")}
      </Button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
};

export default Step5_Verification;
