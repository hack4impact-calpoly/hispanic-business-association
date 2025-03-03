"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "./card";

interface AboutCardInfo {
  description: string;
}

interface AboutCardInfoProps {
  info?: AboutCardInfo;
  onEdit?: () => void;
  className?: string;
}

const AboutCard = ({ info, onEdit, className = "" }: AboutCardInfoProps) => {
  return (
    <Card
      className={`relative w-full md:w-[1155px] md:h-[168px] h-auto bg-[#6884C226] rounded-xl overflow-y-auto ${className}`}
    >
      <CardHeader className="font-futura text-left" style={{ fontWeight: "625", paddingTop: "12px" }}>
        <div className="flex justify-between items-center">
          About
          <button className="absolute right-6" onClick={onEdit}>
            <Image src="/icons/Edit.png" alt="Edit" width={20} height={20} style={{ marginBottom: "5px" }} />
          </button>
        </div>
        <hr className="h-[2px] bg-[#BEBEBE]" style={{ marginTop: "1.5px" }} />
      </CardHeader>
      <CardContent className="grid gap-4 pb-[31px]">
        {info?.description ? (
          <p className="text-sm font-medium font-serif text-left" style={{ textIndent: "1.25rem", lineHeight: "1.4" }}>
            {info.description}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic text-center">No business description available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AboutCard;
