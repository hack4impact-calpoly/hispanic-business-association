"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "./card";

interface ChangeRequestConfirmationProps {
  onClose?: () => void;
  onBackToHome?: () => void;
}

const ChangeRequestConfirmation: React.FC<ChangeRequestConfirmationProps> = ({ onClose, onBackToHome }) => {
  return (
    <Card className="w-full max-w-[805px] rounded-lg shadow-sm">
      <CardContent className="flex flex-col p-5 py-6 w-full">
        <header className="flex justify-end">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 focus:outline-none" aria-label="Close">
            <Image src="/icons/Close.png" alt="Close" width={30} height={30} className="object-contain" />
          </button>
        </header>

        <hr className="shrink-0 mt-10 h-px border border-solid border-[#BEBEBE] w-full" />

        <main className="flex flex-col items-center">
          <h1 className="mt-20 text-4xl font-futura font-medium text-center text-black max-md:mt-10">
            Your change has been received <br />
            and is now pending
          </h1>

          <p className="mt-7 text-xl text-[#293241] w-[620px] max-md:max-w-full text-left">
            A HBA admin will approve or deny your change request within the next 30 days. If your request is approved,
            you will see the changes automatically made on your dashboard. If your request was rejected, a HBA admin
            will let you know why and your information will stay the same until a new change request is made and
            approved.
          </p>
        </main>

        <hr className="shrink-0 mt-24 h-px border border-solid border-[#BEBEBE] w-full max-md:mt-10" />

        <footer className="flex justify-end mt-6">
          <button
            onClick={onBackToHome}
            className="w-[154px] h-[41px] bg-[#405BA9] text-white rounded-[23px] font-futura font-medium text-[16px] leading-[21.25px] hover:bg-[#293241] transition-colors"
          >
            Back to Home
          </button>
        </footer>
      </CardContent>
    </Card>
  );
};

export default ChangeRequestConfirmation;
