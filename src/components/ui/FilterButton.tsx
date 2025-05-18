"use client";

import * as React from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcnComponents/dropdown-menu";
import { useTranslations } from "next-intl";

interface FilterButtonProps {
  onFilterChange?: (filter: string) => void;
  filters?: string[];
  selectedFilter?: string;
}

const FilterButton = ({
  onFilterChange,
  filters = ["Most Recent", "Oldest", "Business Name A-Z", "Business Name Z-A"],
  selectedFilter,
}: FilterButtonProps) => {
  const t = useTranslations();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-[5px] cursor-pointer w-auto">
          <span className="font-futura font-medium text-[20px] sm:text-[24px] leading-[28px] sm:leading-[32px] text-black">
            {t("filter")}
          </span>
          <Image src="/icons/Sort Down.png" alt="Filter" width={22} height={22} className="mt-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] bg-white">
        {filters.map((filter) => (
          <DropdownMenuItem
            key={filter}
            className={`font-futura text-[16px] ${selectedFilter === filter ? "bg-gray-100" : ""}`}
            onClick={() => onFilterChange?.(filter)}
          >
            {t(filter)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterButton;
