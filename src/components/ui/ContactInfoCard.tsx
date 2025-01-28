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
}

const ContactInfoCard = ({ info }: ContactInfoCardProps) => {
  const router = useRouter();

  const contactInfo = info ?? {
    pointOfContact: "Selena Lilies",
    phone: "(408) 772-8521",
    email: "lilieschair@hotmail.com",
    socialMedia: "https://www.facebook.com/halohairandnailstudio",
  };

  return (
    <Card className="relative w-[544px] h-[292px] border border-[#8C8C8C] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
      <CardHeader className="relative w-full px-[20px] pt-[19px] pb-0">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="w-[298.72px] h-[21px] text-[16px] font-bold text-[#293241] font-['Futura'] leading-[21.26px] truncate">
              Contact Information
            </h2>
            <button onClick={() => router.push("/dashboard-edit-about")} className="absolute top-5 right-6">
              <Image src="/icons/Edit.png" alt="Edit" width={20} height={20} />
            </button>
          </div>
          <div className="h-[1px] bg-[#BEBEBE] mt-4 mb-6 w-[504px]" />
        </div>
      </CardHeader>
      <CardContent className="px-[32px] pt-0">
        <div className="flex">
          <div className="space-y-[21px] min-w-[250px]">
            <div>
              <p className="w-[116px] h-[16px] text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px] truncate">
                Point of Contact
              </p>
              <p className="w-[126.07px] h-[19px] text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] truncate">
                {contactInfo.pointOfContact}
              </p>
            </div>
            <div>
              <p className="w-[116px] h-[16px] text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px] truncate">
                Phone Number
              </p>
              <p className="w-[126.07px] h-[19px] text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] truncate">
                {contactInfo.phone}
              </p>
            </div>
          </div>
          <div className="space-y-[23px]">
            <div>
              <p className="w-[180.35px] h-[16px] text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px] truncate">
                Email
              </p>
              <p className="w-[196px] h-[19px] text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] truncate">
                {contactInfo.email}
              </p>
            </div>
            <div>
              <p className="w-[180.35px] h-[16px] text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px] truncate">
                Social Media
              </p>
              <p className="w-[196px] h-[57px] text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
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
