import { Button } from "../button";
import { useTranslations } from "next-intl";

interface StepNavigationProps {
  showBack?: boolean;
  showSubmit?: boolean;
  onBack: () => void;
  onNext: () => void;
}

const StepNavigation = ({ showBack = true, showSubmit = false, onBack, onNext }: StepNavigationProps) => {
  const t = useTranslations();
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
          {t("back")}
        </Button>
      )}

      <Button className="bg-[#405BA9] rounded-3xl" type="button" onClick={onNext}>
        {showSubmit ? t("submit") : t("next")}
      </Button>
    </div>
  );
};

export default StepNavigation;
