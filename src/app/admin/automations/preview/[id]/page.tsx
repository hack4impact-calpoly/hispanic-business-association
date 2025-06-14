"use client";

import { useParams } from "next/navigation";
import { useSentMessages } from "@/hooks/swrHooks";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/shadcnComponents/button";
import { useRouter } from "next/navigation";

export default function MessagePreviewPage() {
  const t = useTranslations();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { id } = useParams();
  const { sentMessages, isLoading } = useSentMessages();

  const message = sentMessages?.find((msg) => msg._id === id);

  if (isLoading || !message) {
    return (
      <ResponsiveLayout title={t("messages")}>
        <div className="p-4 text-center">{t("loading") || "Loading message preview..."}</div>
      </ResponsiveLayout>
    );
  }

  const { subject, body, attachments, recipient, createdAt } = message;
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <ResponsiveLayout title={t("messages")}>
      <div className={`container ${isMobile ? "max-w-2xl px-1" : "max-w-4xl p-4"}`}>
        <Button
          onClick={() => router.push("/admin/automations")}
          className="flex items-center gap-2 bg-transparent text-[#405BA9] hover:bg-gray-100 mb-4"
        >
          <span className="text-xl">←</span> {t("backToAuto")}
        </Button>
        <h2 className="font-[500] text-2xl md:text-[26px] mb-6">{t("msgPreview")}</h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[20px]">{t("msgSubject")}</label>
            <div className="mt-2 border-2 border-black px-3 py-2 rounded-md text-lg">{subject}</div>
          </div>

          <div>
            <label className="block text-[20px] py-2">{t("msgRecipient")}</label>
            <div className="mt-2 border-2 border-black px-3 py-2 rounded-md text-md">
              {recipient?.directlyTo || recipient?.businessType || "-"}
            </div>
          </div>

          <div>
            <label className="block text-[20px] py-2">{t("msgAttachments")}</label>
            <ul className="border-2 border-black px-3 py-2 rounded-md space-y-1">
              {attachments && attachments.length > 0 ? (
                attachments.map((file, index) => <li key={index}>📎 {file}</li>)
              ) : (
                <li>-</li>
              )}
            </ul>
          </div>

          <div>
            <label className="block text-[20px] py-2">{t("msgBody")}</label>
            <div
              className="border-2 border-black px-3 py-2 rounded-md whitespace-pre-wrap break-words w-full"
              style={{ wordBreak: "break-word" }}
            >
              {body || "-"}
            </div>
          </div>

          <p className="text-sm text-gray-500 text-right mt-2">
            {t("msgSentOn")}: {formattedDate}
          </p>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
