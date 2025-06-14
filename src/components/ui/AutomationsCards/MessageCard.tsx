"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardHeader } from "../shadcnComponents/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface MessageCardInfo {
  _id: string;
  title: string;
  description: string;
  date: Date | string | number;
}

interface MessageCardProps {
  message: MessageCardInfo;
}

const MessageCard = ({ message }: MessageCardProps) => {
  const formattedDate = message.date ? format(new Date(message.date), "MM/dd/yyyy") : "N/A";
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/admin/automations/preview/${message._id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className={`w-full bg-white rounded-xl border border-black cursor-pointer hover:bg-gray-100 ${
        isMobile ? "px-4 py-3 text-[14px]" : "px-4 py-3 text-[20px]"
      }`}
    >
      <CardHeader className="flex">
        <div className="flex items-center gap-2 w-full">
          <p className="font-bold">{message.title}</p>
          <p>{message.description}</p>
          <p className="ml-auto">{formattedDate}</p>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
