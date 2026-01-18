// components/lineup-request/RequestCard.tsx

import { StatusBadge } from "./StatusBadge";
import { Calendar, User, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import {
  LineupReq,
  LineupRequest,
} from "@/app/(private)/coach/lineupHistory/type";

interface RequestCardProps {
  request: LineupRequest;
}

export function RequestCard({ request }: RequestCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header with Match Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <span className="font-semibold text-gray-900">
                {request.match.homeTeam.teamName}
              </span>
              <span className="mx-2 text-gray-400">vs</span>
              <span className="font-semibold text-gray-900">
                {request.match.awayTeam.teamName}
              </span>
            </div>
          </div>
        </div>
        <StatusBadge status={request.state} />
      </div>

      {/* Match Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{format(request.match.date, "MMM dd, yyyy")}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{format(request.match.date, "hh:mm a")}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{request.match.venue}</span>
        </div>
      </div>

      {/* Request Timeline */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Submitted</p>
            <p className="font-medium">
              {request.submittedAt
                ? format(request.submittedAt, "MMM dd, yyyy • hh:mm a")
                : "Not submitted"}
            </p>
          </div>

          {request.state === LineupReq.APPROVED && request.approvedBy && (
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center">
                <User className="w-3 h-3 mr-1" />
                Approved By
              </p>
              <p className="font-medium">
                {request.approvedBy.username}
                {request.approvedAt && (
                  <span className="text-sm text-gray-500 ml-2">
                    • {format(request.approvedAt, "MMM dd")}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
