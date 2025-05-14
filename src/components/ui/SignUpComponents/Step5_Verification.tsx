import { Input } from "../input";
import { Button } from "../button";

interface Step5VerificationProps {
  clerkCode: string;
  onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  error?: string;
}

const Step5_Verification = ({ clerkCode, onCodeChange, onVerify, error }: Step5VerificationProps) => {
  return (
    <div className="w-[90%] mr-auto ml-auto mt-4 space-y-4">
      <Input placeholder="Enter verification code" value={clerkCode} onChange={onCodeChange} />
      <Button onClick={onVerify} className="bg-[#405BA9] rounded-3xl">
        Verify Email
      </Button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
};

export default Step5_Verification;
