"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "../shadcnComponents/card";
import { useTranslations } from "next-intl";

interface ChangeRequestConfirmationProps {
  onClose?: () => void;
  onBackToHome?: () => void;
}

const ChangeRequestConfirmation: React.FC<ChangeRequestConfirmationProps> = ({ onClose, onBackToHome }) => {
  const t = useTranslations();

  return (
    <article className="fixed inset-x-0 top-0 bottom-[92px] z-[60] h-[calc(103vh-92px)] bg-white overflow-y-auto sm:rounded-lg w-full max-w-full md:fixed md:inset-0 md:m-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:h-auto md:max-h-[90vh] md:mx-auto md:w-[805px] md:overflow-visible border border-gray-200 flex flex-col">
      <div className="flex flex-col p-5 py-6 w-full">
        <header className="flex justify-end">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 focus:outline-none" aria-label="Close">
            <Image src="/icons/General_Icons/Close.png" alt="Close" width={30} height={30} className="object-contain" />
          </button>
        </header>

        <hr className="shrink-0 mt-10 h-px border border-solid border-[#BEBEBE] w-full" />

        <main className="flex flex-col items-center">
          <h1 className="mt-20 text-4xl font-futura font-medium text-center text-black max-md:mt-10">
            {t("changeReceived")}
            <br />
            {t("nowPending")}
          </h1>

          <p className="mt-7 text-xl text-[#293241] w-full max-w-[620px] text-left px-4">{t("requestMessage")}</p>
        </main>

        <hr className="shrink-0 mt-24 h-px border border-solid border-[#BEBEBE] w-full max-md:mt-10" />

        <footer className="flex justify-end mt-6">
          <button
            onClick={onBackToHome}
            className="w-[154px] h-[41px] bg-[#405BA9] text-white rounded-[23px] font-futura font-medium text-[16px] leading-[21.25px] hover:bg-[#293241] transition-colors"
          >
            {t("backHome")}
          </button>
        </footer>
      </div>
    </article>
  );
};

export default ChangeRequestConfirmation;
