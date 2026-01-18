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
  const matchDate = new Date(request.match.scheduledDate);
  const submittedDate = request.submittedAt
    ? new Date(request.submittedAt)
    : null;
  const approvedDate = request.approvedAt ? new Date(request.approvedAt) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-gray-900">
          {request.match.homeTeam.teamName}
          <span className="mx-2 text-gray-400">vs</span>
          {request.match.awayTeam.teamName}
        </div>
        <StatusBadge status={request.state} />
      </div>

      {/* Match Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {isNaN(matchDate.getTime())
              ? "--:--"
              : format(matchDate, "hh:mm a")}
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            {isNaN(matchDate.getTime())
              ? "--:--"
              : format(matchDate, "hh:mm a")}
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{request.match.venue}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Submitted</p>
          <p className="font-medium">
            {submittedDate && !isNaN(submittedDate.getTime())
              ? format(submittedDate, "MMM dd, yyyy • hh:mm a")
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
              {approvedDate && !isNaN(approvedDate.getTime()) && (
                <span className="text-sm text-gray-500 ml-2">
                  • {format(approvedDate, "MMM dd, yyyy • hh:mm a")}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
