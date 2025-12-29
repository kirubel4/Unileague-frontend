"use client";
import { Layout } from "@/components/Layout";
import { fetcher } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED";

export interface ApiMatch {
  id: string;
  scheduledDate: string;
  venue: string;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  matchWeek: number | null;

  homeTeam: {
    id: string;
    teamName: string;
  };

  awayTeam: {
    id: string;
    teamName: string;
  };
}
const formatDateTime = (value: string) => {
  const [time, date] = value.split(" ");
  return { time, date };
};

export default function ManagerMatches() {
  const userName = "Manager";
  const [activeTab, setActiveTab] = useState<
    "scheduled" | "live" | "completed"
  >("scheduled");
  const { data, isLoading, error } = useSWR(
    `/api/public/match?id=fb1c80f4-7ffc-4b84-b329-d08511349fa2`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const apiMatches: ApiMatch[] = data?.data ?? [];
  const matchesByTab = {
    scheduled: apiMatches.filter((m) => m.status === "SCHEDULED"),
    live: apiMatches.filter((m) => m.status === "LIVE"),
    completed: apiMatches.filter((m) => m.status === "FINISHED"),
  };

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Matches</h1>
        <p className="text-muted-foreground mt-2">
          View and manage tournament matches
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        {["scheduled", "live", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "scheduled" && ` (${matchesByTab.scheduled.length})`}
            {tab === "live" && ` (${matchesByTab.live.length})`}
            {tab === "completed" && ` (${matchesByTab.completed.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeTab === "scheduled" &&
          matchesByTab.scheduled.map((match) => {
            const { date, time } = formatDateTime(match.scheduledDate);

            return (
              <Link key={match.id} href={`/manager/matches/${match.id}`}>
                <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-primary">
                      {date} at {time}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {match.venue}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium flex-1">
                      {match.homeTeam.teamName}
                    </span>
                    <span className="text-muted-foreground px-3">vs</span>
                    <span className="font-medium flex-1 text-right">
                      {match.awayTeam.teamName}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

        {activeTab === "live" &&
          matchesByTab.live.map((match) => (
            <Link key={match.id} href={`/manager/matches/${match.id}`}>
              <div className="bg-white rounded-lg border-2 border-green-500 p-4">
                <span className="text-sm font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  🔴 LIVE
                </span>

                <div className="flex justify-between mt-3">
                  <span>{match.homeTeam.teamName}</span>
                  <span className="font-bold text-lg">
                    {match.homeScore} - {match.awayScore}
                  </span>
                  <span>{match.awayTeam.teamName}</span>
                </div>
              </div>
            </Link>
          ))}

        {activeTab === "completed" &&
          matchesByTab.completed.map((match) => (
            <Link key={match.id} href={`/manager/matches/${match.id}`}>
              <div
                className="
      w-full
      max-w-2xl
      bg-white
      rounded-xl
      border
      px-6
      py-4
      hover:shadow-md
      transition
      opacity-90
    "
              >
                {/* Date */}
                <div className="text-center mb-3">
                  <span className="text-xs text-muted-foreground">
                    {match.scheduledDate}
                  </span>
                </div>

                {/* Teams + Score */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <span className="text-right font-medium truncate">
                    {match.homeTeam.teamName}
                  </span>

                  <span className="text-lg font-bold text-primary">
                    {match.homeScore} - {match.awayScore}
                  </span>

                  <span className="text-left font-medium truncate">
                    {match.awayTeam.teamName}
                  </span>
                </div>
              </div>
            </Link>
          ))}

        {((activeTab === "scheduled" && matchesByTab.scheduled.length === 0) ||
          (activeTab === "live" && matchesByTab.live.length === 0) ||
          (activeTab === "completed" &&
            matchesByTab.completed.length === 0)) && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No {activeTab} matches</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
