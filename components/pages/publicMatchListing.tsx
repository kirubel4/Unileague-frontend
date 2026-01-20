"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Zap,
  Target,
  ChevronRight,
  Users,
  MapPin,
} from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { mapLiveMatchesToUI } from "@/app/(public)/matches/utility";
import Link from "next/link";

interface Match {
  id: string;
  teamA: {
    name: string;
    logo: string;
    score?: number;
  };
  teamB: {
    name: string;
    logo: string;
    score?: number;
  };
  date: string;
  time: string;
  status: "live" | "upcoming" | "finished";
  tournament: string;
  venue: string;
  round?: string;
  isFeatured?: boolean;
}

interface MatchTabProps {
  activeTab: "live" | "upcoming";
  onTabChange: (tab: "live" | "upcoming") => void;
  liveCount: number;
  upcomingCount: number;
}

interface MatchCardProps {
  match: Match;
}

const MatchTabBar = ({
  activeTab,
  onTabChange,
  liveCount,
  upcomingCount,
}: MatchTabProps) => {
  return (
    <div className="flex space-x-2 mb-8 border-b border-gray-200">
      <button
        onClick={() => onTabChange("live")}
        className={`px-6 py-3 font-medium text-sm md:text-base flex items-center gap-2 rounded-t-lg transition-all ${
          activeTab === "live"
            ? "bg-linear-to-r from-blue-500 to-green-500 text-white shadow-lg transform -translate-y-0.5"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
      >
        <Zap
          className={`w-4 h-4 ${
            activeTab === "live" ? "text-white" : "text-red-500"
          }`}
        />
        Live Matches
        {liveCount > 0 && (
          <span
            className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === "live" ? "bg-white/20" : "bg-red-100 text-red-600"
            }`}
          >
            {liveCount}
          </span>
        )}
      </button>
      <button
        onClick={() => onTabChange("upcoming")}
        className={`px-6 py-3 font-medium text-sm md:text-base flex items-center gap-2 rounded-t-lg transition-all ${
          activeTab === "upcoming"
            ? "bg-linear-to-r from-blue-500 to-green-500 text-white shadow-lg transform -translate-y-0.5"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
      >
        <Calendar
          className={`w-4 h-4 ${
            activeTab === "upcoming" ? "text-white" : "text-blue-500"
          }`}
        />
        Upcoming Matches
        <span
          className={`px-2 py-0.5 text-xs rounded-full ${
            activeTab === "upcoming"
              ? "bg-white/20"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {upcomingCount}
        </span>
      </button>
    </div>
  );
};

export const MatchCard = ({ match }: MatchCardProps) => {
  const isLive = match.status === "live";
  const isUpcoming = match.status === "upcoming";
  const isCompleted = match.status === "finished";

  return (
    <Link
      href={`/matches/${match.id}`}
      className={`bg-white rounded-xl shadow-lg overflow-hidden border transition-all hover:shadow-xl ${
        isLive
          ? "border-l-4 border-l-red-500"
          : isUpcoming
            ? "border-l-4 border-l-blue-500"
            : "border-gray-200"
      }`}
    >
      {/* Status Bar */}
      <div
        className={`px-4 py-2 flex items-center justify-between ${
          isLive || isCompleted
            ? "bg-linear-to-r from-red-50 to-orange-50"
            : isUpcoming
              ? "bg-linear-to-r from-blue-50 to-cyan-50"
              : "bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-2">
          {isLive ? (
            <>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-600">LIVE</span>
              </div>
              <span className="text-sm text-gray-600">• {match.time}</span>
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                {match.date}
              </span>
              <span className="text-sm text-gray-600">• {match.time}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            {match.tournament}
          </span>
          {match.round && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
              {match.round}
            </span>
          )}
        </div>
      </div>

      {/* Match Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-100 to-green-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">
                  {" "}
                  {match?.teamA?.name?.slice(0, 4) +
                    match?.teamA?.name?.slice(8, 12)}
                </h3>
                <p className="text-sm text-gray-600">Home Team</p>
              </div>
              {isLive || match.status === "finished" ? (
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {match.teamA.score}
                  </div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mx-6 text-center">
            <div className="text-lg font-bold text-gray-900">VS</div>
            <div
              className={`text-xs px-3 py-1 rounded-full mt-1 ${
                isLive
                  ? "bg-red-100 text-red-700"
                  : isUpcoming
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {isLive ? "In Progress" : isUpcoming ? "Upcoming" : "Finished"}
            </div>
          </div>

          <div className="flex-1 text-right">
            <div className="flex items-center gap-4 mb-2 justify-end">
              {isLive || match.status === "finished" ? (
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">
                    {match.teamB.score}
                  </div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              ) : null}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">
                  {match?.teamB?.name?.slice(0, 4) +
                    match?.teamB?.name?.slice(8, 12)}
                </h3>
                <p className="text-sm text-gray-600">Away Team</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-green-100 to-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{match.venue}</span>
          </div>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isLive
                ? "bg-linear-to-r from-red-500 to-orange-500 text-white hover:shadow-lg"
                : isUpcoming
                  ? "bg-linear-to-r from-blue-500 to-green-500 text-white hover:shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {isLive && "Watch Live"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLive && (
        <div className="px-4 pb-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-linear-to-r from-red-500 to-orange-500 h-1.5 rounded-full w-3/4 animate-pulse"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>1st Half</span>
            <span>67'</span>
            <span>2nd Half</span>
          </div>
        </div>
      )}
    </Link>
  );
};

const UpcomingMatchesSection = ({ matches }: { matches: Match[] }) => {
  // Group upcoming matches by date
  const groupedMatches = matches.reduce(
    (acc, match) => {
      const date = match.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(match);
      return acc;
    },
    {} as Record<string, Match[]>,
  );

  return (
    <div className="space-y-8">
      {matches.length > 0 ? (
        Object.entries(groupedMatches).map(([date, dateMatches]) => (
          <div key={date} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-linear-to-r from-blue-500 to-green-500 text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{date}</h3>
                <p className="text-sm text-gray-600">
                  {dateMatches.length} matches scheduled
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dateMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-r from-gray-100 to-gray-200 flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Schedule matches
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            There are no scheduled matches at the moment. Check back later or
          </p>
        </div>
      )}
    </div>
  );
};

export default function MatchesListing() {
  const [activeTab, setActiveTab] = useState<"live" | "upcoming">("live");
  const { data, isLoading, error } = useSWR("/api/public/match/live", fetcher, {
    revalidateOnFocus: false,
  });
  const liveMatches = mapLiveMatchesToUI(data);
  const {
    data: upComing,
    isLoading: load,
    error: err,
  } = useSWR("/api/public/match/up-coming", fetcher, {
    revalidateOnFocus: false,
  });
  const upcomingMatches = mapLiveMatchesToUI(upComing);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Bar */}
      <MatchTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        liveCount={liveMatches.length}
        upcomingCount={upcomingMatches.length}
      />

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm text-gray-600">Loading matches...</p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {activeTab === "live" && !isLoading ? (
          <div className="space-y-6">
            {liveMatches.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {liveMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    <Zap className="w-4 h-4 inline mr-2 text-red-500" />
                    Follow live updates for all ongoing matches
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Live Matches
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  There are no live matches at the moment. Check back later or
                  view upcoming matches.
                </p>
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-green-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                >
                  View Upcoming Matches
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <UpcomingMatchesSection matches={upcomingMatches} />
        )}
      </div>
    </div>
  );
}
