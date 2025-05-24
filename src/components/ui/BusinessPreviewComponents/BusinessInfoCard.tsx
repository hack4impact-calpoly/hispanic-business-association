"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "../shadcnComponents/card";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Extended business info structure
interface BusinessInfo {
  name: string;
  type?: string;
  owner: string;
  website?: string;
  organizationType?: string;
  businessScale?: string;
  numberOfEmployees?: string;
  gender?: string;
  physicalAddress: {
    formatted?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  mailingAddress: {
    formatted?: string;
    street: string;
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
  const t = useTranslations();

  const businessInfo = info ?? {
    name: "—",
    type: "—",
    owner: "—",
    website: "—",
    organizationType: "—",
    businessScale: "—",
    numberOfEmployees: "—",
    gender: "—",
    physicalAddress: { street: "—", city: "—", state: "—", zip: "—" },
    mailingAddress: { street: "—", city: "—", state: "—", zip: "—" },
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
      <CardHeader className="relative w-full px-[21px] pt-[19px] pb-0">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-[16px] font-bold text-[#293241] font-['Futura'] leading-[21.26px] truncate">
              {t("businessInformation")}
            </h2>
            {editable && (
              <button
                onClick={handleEditClick}
                className="p-2 rounded-full hover:bg-[#f0f0f0] transition-colors absolute top-5 right-6"
                aria-label="Edit business information"
              >
                <Image src="/icons/BusinessPreviewAndEdit/Edit.png" alt="Edit" width={20} height={20} />
              </button>
            )}
          </div>
          <div className="h-[1px] bg-[#BEBEBE] mt-4 mb-6 w-full" />
        </div>
      </CardHeader>
      <CardContent className="px-[21px] pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-[26px]">
            <InfoBlock label={t("businessName")} value={businessInfo.name} />
            <InfoBlock label={t("businessType")} value={businessInfo.type} />
            <InfoBlock label={t("owner")} value={businessInfo.owner} />
            <InfoBlock label={t("organizationType")} value={businessInfo.organizationType} />
            <InfoBlock label={t("businessScale")} value={businessInfo.businessScale} />
            <InfoBlock label={t("numberOfEmployees")} value={businessInfo.numberOfEmployees} />
            <InfoBlock label={t("gender")} value={businessInfo.gender} />
          </div>
          <div className="space-y-[26px]">
            <InfoBlock label={t("website")} value={businessInfo.website} />
            <div>
              <Label text={t("physAdd")} />
              <AddressBlock address={businessInfo.physicalAddress} />
            </div>
            <div>
              <Label text={t("mailAdd")} />
              <AddressBlock address={businessInfo.mailingAddress} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Label = ({ text }: { text: string }) => (
  <p className="text-[12px] font-bold text-[#8C8C8C] font-['Futura'] leading-[15.95px]">{text}</p>
);

const InfoBlock = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <Label text={label} />
    <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">{value || "—"}</p>
  </div>
);

const AddressBlock = ({ address }: { address: { street: string; city: string; state: string; zip: string } }) => (
  <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
    {address.street}
    <br />
    {address.city}, {address.state} {address.zip}
  </p>
);

export default BusinessInfoCard;
