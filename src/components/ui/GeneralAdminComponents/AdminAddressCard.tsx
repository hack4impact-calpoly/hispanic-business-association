"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "../shadcnComponents/card";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IAdminMailingAddress } from "@/database/adminAddressSchema";
import { IAddress } from "@/database/types";
import { useState, useEffect } from "react";
import EditAdminAddress from "../EditBusinessInfoComponents/EditAdminAddress";

interface AdminAddressCardProps {
  info?: IAdminMailingAddress;
  editable?: boolean;
  onEditClick?: () => void;
}

const AdminAddressCard = ({ info, editable = false, onEditClick }: AdminAddressCardProps) => {
  const addressInfo = info ?? {
    address: { street: "1413 Riverside Ave.", city: "Paso Robles", state: "CA", zip: 93446 },
  };

  const router = useRouter();
  const t = useTranslations();
  const [showEditAdminAddress, setShowEditAdminAddress] = useState(false);
  const handleEditClick = () => {
    setShowEditAdminAddress(true);
  };
  const handleEditClose = () => {
    setShowEditAdminAddress(false);
  };
  const handleEditSubmit = () => {
    setShowEditAdminAddress(false);
  };

  return (
    <Card className="w-full h-full border border-[#8C8C8C] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
      <CardHeader className="relative w-full px-[21px] pt-[19px] pb-0">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-[16px] font-bold text-[#293241] font-['Futura'] leading-[21.26px] truncate">
              {t("Mailing Address Information")}
            </h2>
            <button
              onClick={handleEditClick}
              className="absolute top-4 right-4 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all"
              aria-label="Edit banner and logo"
            >
              <Image src="/icons/BusinessPreviewAndEdit/Edit.png" alt="Edit" width={16} height={16} />
            </button>
          </div>
          <div className="h-[1px] bg-[#BEBEBE] mt-4 mb-6 w-full" />
        </div>
      </CardHeader>
      {showEditAdminAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <EditAdminAddress onClose={handleEditClose} onSubmitSuccess={handleEditSubmit} />
        </div>
      )}
      <CardContent className="px-[21px] pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-[26px]">
            <div>
              <AddressBlock {...addressInfo.address} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AddressBlock = ({ street, city, state, zip }: IAddress) => (
  <p className="text-[14px] font-bold text-[#405BA9] font-['Futura'] leading-[18.61px] break-words">
    {street}
    <br />
    {city}, {state} {zip}
  </p>
);

export default AdminAddressCard;
