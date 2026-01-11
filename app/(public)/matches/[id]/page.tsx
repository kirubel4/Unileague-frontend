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
import { mapPlayerNames } from "@/app/(private)/manager/matches/[id]/util";

// Mock match data structure (based on what your API will provide)

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
  if (matches?.homeTeam && matches?.awayTeam) {
    const {
      data: homeTeam,
      isLoading: load,
      error: er,
    } = useSWR("/api/public/player/team?id=" + matches?.homeTeam?.id, fetcher, {
      revalidateOnFocus: false,
    });
    homePlayers = mapPlayerNames(homeTeam?.data);

    const {
      data: awayTeam,
      isLoading: loading,
      error: err,
    } = useSWR("/api/public/player/team?id=" + matches?.awayTeam?.id, fetcher, {
      revalidateOnFocus: false,
    });
    awayPlayers = mapPlayerNames(awayTeam?.data);
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
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

        <div className="relative px-6 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              {/* Tournament Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Trophy className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  {matches?.tournament}
                </span>
              </div>

              {/* Match Round */}
              <div className="text-lg text-white/80 mb-2">{matches.round}</div>

              {/* Teams & Score */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
                {/* Home Team */}
                <div className="text-center flex-1">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden">
                      {matches?.homeTeam.logo ? (
                        <img
                          src={matches?.homeTeam.logo}
                          alt={matches?.homeTeam.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Shield className="w-10 h-10 text-white/60" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-white">
                        {matches?.homeTeam.name}
                      </div>
                      <div className="text-sm text-white/60 mt-1">
                        {matches?.homeTeam.shortName}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-center">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                      matches?.status === "ONGOING"
                        ? "bg-red-100 text-red-700 animate-pulse"
                        : matches?.status === "UPCOMING"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span className="text-sm font-semibold">
                      {matches?.status === "ONGOING" ? "LIVE" : matches?.status}
                    </span>
                  </div>

                  <div className="text-5xl md:text-7xl font-bold text-white mb-2">
                    {matches?.score.home} - {matches?.score.away}
                  </div>

                  <div className="text-sm text-white/60">
                    {date} • {time}
                  </div>
                </div>

                {/* Away Team */}
                <div className="text-center flex-1">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden">
                      {matches?.awayTeam.logo ? (
                        <img
                          src={matches?.awayTeam.logo}
                          alt={matches?.awayTeam.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Shield className="w-10 h-10 text-white/60" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-white">
                        {matches?.awayTeam.name}
                      </div>
                      <div className="text-sm text-white/60 mt-1">
                        {matches?.awayTeam.shortName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Info */}
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{matches?.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  <span>Referee: {matches?.referee}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-gray-50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>Overview</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Events</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="lineup"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Lineup</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5"
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Statistics</span>
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
                            event.type === "SUBSTITUTION"
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
                                    : "Red Card"}
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
                    {homePlayers?.map((player) => (
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
                    {awayPlayers?.map((player) => (
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
