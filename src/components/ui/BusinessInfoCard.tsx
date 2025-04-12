"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "./card";
import { useRouter } from "next/navigation";

// Business details data structure
interface BusinessInfo {
  name: string;
  type: string;
  owner: string;
  website: string;
  address: {
    formatted?: string;
    street: string;
    suite?: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface BusinessInfoCardProps {
  info?: BusinessInfo;
  editable?: boolean;
  onEditClick?: () => void;
}

const BusinessInfoCard = ({ info, editable = false, onEditClick }: BusinessInfoCardProps) => {
  const router = useRouter();

  // Default business info - replaced with prop data when available
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

  // Handle edit button click
  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick();
    } else {
      router.push("/business/update");
    }
  };

  return (
    <Card className="w-full h-full border border-[#8C8C8C] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
      <CardHeader className="relative w-full px-[21px] pt-[19px] pb-0">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-[16px] font-bold text-[#293241] font-['Futura'] leading-[21.26px] truncate">
              BUSINESS INFORMATION
            </h2>
            {/* Edit button - conditionally rendered based on editable prop */}
            {editable && (
              <button
                onClick={handleEditClick}
                className="absolute top-5 right-6"
                aria-label="Edit business information"
              >
                <Image src="/icons/Edit.png" alt="Edit" width={20} height={20} />
              </button>
            )}
          </div>
          <div className="h-[1px] bg-[#BEBEBE] mt-4 mb-6 w-full" />
        </div>
      </CardHeader>
      <CardContent className="px-[21px] pt-0">
        {/* Grid structure ensures equal column widths on all screen sizes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-[26px]">
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Business Name</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                {businessInfo.name}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Business Type</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                {businessInfo.type}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Owner</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                {businessInfo.owner}
              </p>
            </div>
          </div>
          <div className="space-y-[26px]">
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Website</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                {businessInfo.website}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Address</p>
              {/* Address with natural line breaks */}
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                {businessInfo.address.street}
                <br />
                {businessInfo.address.suite && (
                  <>
                    {businessInfo.address.suite}
                    <br />
                  </>
                )}
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
