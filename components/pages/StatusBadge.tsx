// components/lineup-request/StatusBadge.tsx

import { LineupReq } from "@/app/(private)/coach/lineupHistory/type";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: LineupReq;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    [LineupReq.WAITING]: {
      label: "Waiting",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    [LineupReq.REQUESTED]: {
      label: "Requested",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    [LineupReq.APPROVED]: {
      label: "Approved",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    [LineupReq.REJECTED]: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
