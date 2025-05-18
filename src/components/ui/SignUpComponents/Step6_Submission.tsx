import Image from "next/image";
import { Button } from "../shadcnComponents/button";
import LanguageSelector from "./LanguageSelector";
import { useTranslations } from "next-intl";

interface Step6Props {
  onFinalAction?: () => void;
  finalButtonLabel?: string;
}

const Step6_Submission = ({ onFinalAction, finalButtonLabel = "Return" }: Step6Props) => {
  const t = useTranslations();
  return (
    <div className="w-full md:max-w-[70vw] md:h-auto">
      <div className="relative bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] min-h-screen md:min-h-full rounded-none md:rounded-lg">
        <div className="md:flex-row h-full md:h-[320px] mt-[15px] items-center p-4">
          <div className="w-full flex justify-center md:justify-start items-center md:items-start p-4">
            <Image src="/logo/HBA_NoBack_NoWords.png" alt="Logo" width={100} height={100} />
          </div>

          <div className="flex flex-col justify-center items-center w-full h-[60%]">
            <Image src="/icons/Requests/Request Approved.png" alt="Checkmark" width={60} height={60} />
            <strong className="text-[18px] text-center">{t("submissionTitle")}</strong>
            <h5>{t("submissionSubtitle")}</h5>

            <div className="bg-[#3F5EBB] text-white p-4 rounded-lg mt-4">
              <ol className="list-decimal list-inside space-y-2 text-left text-[14px]">
                <li>{t("submissionSteps0")}</li>
                <li>{t("submissionSteps1")}</li>
                <li>{t("submissionSteps2")}</li>
              </ol>
            </div>

            {onFinalAction && (
              <Button className="mt-6 bg-[#405BA9] text-white rounded-3xl" type="button" onClick={onFinalAction}>
                {finalButtonLabel}
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

export default Step6_Submission;
