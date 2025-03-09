"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "./card";
import { useRouter } from "next/navigation";

interface ContactInfo {
  pointOfContact: string;
  phone: string;
  email: string;
  socialMedia: string;
}

interface ContactInfoCardProps {
  info?: ContactInfo;
  className?: string;
}

const ContactInfoCard = ({ info, className = "" }: ContactInfoCardProps) => {
  const router = useRouter();

  return (
    <Card
      className={`relative w-full md:w-[544px] h-[292px] border border-[#8C8C8C] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden ${className}`}
    >
      <CardHeader className="relative w-full px-[20px] pt-[19px] pb-0">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="w-[298.72px] h-[21px] text-[16px] font-bold text-[#293241] font-['Futura'] leading-[21.26px] truncate">
              Contact Information
            </h2>
            <button onClick={() => router.push("/business/edit")} className="absolute top-5 right-6">
              <Image src="/icons/Edit.png" alt="Edit" width={20} height={20} />
            </button>
          </div>
          <div className="h-[1px] bg-[#BEBEBE] mt-4 mb-6 w-full max-w-[504px]" />
        </div>
      </CardHeader>
      <CardContent className="px-[32px] pt-0 pb-[31px]">
        <div className="grid grid-cols-2 gap-x-4">
          <div className="space-y-[21px]">
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Point of Contact</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words pr-2">
                {info?.pointOfContact || <span className="text-gray-400 italic">Not provided</span>}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Phone Number</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words pr-2">
                {info?.phone || <span className="text-gray-400 italic">Not provided</span>}
              </p>
            </div>
          </div>
          <div className="space-y-[23px]">
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Email</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                {info?.email || <span className="text-gray-400 italic">Not provided</span>}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Social Media</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                {info?.socialMedia || <span className="text-gray-400 italic">Not provided</span>}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
