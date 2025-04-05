"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "./card";

// INTERFACE: About card content structure
interface AboutCardInfo {
  description: string;
}

interface AboutCardInfoProps {
  info?: AboutCardInfo;
}

const AboutCard = ({ info }: AboutCardInfoProps) => {
  // MOCK: Default about text - replaced with prop data when available
  const cardContent = info ?? {
    description:
      "Halo is a slice of Heaven when it comes to beauty. We have more then a decade of experience. " +
      "Meet Selina Lilies, Master Stylist/Makeup Artist & Owner of Halo Hair Salon in Paso Robles, CA. " +
      "Halo is a slice of heaven when it comes to beauty. At Halo, our intimate and cozy space is designed " +
      "to be your retreat for a beautiful transformation. Relax, unwind, and leave with a look that's not " +
      "just stylish but uniquely you. Your journey to personal expression begins here!",
  };

  return (
    <Card className="w-full bg-[#6884C226] rounded-xl">
      <CardHeader className="font-futura text-left" style={{ fontWeight: "625", paddingTop: "12px" }}>
        <div className="flex justify-between items-center relative">
          About
          {/* BUTTON: Edit functionality - positioned absolutely within relative parent */}
          <button className="absolute right-2">
            <Image src="/icons/Edit.png" alt="Edit" width={20} height={20} style={{ marginBottom: "5px" }} />
          </button>
        </div>
        <hr className="h-[2px] bg-[#BEBEBE]" style={{ marginTop: "1.5px" }} />
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* TEXT: First line indented with proper line height for readability */}
        <p
          className="text-sm font-medium leading-normal font-serif text-left"
          style={{ textIndent: "1.25rem", paddingBottom: "10px" }}
        >
          {cardContent.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default AboutCard;
