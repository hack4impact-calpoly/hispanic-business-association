import Image from "next/image";
import { Button } from "../button";
import LanguageSelector from "./LanguageSelector";

interface Step6Props {
  langOption: number;
  submissionTitle: string[];
  submissionSubtitle: string[];
  submissionSteps: string[][];
  langOptions: string[];
  changeLanguage: (lang: number) => void;
  onFinalAction?: () => void;
  finalButtonLabel?: string;
}

const Step6_Submission = ({
  langOption,
  submissionTitle,
  submissionSubtitle,
  submissionSteps,
  langOptions,
  changeLanguage,
  onFinalAction,
  finalButtonLabel = "Return",
}: Step6Props) => {
  return (
    <div className="w-full md:max-w-[70vw] md:h-auto">
      <div className="relative bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] min-h-screen md:min-h-full rounded-none md:rounded-lg">
        <div className="md:flex-row h-full md:h-[320px] mt-[15px] items-center p-4">
          <div className="w-full flex justify-center md:justify-start items-center md:items-start p-4">
            <Image src="/logo/HBA_NoBack_NoWords.png" alt="Logo" width={100} height={100} />
          </div>

          <div className="flex flex-col justify-center items-center w-full h-[60%]">
            <Image src="/icons/Request Approved.png" alt="Checkmark" width={60} height={60} />
            <strong className="text-[18px] text-center">{submissionTitle[langOption]}</strong>
            <h5>{submissionSubtitle[langOption]}</h5>

            <div className="bg-[#3F5EBB] text-white p-4 rounded-lg mt-4">
              <ol className="list-decimal list-inside space-y-2 text-left text-[14px]">
                <li>{submissionSteps[langOption][0]}</li>
                <li>{submissionSteps[langOption][1]}</li>
                <li>{submissionSteps[langOption][2]}</li>
              </ol>
            </div>

            {onFinalAction && (
              <Button className="mt-6 bg-[#405BA9] text-white rounded-3xl" type="button" onClick={onFinalAction}>
                {finalButtonLabel}
              </Button>
            )}
          </div>

          <div className="md:hidden flex mx-auto justify-center mt-5">
            <LanguageSelector langOptions={langOptions} langOption={langOption} changeLanguage={changeLanguage} />
          </div>
        </div>
      </div>

      <div className="hidden md:block md:flex md:flex-row md:justify-start">
        <LanguageSelector langOptions={langOptions} langOption={langOption} changeLanguage={changeLanguage} />
      </div>
    </div>
  );
};

export default Step6_Submission;
