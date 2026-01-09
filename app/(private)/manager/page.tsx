"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { fetcher, getCookie } from "@/lib/utils";
import {
  Trophy,
  Users,
  Zap,
  Clock,
  CheckCircle,
  Calendar,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { mapTeams, Team } from "./players/transfer/util";
type Tournament = {
  id: string;
  tournamentName: string;
  startingDate: string;
  endingDate: string;
  description: string;
  venue: string;
  sponsor?: string;
  status: string;
  teamCount: number;
  playerCount: number;
  managers: TournamentManager[];
};
type TournamentManager = {
  id: string;
  name: string;
  email: string;
};

export default function ManagerDashboard() {
  const userName = getCookie("uName") || "Manager";
  const { data: tournamentRes } = useSWR(
    `/api/public/tournament/detail`,
    fetcher
  );

  const tournament: Tournament | null = tournamentRes?.data ?? null;
  const mappedTournament = tournament
    ? {
        id: tournament.id,
        name: tournament.tournamentName,
        startDate: tournament.startingDate,
        endDate: tournament.endingDate,
        location: tournament.venue,
        description: tournament.description,
        status: tournament.status,
        teams: tournament.teamCount,
        players: tournament.playerCount,
        managers: tournament.managers || [],
      }
    : null;
  {
    mappedTournament?.name;
  }
  console.log(tournament);
  const tournamentInfo = {
    name: "City League Championship 2024",
    logo: "⚽",
    teams: 16,
    players: 240,
    completedMatches: 18,
    totalMatches: 32,
  };

  const todayMatches = [
    {
      id: 1,
      homeTeam: "Tigers United",
      awayTeam: "Phoenix FC",
      time: "14:00",
      status: "Scheduled",
    },
    {
      id: 2,
      homeTeam: "Eagles Sports",
      awayTeam: "Lions Club",
      time: "16:30",
      status: "Scheduled",
    },
  ];

  const upcomingMatches = [
    {
      id: 3,
      homeTeam: "Champions FC",
      awayTeam: "Warriors",
      date: "Tomorrow, 15:00",
    },
    {
      id: 4,
      homeTeam: "Strikers",
      awayTeam: "Victory Team",
      date: "Dec 20, 14:00",
    },
  ];

  const pendingActions = [
    {
      action: "Confirm match lineups",
      matches: 3,
      dueDate: "Today",
      icon: <Users className="w-5 h-5" />,
    },
    {
      action: "Review player transfer requests",
      matches: 2,
      dueDate: "Dec 20",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      action: "Publish match statistics",
      matches: 5,
      dueDate: "Dec 21",
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  const quickStats = [
    {
      label: "Total Teams",
      value: mappedTournament?.teams,
      icon: <Users className="w-5 h-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Players",
      value: mappedTournament?.players,
      icon: <Users className="w-5 h-5" />,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Tournament Status",
      value: mappedTournament?.status,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <Layout role="manager" userName={userName}>
      {/* Tournament Header */}
      <div className="bg-white rounded-lg border border-border p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{tournamentInfo.logo}</div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {mappedTournament?.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Match Progress: {tournamentInfo.completedMatches} of{" "}
              {tournamentInfo.totalMatches} matches completed
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Tournament Progress
            </span>
            <span className="text-sm font-medium text-foreground">
              {Math.round(
                (tournamentInfo.completedMatches /
                  tournamentInfo.totalMatches) *
                  100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (tournamentInfo.completedMatches /
                    tournamentInfo.totalMatches) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-border p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Today's Matches & Upcoming */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Matches */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Today's Matches
              </h2>
            </div>

            {todayMatches.length > 0 ? (
              <div className="space-y-4">
                {todayMatches.map((match) => (
                  <div
                    key={match.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-primary">
                        {match.time}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {match.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {match.homeTeam}
                      </span>
                      <span className="text-muted-foreground">vs</span>
                      <span className="font-medium text-foreground">
                        {match.awayTeam}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No matches scheduled for today
              </p>
            )}
          </div>

          {/* Upcoming Matches */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Upcoming Matches
              </h2>
            </div>

            <div className="space-y-3">
              {upcomingMatches.map((match) => (
                <div
                  key={match.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
                >
                  <p className="text-xs text-muted-foreground mb-2">
                    {match.date}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {match.homeTeam}
                    </span>
                    <span className="text-muted-foreground text-sm">vs</span>
                    <span className="font-medium text-foreground">
                      {match.awayTeam}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Pending Actions */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Pending Actions
          </h2>

          <div className="space-y-3">
            {pendingActions.map((item, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-primary mt-1">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">
                      {item.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {item.dueDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-6 space-y-2">
            <Link href="/manager/matches" className="block">
              <Button className="w-full bg-primary hover:bg-blue-600 text-white rounded-lg">
                <Trophy className="w-4 h-4 mr-2" />
                View All Matches
              </Button>
            </Link>
            <Link href="/manager/teams" className="block">
              <Button variant="outline" className="w-full rounded-lg">
                <Users className="w-4 h-4 mr-2" />
                Manage Teams
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
