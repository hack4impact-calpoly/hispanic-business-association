import Image from "next/image";
import { Button } from "../button";

interface LanguageSelectorProps {
  langOptions: string[];
  langOption: number;
  changeLanguage: (lang: number) => void;
}

const LanguageSelector = ({ langOptions, langOption, changeLanguage }: LanguageSelectorProps) => {
  return (
    <div>
      <Button className="bg-[#293241] text-white hover:text-blue-500 hover:bg-[#293241]" type="button">
        {langOptions[langOption]}
        <Image src="/icons/Sort Down.png" alt="DropDownArrow" width={15} height={15} />
      </Button>
      <div className="absolute bg-white border rounded mt-1 shadow-lg z-10">
        {langOptions.map((label, index) => (
          <div key={label} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => changeLanguage(index)}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
