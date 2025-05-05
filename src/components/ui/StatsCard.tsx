"use client";

import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  count: number;
  isHighlighted?: boolean;
}

const StatsCard = ({ title, count, isHighlighted = false }: StatsCardProps) => {
  return (
    <div
      className={cn(
        "w-full sm:w-full md:w-[350px] lg:w-[416px] h-[67px] rounded-[15px] border border-black cursor-pointer",
        isHighlighted && "bg-[#C26868]/35",
      )}
    >
      <div className="flex justify-between items-center h-full px-4">
        <span className="font-futura font-medium text-[16px] sm:text-[19px] leading-[25px] text-black truncate mr-2">
          {title}
        </span>
        <span
          className={cn(
            "font-futura font-medium text-[18px] sm:text-[20px] leading-[27px] whitespace-nowrap",
            isHighlighted ? "text-[#AE0000]" : "text-[#404040]",
          )}
        >
          {count}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;
