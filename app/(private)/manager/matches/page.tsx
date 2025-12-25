"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useState } from "react";

export default function ManagerMatches() {
  const userName = localStorage.getItem("userName") || "Manager";
  const [activeTab, setActiveTab] = useState<
    "scheduled" | "live" | "completed"
  >("scheduled");

  const matches = {
    scheduled: [
      {
        id: 1,
        homeTeam: "Tigers United",
        awayTeam: "Phoenix FC",
        date: "Dec 20, 2024",
        time: "15:00",
        venue: "Central Stadium",
      },
      {
        id: 2,
        homeTeam: "Eagles Sports",
        awayTeam: "Lions Club",
        date: "Dec 21, 2024",
        time: "14:00",
        venue: "North Field",
      },
    ],
    live: [
      {
        id: 3,
        homeTeam: "Champions FC",
        awayTeam: "Warriors",
        score: "2 - 1",
        minute: "67",
      },
    ],
    completed: [
      {
        id: 4,
        homeTeam: "Strikers",
        awayTeam: "Victory Team",
        score: "3 - 2",
        date: "Dec 18, 2024",
      },
      {
        id: 5,
        homeTeam: "Titans",
        awayTeam: "Dragons",
        score: "1 - 1",
        date: "Dec 17, 2024",
      },
    ],
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
            {tab === "scheduled" && ` (${matches.scheduled.length})`}
            {tab === "live" && ` (${matches.live.length})`}
            {tab === "completed" && ` (${matches.completed.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "scheduled" &&
          matches.scheduled.map((match) => (
            <Link key={match.id} href={`/manager/matches/${match.id}`}>
              <div className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-primary">
                    {match.date} at {match.time}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {match.venue}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground flex-1">
                    {match.homeTeam}
                  </span>
                  <span className="text-muted-foreground text-sm px-3">vs</span>
                  <span className="font-medium text-foreground flex-1 text-right">
                    {match.awayTeam}
                  </span>
                </div>
              </div>
            </Link>
          ))}

        {activeTab === "live" &&
          matches.live.map((match) => (
            <Link key={match.id} href={`/manager/matches/${match.id}`}>
              <div className="bg-white rounded-lg border-2 border-green-500 p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    🔴 LIVE - Min {match.minute}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground flex-1">
                    {match.homeTeam}
                  </span>
                  <span className="text-xl font-bold text-primary px-4">
                    {match.score}
                  </span>
                  <span className="font-medium text-foreground flex-1 text-right">
                    {match.awayTeam}
                  </span>
                </div>
              </div>
            </Link>
          ))}

        {activeTab === "completed" &&
          matches.completed.map((match) => (
            <Link key={match.id} href={`/manager/matches/${match.id}`}>
              <div className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition-shadow cursor-pointer opacity-75">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {match.date}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground flex-1">
                    {match.homeTeam}
                  </span>
                  <span className="text-lg font-bold text-foreground px-4">
                    {match.score}
                  </span>
                  <span className="font-medium text-foreground flex-1 text-right">
                    {match.awayTeam}
                  </span>
                </div>
              </div>
            </Link>
          ))}

        {((activeTab === "scheduled" && matches.scheduled.length === 0) ||
          (activeTab === "live" && matches.live.length === 0) ||
          (activeTab === "completed" && matches.completed.length === 0)) && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No {activeTab} matches</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
