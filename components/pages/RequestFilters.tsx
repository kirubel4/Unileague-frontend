// components/lineup-request/RequestFilters.tsx

import { LineupReq } from "@/app/(private)/coach/lineupHistory/type";

interface RequestFiltersProps {
  activeFilter: LineupReq | "ALL";
  onFilterChange: (filter: LineupReq | "ALL") => void;
}

export function RequestFilters({
  activeFilter,
  onFilterChange,
}: RequestFiltersProps) {
  const filters = [
    { value: "ALL", label: "All Requests", count: 0 },
    { value: LineupReq.WAITING, label: "Waiting", count: 0 },
    { value: LineupReq.REQUESTED, label: "Requested", count: 0 },
    { value: LineupReq.APPROVED, label: "Approved", count: 0 },
    { value: LineupReq.REJECTED, label: "Rejected", count: 0 },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value as any)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === filter.value
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {filter.label}
          {filter.count > 0 && (
            <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
              {filter.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
