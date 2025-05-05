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
        "w-full rounded-[10px] sm:rounded-[15px] border border-black",
        "px-3 sm:px-4 py-4 sm:py-5 cursor-pointer",
        props.className,
      )}
    >
      <div className="flex justify-between items-center w-full">
        <span className="font-futura font-bold text-[16px] sm:text-[19px] leading-[20px] sm:leading-[25px] truncate mr-2 min-w-0 flex-1">
          {props.businessName}
        </span>

        {props.type === "pending" ? (
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {props.isUrgent && <Image src="/icons/Box Important.png" alt="Important" width={20} height={20} />}
            <span
              className={cn(
                "font-futura text-sm sm:text-[20px] leading-tight sm:leading-[27px] whitespace-nowrap",
                props.isUrgent ? "font-bold text-[#AE0000]" : "font-medium text-black",
              )}
            >
              {props.timeAgo}
            </span>
          </div>
        ) : (
          <span
            className={cn(
              "font-futura font-medium text-sm sm:text-[20px] leading-tight sm:leading-[27px] shrink-0 whitespace-nowrap",
            )}
          >
            <span className={props.status === "approved" ? "text-[#00A819]" : "text-[#AE0000]"}>
              {props.status === "approved" ? "Approved" : "Denied"}
            </span>
            <span className="text-black hidden sm:inline">: {props.date}</span>
          </span>
        )}
      </div>
    </div>
  );
};
