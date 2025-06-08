import Image from "next/image";
import { Button } from "../shadcnComponents/button";
import LanguageSelector from "./LanguageSelector";
import { useTranslations } from "next-intl";

interface Step6FailureProps {
  onFinalAction?: () => void;
  finalButtonLabel?: string;
  errorMessage?: string;
  errorDetails?: string[];
}

const Step6_SubmissionFailure = ({
  onFinalAction,
  finalButtonLabel,
  errorMessage,
  errorDetails = [],
}: Step6FailureProps) => {
  const t = useTranslations();

  return (
    <div className="w-full md:max-w-[70vw] md:h-auto">
      <div className="relative bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] min-h-screen md:min-h-full rounded-none md:rounded-lg">
        <div className="flex flex-col h-full min-h-screen md:min-h-[400px] mt-[15px] p-4">
          <div className="w-full flex justify-center md:justify-start items-center md:items-start p-4">
            <Image src="/logo/HBA_NoBack_NoWords.png" alt="Logo" width={100} height={100} />
          </div>

          <div className="flex flex-col justify-center items-center w-full flex-1">
            <Image src="/icons/Requests/Request Denied.png" alt="Error" width={60} height={60} />
            <strong className="text-[18px] text-center text-red-600">{t("submissionFailedTitle")}</strong>
            <h5 className="text-red-600">{errorMessage || t("submissionFailedMessage")}</h5>

            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mt-4 w-full max-w-md">
              {errorDetails.length > 0 ? (
                <div
                  className={`${errorDetails.length > 3 ? "max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-red-300" : ""}`}
                >
                  <ul className="list-disc list-inside space-y-2 text-left text-[14px]">
                    {errorDetails.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-left text-[14px]">{t("submissionFailedInstructions")}</p>
              )}
            </div>

            {onFinalAction && (
              <Button
                className="mt-6 bg-red-600 hover:bg-red-700 text-white rounded-3xl"
                type="button"
                onClick={onFinalAction}
              >
                {finalButtonLabel || t("tryAgain")}
              </Button>
            )}
          </div>

          <div className="md:hidden flex mx-auto justify-center mt-5">
            <LanguageSelector />
          </div>
        </div>
      </div>

      <div className="hidden md:block md:flex md:flex-row md:justify-start">
        <LanguageSelector />
      </div>
    </div>
  );
};

export default Step6_SubmissionFailure;
