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
  Trophy,
  Loader2,
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
    <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 p-1 bg-gray-100 rounded-xl sm:rounded-2xl border border-gray-200 sm:border-0">
      <button
        onClick={() => onTabChange("live")}
        className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 font-medium text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg transition-all duration-300 ${
          activeTab === "live"
            ? "bg-linear-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-200"
            : "text-gray-600 hover:text-gray-900 hover:bg-white"
        }`}
      >
        <Zap
          className={`w-3 h-3 sm:w-4 sm:h-4 ${
            activeTab === "live" ? "text-white" : "text-red-500"
          }`}
        />
        <span className="hidden xs:inline">Live</span>
        <span className="xs:hidden">Live</span>
        {liveCount > 0 && (
          <span
            className={`px-1.5 py-0.5 text-xs rounded-full ${
              activeTab === "live"
                ? "bg-white/30 text-white"
                : "bg-red-100 text-red-600"
            }`}
          >
            {liveCount}
          </span>
        )}
      </button>
      <button
        onClick={() => onTabChange("upcoming")}
        className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 font-medium text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg transition-all duration-300 ${
          activeTab === "upcoming"
            ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-200"
            : "text-gray-600 hover:text-gray-900 hover:bg-white"
        }`}
      >
        <Calendar
          className={`w-3 h-3 sm:w-4 sm:h-4 ${
            activeTab === "upcoming" ? "text-white" : "text-blue-500"
          }`}
        />

        <span className="xs:hidden">Upcoming</span>
        <span
          className={`px-1.5 py-0.5 text-xs rounded-full ${
            activeTab === "upcoming"
              ? "bg-white/30 text-white"
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
    <Link href={`/matches/${match.id}`} className="block group">
      <div
        className={`bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${
          isLive
            ? "border-l-4 border-l-red-500 hover:border-l-red-600"
            : isUpcoming
              ? "border-l-4 border-l-blue-500 hover:border-l-blue-600"
              : "border-l-4 border-l-green-500 hover:border-l-green-600 border-gray-200"
        }`}
      >
        {/* Status Bar */}
        <div
          className={`px-3 sm:px-4 py-2 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 ${
            isLive
              ? "bg-linear-to-r from-red-50 to-orange-50"
              : isUpcoming
                ? "bg-linear-to-r from-blue-50 to-cyan-50"
                : "bg-linear-to-r from-green-50 to-emerald-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {isLive ? (
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute"></div>
                  <div className="w-2 h-2 bg-red-600 rounded-full relative"></div>
                </div>
                <span className="text-xs sm:text-sm font-bold text-red-700">
                  LIVE
                </span>
                <span className="text-xs text-gray-600 hidden xs:inline">
                  • {match.time}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {match.date}
                </span>
                <span className="text-xs text-gray-600 hidden xs:inline">
                  • {match.time}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
              <span className="text-xs font-medium text-gray-700 truncate max-w-25 xs:max-w-[150px] sm:max-w-none">
                {match.tournament}
              </span>
            </div>
            {match.round && (
              <span className="text-xs px-2 py-0.5 bg-white/80 rounded-full text-gray-700 font-medium">
                {match.round}
              </span>
            )}
          </div>
        </div>

        {/* Match Content */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            {/* Team A */}
            <div className="flex-1 w-full md:w-auto">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-r from-blue-100 to-cyan-100 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                    {match.teamA.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">Home</p>
                </div>
                {(isLive || isCompleted) && (
                  <div className="text-center ml-2">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                      {match.teamA.score || 0}
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">
                      Score
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* VS Center */}
            <div className="my-2 md:my-0">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-gray-900">
                  VS
                </div>
                <div
                  className={`text-xs px-3 py-1 rounded-full mt-1 font-medium ${
                    isLive
                      ? "bg-red-100 text-red-700"
                      : isUpcoming
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {isLive ? "LIVE" : isUpcoming ? "UPCOMING" : "FINISHED"}
                </div>
                {isLive && (
                  <div className="text-xs text-red-600 font-medium mt-1 animate-pulse">
                    {match.time}'
                  </div>
                )}
              </div>
            </div>

            {/* Team B */}
            <div className="flex-1 w-full md:w-auto">
              <div className="flex items-center gap-3 sm:gap-4 justify-end">
                {(isLive || isCompleted) && (
                  <div className="text-center mr-2">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                      {match.teamB.score || 0}
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">
                      Score
                    </div>
                  </div>
                )}
                <div className="flex-1 text-right min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                    {match.teamB.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">Away</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-r from-green-100 to-emerald-100 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 mt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
              <span className="text-xs sm:text-sm truncate max-w-45 xs:max-w-[250px]">
                {match.venue}
              </span>
            </div>
            <button
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 group-hover:scale-105 ${
                isLive
                  ? "bg-linear-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-red-200"
                  : isUpcoming
                    ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-200"
                    : "bg-linear-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-200"
              }`}
            >
              {isLive && (
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
              )}
              {isLive
                ? "Watch Live"
                : isUpcoming
                  ? "View Details"
                  : "Highlights"}
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Live Match Progress */}
        {isLive && (
          <div className="px-4 pb-4">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-linear-to-r from-red-500 to-orange-500 h-1.5 rounded-full w-2/3 animate-pulse"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1.5">
              <span>1st Half</span>
              <span className="font-medium">67'</span>
              <span>2nd Half</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

const UpcomingMatchesSection = ({ matches }: { matches: Match[] }) => {
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
    <div className="space-y-6 sm:space-y-8">
      {matches.length > 0 ? (
        Object.entries(groupedMatches).map(([date, dateMatches]) => (
          <div key={date} className="space-y-4">
            <div className="flex items-center gap-3 bg-linear-to-r from-blue-50 to-cyan-50 p-3 sm:p-4 rounded-xl">
              <div className="p-2 rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-md">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                  {date}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {dateMatches.length} match{dateMatches.length > 1 ? "es" : ""}{" "}
                  scheduled
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {dateMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-linear-to-r from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Scheduled Matches
          </h3>
          <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
            There are no scheduled matches at the moment. Check back later for
            updates.
          </p>
        </div>
      )}
    </div>
  );
};

const LoadingState = () => (
  <div className="flex items-center justify-center py-12 sm:py-16">
    <div className="text-center space-y-4">
      <div className=" flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading team information...</p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm sm:text-base font-medium text-gray-700">
          Loading matches
        </p>

        <div className="flex justify-center space-x-1">
          {[0, 0.1, 0.2].map((delay) => (
            <div
              key={delay}
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function MatchesListing() {
  const [activeTab, setActiveTab] = useState<"live" | "upcoming">("live");

  const { data, isLoading: liveLoading } = useSWR(
    "/api/public/match/live",
    fetcher,
    { revalidateOnFocus: false },
  );

  const { data: upComing, isLoading: upcomingLoading } = useSWR(
    "/api/public/match/up-coming",
    fetcher,
    { revalidateOnFocus: false },
  );

  const liveMatches = mapLiveMatchesToUI(data);
  const upcomingMatches = mapLiveMatchesToUI(upComing);

  const isLoading = activeTab === "live" ? liveLoading : upcomingLoading;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Football Matches
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Follow live scores and upcoming matches
          </p>
        </div>

        {/* Tab Bar */}
        <MatchTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          liveCount={liveMatches.length}
          upcomingCount={upcomingMatches.length}
        />

        {/* Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          {isLoading ? (
            <LoadingState />
          ) : activeTab === "live" ? (
            <div className="space-y-6">
              {liveMatches.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {liveMatches.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                  <div className="text-center pt-4 border-t border-gray-100">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-50 to-orange-50 rounded-full">
                      <Zap className="w-4 h-4 text-red-500 animate-pulse" />
                      <p className="text-sm text-gray-600">
                        Live updates refresh automatically
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-linear-to-r from-red-50 to-orange-50 flex items-center justify-center">
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Live Matches
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base mb-6">
                    There are no live matches at the moment. Check out upcoming
                    matches below.
                  </p>
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-200 transition-all duration-300"
                  >
                    <Calendar className="w-4 h-4" />
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
    </div>
  );
}
