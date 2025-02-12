"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "./card";

const RequestApprovedCard = () => {
  const [isOpen, setIsOpen] = useState(true);

  return isOpen ? (
    <div className="fixed top-[251px] left-[47px] w-[305px] h-[305px] bg-white shadow-lg rounded-2xl z-50 ">
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
      >
        <Image src="/icons/Close.png" alt="Close Button" width={15} height={20} />
      </button>
      <Card className="w-full h-full bg-[#D9D9D9] shadow-lg rounded-2xl">
        <CardContent className="relative top-[72px] flex flex-col items-center">
          <Image src="/icons/Request Approved.png" alt="Request Approved Icon" width={102} height={102}></Image>
          <p className="relative top-[19px] text-[22px]">Changes Approved!</p>
        </CardContent>
      </Card>
    </div>
  ) : null;
};

export default RequestApprovedCard;
