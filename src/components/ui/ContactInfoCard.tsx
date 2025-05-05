"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "./card";
import { useRouter } from "next/navigation";

// Contact info data structure
interface ContactInfo {
  pointOfContact: string;
  phone: string;
  email: string;
  socialMedia: string;
}

interface ContactInfoCardProps {
  info?: ContactInfo;
  editable?: boolean;
  onEditClick?: () => void;
}

const ContactInfoCard = ({ info, editable = false, onEditClick }: ContactInfoCardProps) => {
  const router = useRouter();

  // Default contact info - replaced with prop data when available
  const contactInfo = info ?? {
    pointOfContact: "Selena Lilies",
    phone: "(408) 772-8521",
    email: "lilieschair@hotmail.com",
    socialMedia: "https://www.facebook.com/halohairandnailstudio",
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
      <CardHeader className="relative w-full px-[20px] pt-[19px] pb-0">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-[16px] font-bold text-[#293241] font-['Futura'] leading-[21.26px] truncate">
              Contact Information
            </h2>
            {/* Edit button - conditionally rendered based on editable prop */}
            {editable && (
              <button
                onClick={handleEditClick}
                className="p-2 rounded-full hover:bg-[#f0f0f0] transition-colors absolute top-5 right-6"
                aria-label="Edit contact information"
              >
                <Image src="/icons/Edit.png" alt="Edit" width={20} height={20} />
              </button>
            )}
          </div>
          <div className="h-[1px] bg-[#BEBEBE] mt-4 mb-6 w-full" />
        </div>
      </CardHeader>
      <CardContent className="px-[32px] pt-0">
        {/* Grid ensures consistent column widths across screen sizes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-[21px]">
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Point of Contact</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                {contactInfo.pointOfContact}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Phone Number</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                {contactInfo.phone}
              </p>
            </div>
          </div>
          <div className="space-y-[23px]">
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Email</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                {contactInfo.email}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">Social Media</p>
              <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
                {contactInfo.socialMedia}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
