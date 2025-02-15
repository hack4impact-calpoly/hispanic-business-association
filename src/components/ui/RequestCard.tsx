"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BaseRequestProps {
  businessName: string;
  className?: string;
}

interface PendingRequest extends BaseRequestProps {
  type: "pending";
  timeAgo: string;
  isUrgent?: boolean;
}

interface HistoryRequest extends BaseRequestProps {
  type: "history";
  status: "approved" | "denied";
  date: string;
}

type RequestCardProps = PendingRequest | HistoryRequest;

export const RequestCard = (props: RequestCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (props.type === "pending") {
      router.push("/admin/requests");
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "w-[591px] h-[67px] rounded-[15px] border border-black",
        "px-4 py-5 cursor-pointer",
        props.className,
      )}
    >
      <div className="flex justify-between items-center">
        <span className="font-futura font-bold text-[19px] leading-[25px]">{props.businessName}</span>

        {props.type === "pending" ? (
          <div className="flex items-center gap-2">
            {props.isUrgent && <Image src="/icons/Box Important.png" alt="Important" width={25} height={25} />}
            <span
              className={cn(
                "font-futura text-[20px] leading-[27px]",
                props.isUrgent ? "font-bold text-[#AE0000]" : "font-medium text-black",
              )}
            >
              {props.timeAgo}
            </span>
          </div>
        ) : (
          <span className={cn("font-futura font-medium text-[20px] leading-[27px]")}>
            <span className={props.status === "approved" ? "text-[#00A819]" : "text-[#AE0000]"}>
              {props.status === "approved" ? "Approved" : "Denied"}
            </span>
            <span className="text-black">: {props.date}</span>
          </span>
        )}
      </div>
    </div>
  );
};
