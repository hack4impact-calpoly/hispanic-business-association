"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "./card";
import { useRouter } from "next/navigation";

interface BusinessInfo {
  name: string;
  type: string;
  owner: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface BusinessInfoCardProps {
  info?: BusinessInfo;
  className?: string;
}

const BusinessInfoCard = ({ info, className = "" }: BusinessInfoCardProps) => {
  const router = useRouter();

  return (
    <Card
      className={`relative w-full md:w-[544px] h-[292px] border border-[#8C8C8C] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden ${className}`}
    >
      <CardHeader className="relative w-full px-[21px] pt-[19px] pb-0">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="w-[298.72px] h-[21px] text-[16px] font-bold text-[#293241] font-['Futura'] leading-[21.26px] truncate">
              BUSINESS INFORMATION
            </h2>
            <button onClick={() => router.push("/business/edit")} className="absolute top-5 right-6">
              <Image src="/icons/Edit.png" alt="Edit" width={20} height={20} />
            </button>
          </div>
          <div className="h-[1px] bg-[#BEBEBE] mt-4 mb-6 w-full max-w-[503px]" />
        </div>
      </CardHeader>
      <CardContent className="px-[27.38px] pt-0 pb-[31px]">
        <div className="grid grid-cols-2 gap-x-4">
          <div className="space-y-[26px]">
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Business Name</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words pr-2">
                {info?.name || <span className="text-gray-400 italic">Not provided</span>}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Business Type</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words pr-2">
                {info?.type || <span className="text-gray-400 italic">Not provided</span>}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Owner</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words pr-2">
                {info?.owner || <span className="text-gray-400 italic">Not provided</span>}
              </p>
            </div>
          </div>
          <div className="space-y-[26px]">
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Website</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                {info?.website || <span className="text-gray-400 italic">Not provided</span>}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Address</p>
              {info?.address ? (
                <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                  {info.address.street}
                  {info.address.suite && <br />}
                  {info.address.suite}
                  <br />
                  {info.address.city}, {info.address.state} {info.address.zip}
                </p>
              ) : (
                <p className="text-[14px] font-bold text-gray-400 italic font-['Futura'] leading-[18.61px]">
                  Address not available
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessInfoCard;
