import Image from "next/image";
import { Button } from "../shadcnComponents/button";
import { useContext } from "react";
import { LocaleContext } from "@/app/Providers";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../shadcnComponents/dropdown-menu"; // adjust path if needed

const LanguageSelector = () => {
  const { locale, setLocale } = useContext(LocaleContext);
  const handleSwitch = (newLocale: string) => {
    if (newLocale === locale) return;
    setLocale(newLocale);
  };
  function getButtonTitle(locale: string) {
    if (locale == "es") {
      return "Español";
    }
    return "English (United States)";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="bg-[#293241] text-white hover:text-blue-500 hover:bg-[#293241] hover:opacity-100 hover:shadow-none"
          type="button"
        >
          {getButtonTitle(locale)}
          <Image src="/icons/Sort Down.png" alt="DropDownArrow" width={15} height={15} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleSwitch("en")}>English (United States)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSwitch("es")}>Español</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
