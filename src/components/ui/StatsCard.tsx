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
        "w-[416px] h-[67px] rounded-[15px] border border-black cursor-pointer",
        isHighlighted && "bg-[#C26868]/35",
      )}
    >
      <div className="flex justify-between items-center h-full px-4">
        <span className="font-futura font-medium text-[19px] leading-[25px] text-black">{title}</span>
        <span
          className={cn(
            "font-futura font-medium text-[20px] leading-[27px]",
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
