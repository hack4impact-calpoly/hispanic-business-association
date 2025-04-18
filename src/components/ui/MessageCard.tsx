"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardHeader, CardContent } from "./card";
import { format } from "date-fns";

// Interface for the message card content structure
interface MessageCardInfo {
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

  if (isMobile) {
    return (
      <Card className="w-full bg-white rounded-xl border border-black">
        <CardHeader className="px-4 py-3 flex">
          <div className="flex items-center font-futura gap-2 text-[14px]">
            <p className="font-bold">{message.title}</p>
            <p>{message.description}</p>
            <p className="ml-auto">{formattedDate}</p>
          </div>
        </CardHeader>
      </Card>
    );
  } else {
    return (
      <Card className="w-full bg-white rounded-xl border border-black">
        <CardHeader className="px-4 py-3 flex">
          <div className="flex items-center font-futura gap-2 text-[20px]">
            {" "}
            {/* Container for title and description */}
            <p className="font-bold">{message.title}</p>
            <p>{message.description}</p>
            <p className="ml-auto">{formattedDate}</p>
          </div>
        </CardHeader>
      </Card>
    );
  }
};

export default MessageCard;
