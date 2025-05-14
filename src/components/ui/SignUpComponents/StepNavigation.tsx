import { Button } from "../button";

interface StepNavigationProps {
  langOption: number;
  navTitles: string[][];
  navSubmit: string[];
  showBack?: boolean;
  showSubmit?: boolean;
  onBack: () => void;
  onNext: () => void;
}

const StepNavigation = ({
  langOption,
  navTitles,
  navSubmit,
  showBack = true,
  showSubmit = false,
  onBack,
  onNext,
}: StepNavigationProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-row items-end justify-between">
      {showBack && (
        <Button
          variant="outline"
          className="
            text-[#405BA9] border-[#405BA9] rounded-3xl
            focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none
            hover:bg-gray-100
          "
          type="button"
          onClick={onBack}
        >
          {navTitles[langOption][0]}
        </Button>
      )}

      <Button className="bg-[#405BA9] rounded-3xl" type="button" onClick={onNext}>
        {showSubmit ? navSubmit[langOption] : navTitles[langOption][1]}
      </Button>
    </div>
  );
};

export default StepNavigation;
