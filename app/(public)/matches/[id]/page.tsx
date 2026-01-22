"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  ChevronLeft,
  Shield,
  Target,
  BarChart3,
  Flag,
  Zap,
  AlertCircle,
  User,
  Award,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { mapMatchApiToMatchData, MatchEvent } from "./utility";
import {
  lineUpMapperBench,
  lineUpMapperStarting,
  mapPlayerNames,
} from "@/app/(private)/manager/matches/[id]/util";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
export default function MatchDetailPage() {
  const parm = useParams();
  const id = parm.id as string;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const {
    data,
    isLoading,
    error,
    mutate: mutateMatch,
  } = useSWR("/api/public/match/detail?id=" + id, fetcher, {
    revalidateOnFocus: false,
  });

  const matches = mapMatchApiToMatchData(data ?? []);
  let homePlayers, awayPlayers;
  let homePlayersBench: { name: string; id: string }[] = [];
  let awayPlayersBench: { name: string; id: string }[] = [];
  if (matches?.homeTeam && matches?.awayTeam) {
    const {
      data: homeTeam,
      isLoading: load,
      error: er,
    } = useSWR(
      `/api/public/match/line-up?mid=${id}&id=${matches?.homeTeam?.id}`,
      fetcher,
      {
        revalidateOnFocus: false,
      },
    );
    homePlayers = lineUpMapperStarting(homeTeam?.data);
    homePlayersBench = lineUpMapperBench(homeTeam?.data);
    const {
      data: awayTeam,
      isLoading: loading,
      error: err,
    } = useSWR(
      `/api/public/match/line-up?mid=${id}&id=${matches?.awayTeam?.id}`,
      fetcher,
      {
        revalidateOnFocus: false,
      },
    );
    awayPlayers = lineUpMapperStarting(awayTeam?.data);
    awayPlayersBench = lineUpMapperBench(awayTeam?.data);
  }
  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateTime: string) => {
    // Expected format: "03:00 22/01/25"
    console.log(dateTime);
    if (!dateTime) {
      dateTime = "03:00 22/01/25";
    }
    const [time, date] = dateTime.split(" ");
    const [hour, minute] = time?.split(":").map(Number);
    const [day, month, year] = date?.split("/").map(Number);

    // Convert YY → YYYY (assumes 20xx)
    const fullYear = 2000 + year;

    const parsedDate = new Date(
      fullYear,
      month - 1, // JS months are 0-based
      day,
      hour,
      minute,
    );

    return {
      date: parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      time: parsedDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getEventIcon = (type: MatchEvent["type"], cardType?: string) => {
    switch (type) {
      case "GOAL":
        return { icon: Target, color: "text-green-600", bg: "bg-green-100" };
      case "CARD":
        return cardType === "RED"
          ? { icon: Card, color: "text-red-600", bg: "bg-red-100" }
          : { icon: Card, color: "text-yellow-600", bg: "bg-yellow-100" };
      case "SUBSTITUTION":
        return { icon: Users, color: "text-blue-600", bg: "bg-blue-100" };
      case "PENALTY":
        return { icon: Flag, color: "text-purple-600", bg: "bg-purple-100" };
      case "INJURY":
        return {
          icon: AlertCircle,
          color: "text-orange-600",
          bg: "bg-orange-100",
        };
      default:
        return { icon: Zap, color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  const { date, time } = formatDateTime(matches?.dateTime);

  return (
    <div className="min-h-screen lg:mb-10 mb-5 sm:mb-7 bg-linear-to-b from-gray-50 to-white">
      {/* Back Navigation */}

      {/* Match Header */}
      <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[20px_20px]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-linear-to-r from-green-500/10 to-blue-500/10 blur-3xl" />

        <div className="relative px-4 py-8 sm:px-6 md:py-12 lg:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              {/* Tournament Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 mb-4 sm:mb-6">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-white tracking-wide">
                  {matches?.tournament || "PREMIER LEAGUE"}
                </span>
              </div>

              {/* Match Round */}
              <div className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6 px-2">
                {matches?.round || "ROUND 28"} • {date} • {time}
              </div>

              {/* Teams & Score - Proper responsive layout */}
              <div className="flex flex-row items-center justify-between gap-4 sm:gap-8 lg:gap-12 max-w-5xl mx-auto">
                {/* Home Team */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-2 sm:gap-4">
                    {/* Team Logo */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 overflow-hidden">
                      {matches?.homeTeam?.logo ? (
                        <img
                          src={matches.homeTeam.logo}
                          alt={matches.homeTeam.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white/50" />
                        </div>
                      )}
                    </div>

                    {/* Team Name */}
                    <div className="text-center">
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate max-w-full px-2">
                        {matches?.homeTeam?.name?.slice(0, 4) +
                          matches?.homeTeam?.name?.slice(8, 12) || "HOME"}
                      </div>
                      <div className="text-xs sm:text-sm text-white/60 font-medium">
                        {matches?.homeTeam?.shortName || "HOM"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center: Score & Status */}
                <div className="flex-1 min-w-0 px-2 sm:px-0">
                  <div className="flex flex-col items-center gap-3 sm:gap-4">
                    {/* Match Status Badge */}
                    <div
                      className={`
                   px-3 sm:px-4 py-1.5 sm:py-2 rounded-md
                font-semibold text-xs sm:text-sm
                ${
                  matches?.status === "ONGOING"
                    ? " text-red-400 animate-pulse"
                    : matches?.status === "UPCOMING"
                      ? " text-white"
                      : " text-white"
                }
              `}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          matches?.status === "ONGOING" ? "animate-ping" : ""
                        }`}
                      />
                      <span>
                        {matches?.status === "ONGOING"
                          ? "LIVE"
                          : matches?.status === "UPCOMING"
                            ? "UPCOMING"
                            : "FT"}
                      </span>
                    </div>

                    {/* Score Display */}
                    <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
                      {/* Home Score */}
                      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                        {matches?.score?.home || "0"}
                      </div>

                      {/* VS Separator */}
                      <div className="text-xl sm:text-2xl text-white/50 font-light">
                        -
                      </div>

                      {/* Away Score */}
                      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                        {matches?.score?.away || "0"}
                      </div>
                    </div>

                    {/* Date & Time - Show on all screens */}
                    <div className="text-xs sm:text-sm text-white/60 mt-1">
                      {time}
                    </div>
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-2 sm:gap-4">
                    {/* Team Logo */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 overflow-hidden">
                      {matches?.awayTeam?.logo ? (
                        <img
                          src={matches.awayTeam.logo}
                          alt={matches.awayTeam.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white/50" />
                        </div>
                      )}
                    </div>

                    {/* Team Name */}
                    <div className="text-center">
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate max-w-full px-2">
                        {matches?.awayTeam?.name?.slice(0, 4) +
                          matches?.awayTeam?.name?.slice(8, 12) || "AWAY"}
                      </div>
                      <div className="text-xs sm:text-sm text-white/60 font-medium">
                        {matches?.awayTeam?.shortName || "AWY"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Info - Simple responsive layout */}
              <div className="mt-6 sm:mt-8 md:mt-12 px-2">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm sm:text-base">
                      {matches?.venue || "Stadium"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-white/80">
                    <Flag className="w-4 h-4" />
                    <span className="text-sm sm:text-base">
                      Referee: {matches?.referee || "Official"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Match Stats */}
              {matches?.status === "ONGOING" && (
                <div className="mt-6 sm:mt-8 px-4">
                  <div className="bg-linear-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm font-semibold text-red-300">
                        LIVE UPDATES
                      </span>
                    </div>
                    <div className="text-center text-xs sm:text-sm text-white/80">
                      Second Half • 67' • Possession: 58% - 42%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-24 md:h-32 bg-linear-to-t from-gray-50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl sm:py-6 lg:py-8 mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 bg-gray-100 p-1 rounded-xl flex gap-1 overflow-x-auto scrollbar-hide">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 font-medium text-sm rounded-lg transition-all flex-1 justify-center"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  Overview
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 font-medium text-sm rounded-lg transition-all flex-1 justify-center"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  Events
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="lineup"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 font-medium text-sm rounded-lg transition-all flex-1 justify-center"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  Lineup
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 font-medium text-sm rounded-lg transition-all flex-1 justify-center"
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  Statistics
                </span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Match Summary */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Match Summary
                </h3>

                <div className="space-y-6">
                  {/* Timeline Visualization */}
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-600 to-purple-600"
                      style={{
                        width: `${
                          (matches?.statistics.possession.home / 100) * 100
                        }%`,
                      }}
                    />
                    <div
                      className="absolute top-0 right-0 h-full bg-linear-to-r from-green-600 to-emerald-600"
                      style={{
                        width: `${
                          (matches?.statistics.possession.away / 100) * 100
                        }%`,
                      }}
                    />
                  </div>

                  {/* Key Moments */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Key Moments
                    </h4>
                    <div className="space-y-3">
                      {matches?.events
                        .filter(
                          (event) =>
                            event.type === "GOAL" ||
                            event.type === "CARD" ||
                            event.type === "SUBSTITUTION",
                        )
                        .map((event) => {
                          const {
                            icon: Icon,
                            color,
                            bg,
                          } = getEventIcon(event.type, event.cardType);
                          return (
                            <div
                              key={event.id}
                              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200"
                            >
                              <div className={`p-2 rounded-lg ${bg}`}>
                                <Icon className={`w-4 h-4 ${color}`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {event.playerName}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {event.minute}' •{" "}
                                  {event.type === "GOAL"
                                    ? "Goal"
                                    : event.type === "CARD"
                                      ? "Yellow Card"
                                      : "Yellow Card"}
                                  {event.details && ` • ${event.details}`}
                                </div>
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  event.team === "HOME"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {event.team === "HOME"
                                  ? matches?.homeTeam.shortName
                                  : matches?.awayTeam.shortName}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Stats
                </h3>

                <div className="space-y-4">
                  {/* Possession */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-blue-600">
                        {matches?.homeTeam.shortName}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {matches?.awayTeam.shortName}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="flex h-full">
                        <div
                          className="bg-linear-to-r from-blue-600 to-blue-500"
                          style={{
                            width: `${matches?.statistics.possession.home}%`,
                          }}
                        />
                        <div
                          className="bg-linear-to-r from-green-600 to-emerald-500"
                          style={{
                            width: `${matches?.statistics.possession.away}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>{matches?.statistics.possession.home}%</span>
                      <span>Possession</span>
                      <span>{matches?.statistics.possession.away}%</span>
                    </div>
                  </div>

                  {/* Other Stats */}
                  {[
                    {
                      label: "Shots",
                      home: matches?.statistics.shots.home,
                      away: matches?.statistics.shots.away,
                    },
                    {
                      label: "Shots on Target",
                      home: matches?.statistics.shotsOnTarget.home,
                      away: matches?.statistics.shotsOnTarget.away,
                    },
                    {
                      label: "Corners",
                      home: matches?.statistics.corners.home,
                      away: matches?.statistics.corners.away,
                    },
                    {
                      label: "Fouls",
                      home: matches?.statistics.fouls.home,
                      away: matches?.statistics.fouls.away,
                    },
                    {
                      label: "Yellow Cards",
                      home: matches?.statistics.yellowCards.home,
                      away: matches?.statistics.yellowCards.away,
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-blue-600">
                        {stat.home}
                      </span>
                      <span className="text-sm text-gray-600">
                        {stat.label}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {stat.away}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  Match Events Timeline
                </h3>
                <p className="text-gray-600 mt-2">
                  All key events from the match
                </p>
              </div>

              <div className="p-6">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200" />

                  <div className="space-y-8">
                    {matches?.events.map((event) => {
                      const {
                        icon: Icon,
                        color,
                        bg,
                      } = getEventIcon(event.type, event.cardType);
                      const isHome = event.team === "HOME";

                      return (
                        <div
                          key={event.id}
                          className={`relative flex items-center ${
                            isHome ? "justify-start" : "justify-end"
                          }`}
                        >
                          {/* Event card */}
                          <div
                            className={`flex items-center gap-3 p-4 rounded-xl border ${
                              isHome
                                ? "border-blue-200 bg-blue-50"
                                : "border-green-200 bg-green-50"
                            } w-80`}
                          >
                            <div className={`p-2 rounded-lg ${bg}`}>
                              <Icon className={`w-4 h-4 ${color}`} />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {event.playerName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {event.type === "GOAL" && "⚽ Goal"}
                                {event.type === "CARD" && "🟨 Yellow Card"}
                                {event.type === "CARD" && "🟥 Red Card"}
                                {event.type === "SUBSTITUTION" &&
                                  "🔄 Substitution"}
                                {event.type === "INJURY" && "🚑 Injury"}
                                {event.type === "PENALTY" && "🎯 Penalty"}
                              </div>
                              {event.details && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {event.details}
                                </div>
                              )}
                              {event.type === "SUBSTITUTION" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {event.playerOut} ↔ {event.playerIn}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Minute indicator */}
                          <div
                            className={`absolute ${
                              isHome
                                ? "right-0 translate-x-12"
                                : "left-0 -translate-x-12"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {!isHome && (
                                <span className="text-sm font-medium text-gray-900">
                                  {event.minute}'
                                </span>
                              )}
                              <div className="w-4 h-4 rounded-full border-2 border-white bg-gray-900 shadow" />
                              {isHome && (
                                <span className="text-sm font-medium text-gray-900">
                                  {event.minute}'
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Lineup Tab */}
          <TabsContent value="lineup">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Home Team Lineup */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        {matches?.homeTeam.logo && (
                          <img
                            src={matches?.homeTeam.logo}
                            alt={matches?.homeTeam.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Starting XI */}
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Starting XI
                  </h4>
                  <div className="space-y-2">
                    {homePlayers?.map((player: any) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-700">
                            {player.number}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {player.name}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {player.position}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">90'</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Away Team Lineup */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        {matches?.awayTeam.logo && (
                          <img
                            src={matches?.awayTeam.logo}
                            alt={matches?.awayTeam.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {matches?.awayTeam.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Starting XI */}
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Starting XI
                  </h4>
                  <div className="space-y-2">
                    {awayPlayers?.map((player: any) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-green-700">
                            {player.number}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {player.name}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {player.position}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">90'</div>
                      </div>
                    ))}
                  </div>

                  {/* Substitutes */}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Match Statistics
              </h3>

              <div className="space-y-6">
                {Object.entries(matches?.statistics).map(([key, value]) => {
                  const isPossession = key === "possession";
                  const homeValue = value.home;
                  const awayValue = value.away;
                  const total = homeValue + awayValue;

                  const labels: Record<string, string> = {
                    possession: "Possession (%)",
                    shots: "Total Shots",
                    shotsOnTarget: "Shots on Target",
                    corners: "Corners",
                    fouls: "Fouls Committed",
                    offsides: "Offsides",
                    yellowCards: "Yellow Cards",
                    redCards: "Red Cards",
                  };

                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="font-medium text-blue-600">
                          {matches?.homeTeam.shortName}
                        </span>
                        <span>{labels[key]}</span>
                        <span className="font-medium text-green-600">
                          {matches?.awayTeam.shortName}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right font-bold text-blue-700 w-12">
                          {homeValue}
                        </div>

                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="flex h-full">
                              <div
                                className="bg-linear-to-r from-blue-600 to-blue-500"
                                style={{
                                  width: `${
                                    total > 0 ? (homeValue / total) * 100 : 50
                                  }%`,
                                }}
                              />
                              <div
                                className="bg-linear-to-r from-green-600 to-emerald-500"
                                style={{
                                  width: `${
                                    total > 0 ? (awayValue / total) * 100 : 50
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="font-bold text-green-700 w-12">
                          {awayValue}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
