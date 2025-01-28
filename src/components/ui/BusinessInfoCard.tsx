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
}

const BusinessInfoCard = ({ info }: BusinessInfoCardProps) => {
  const router = useRouter();

  const businessInfo = info ?? {
    name: "HALO Hair Studio",
    type: "Beauty & Personal Care",
    owner: "Selena Lilies",
    website: "https://halohairpasorobles.com/",
    address: {
      street: "1413 Riverside Ave.",
      suite: "Suite G",
      city: "Paso Robles",
      state: "CA",
      zip: "93446",
    },
  };

  return (
    <Card className="relative w-[544px] h-[292px] border border-[#8C8C8C] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
      <CardHeader className="relative w-full px-[21px] pt-[19px] pb-0">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="w-[298.72px] h-[21px] text-[16px] font-bold text-[#293241] font-['Futura'] leading-[21.26px] truncate">
              BUSINESS INFORMATION
            </h2>
            <button onClick={() => router.push("/dashboard-edit-about")} className="absolute top-5 right-6">
              <Image src="/icons/Edit.png" alt="Edit" width={20} height={20} />
            </button>
          </div>
          <div className="h-[1px] bg-[#BEBEBE] mt-4 mb-6 w-[503px]" />
        </div>
      </CardHeader>
      <CardContent className="px-[27.38px] pt-0">
        <div className="flex justify-between">
          <div className="space-y-[26px]">
            <div>
              <p className="w-[134.29px] h-[16px] text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px] truncate">
                Business Name
              </p>
              <p className="w-[182.25px] h-[19px] text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] truncate">
                {businessInfo.name}
              </p>
            </div>
            <div>
              <p className="w-[123.32px] h-[16px] text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px] truncate">
                Business Type
              </p>
              <p className="w-[246.65px] h-[19px] text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] truncate">
                {businessInfo.type}
              </p>
            </div>
            <div>
              <p className="w-[61.66px] h-[16px] text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px] truncate">
                Owner
              </p>
              <p className="w-[126.07px] h-[19px] text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] truncate">
                {businessInfo.owner}
              </p>
            </div>
          </div>
          <div className="space-y-[26px]">
            <div>
              <p className="w-[72.62px] h-[16px] text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px] truncate">
                Website
              </p>
              <p className="w-[238.43px] h-[38px] text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                {businessInfo.website}
              </p>
            </div>
            <div>
              <p className="w-[72.62px] h-[16px] text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px] truncate">
                Address
              </p>
              <p className="w-[238.43px] h-[57px] text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] overflow-hidden">
                {businessInfo.address.street}
                <br />
                {businessInfo.address.suite}
                <br />
                {businessInfo.address.city}, {businessInfo.address.state} {businessInfo.address.zip}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessInfoCard;
