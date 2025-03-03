"use client";

import * as React from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-[81px] h-[32px] flex items-center gap-[5px] cursor-pointer">
          <span className="font-futura font-medium text-[24px] leading-[32px] text-black">Filter</span>
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
            {filter}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterButton;
