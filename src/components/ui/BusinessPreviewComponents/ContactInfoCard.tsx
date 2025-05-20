"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "../shadcnComponents/card";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface ContactInfo {
  name: string;
  phoneNumber: string;
  email: string;
  socialMediaHandles?: {
    IG?: string;
    twitter?: string;
    FB?: string;
  };
}

interface ContactInfoCardProps {
  info?: ContactInfo;
  editable?: boolean;
  onEditClick?: () => void;
}

const ContactInfoCard = ({ info, editable = false, onEditClick }: ContactInfoCardProps) => {
  const router = useRouter();
  const t = useTranslations();

  const contactInfo = info ?? {
    name: "Selena Lilies",
    phoneNumber: "(408) 772-8521",
    email: "lilieschair@hotmail.com",
    socialMediaHandles: {
      FB: "https://www.facebook.com/halohairandnailstudio",
    },
  };

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
              {t("contactInfo")}
            </h2>
            {editable && (
              <button
                onClick={handleEditClick}
                className="p-2 rounded-full hover:bg-[#f0f0f0] transition-colors absolute top-5 right-6"
                aria-label="Edit contact information"
              >
                <Image src="/icons/BusinessPreviewAndEdit/Edit.png" alt="Edit" width={20} height={20} />
              </button>
            )}
          </div>
          <div className="h-[1px] bg-[#BEBEBE] mt-4 mb-6 w-full" />
        </div>
      </CardHeader>
      <CardContent className="px-[32px] pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-[21px]">
            <InfoBlock label={t("pointOfContact")} value={contactInfo.name} />
            <InfoBlock label={t("phoneNumber")} value={contactInfo.phoneNumber} />
          </div>
          <div className="space-y-[23px]">
            <InfoBlock label={t("email")} value={contactInfo.email} />
            <InfoBlock
              label={t("socialMedia")}
              value={
                contactInfo.socialMediaHandles?.FB ||
                contactInfo.socialMediaHandles?.IG ||
                contactInfo.socialMediaHandles?.twitter ||
                "—"
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InfoBlock = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">{label}</p>
    <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">{value || "—"}</p>
  </div>
);

export default ContactInfoCard;
