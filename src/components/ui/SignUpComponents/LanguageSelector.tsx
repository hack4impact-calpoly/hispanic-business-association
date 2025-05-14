import Image from "next/image";
import { Button } from "../button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../dropdown-menu"; // adjust path if needed

interface LanguageSelectorProps {
  langOptions: string[];
  langOption: number;
  changeLanguage: (lang: number) => void;
}

const LanguageSelector = ({ langOptions, langOption, changeLanguage }: LanguageSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#293241] text-white hover:text-blue-500 hover:bg-[#293241]" type="button">
          {langOptions[langOption]}
          <Image src="/icons/Sort Down.png" alt="DropDownArrow" width={15} height={15} className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {langOptions.map((label, index) => (
          <DropdownMenuItem key={label} onClick={() => changeLanguage(index)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
