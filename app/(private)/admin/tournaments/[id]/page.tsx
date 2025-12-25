"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

import { ChevronLeft, Edit, Flag, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AdminTournamentDetail() {
  const userName = localStorage.getItem("userName") || "Admin";
  const id = useSearchParams();

  const tournament = {
    id,
    name: "City League Championship",
    year: 2024,
    status: "ongoing",
    startDate: "Jan 15, 2024",
    endDate: "May 30, 2024",
    location: "Central Sports Complex",
    description:
      "Annual city-wide football tournament featuring the best teams in the region.",
    teams: 16,
    players: 240,
    matches: { total: 32, completed: 18, pending: 14 },
    managers: [
      { id: 1, name: "John Smith", email: "john@example.com" },
      { id: 2, name: "Sarah Johnson", email: "sarah@example.com" },
    ],
  };

  const registeredTeams = [
    { id: 1, name: "Tigers United", coach: "Coach Ali", players: 15 },
    { id: 2, name: "Phoenix FC", coach: "Coach Maria", players: 16 },
    { id: 3, name: "Eagles Sports", coach: "Coach James", players: 15 },
    { id: 4, name: "Lions Club", coach: "Coach Sarah", players: 14 },
  ];

  const standings = [
    {
      rank: 1,
      team: "Tigers United",
      wins: 6,
      draws: 1,
      losses: 0,
      points: 19,
    },
    {
      rank: 2,
      team: "Eagles Sports",
      wins: 5,
      draws: 2,
      losses: 0,
      points: 17,
    },
    { rank: 3, team: "Phoenix FC", wins: 4, draws: 3, losses: 0, points: 15 },
    { rank: 4, team: "Lions Club", wins: 3, draws: 1, losses: 3, points: 10 },
  ];

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/tournaments">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {tournament.name}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {tournament.location} • {tournament.year}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link href={`/admin/tournaments/${id}/edit`}>
              <Button className="bg-primary hover:bg-blue-600 text-white rounded-lg gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </Link>
            {tournament.status !== "finished" && (
              <Link href={`/admin/tournaments/${id}/finish`}>
                <Button variant="outline" className="rounded-lg gap-2">
                  <Flag className="w-4 h-4" />
                  Finish
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tournament Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground font-medium mb-2">
            Status
          </p>
          <p className="text-2xl font-bold text-foreground capitalize">
            {tournament.status}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground font-medium mb-2">
            Teams
          </p>
          <p className="text-2xl font-bold text-foreground">
            {tournament.teams}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground font-medium mb-2">
            Players
          </p>
          <p className="text-2xl font-bold text-foreground">
            {tournament.players}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground font-medium mb-2">
            Matches
          </p>
          <p className="text-2xl font-bold text-foreground">
            {tournament.matches.completed}/{tournament.matches.total}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tournament Info */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Tournament Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Period
                </p>
                <p className="text-foreground">
                  {tournament.startDate} to {tournament.endDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Description
                </p>
                <p className="text-foreground">{tournament.description}</p>
              </div>
            </div>
          </div>

          {/* Assigned Managers */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Assigned Managers
            </h2>
            <div className="space-y-3">
              {tournament.managers.map((manager) => (
                <div
                  key={manager.id}
                  className="border border-border rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {manager.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {manager.email}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded">
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 rounded-lg">
              Add Manager
            </Button>
          </div>

          {/* Standings */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Current Standings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left py-2 px-3 font-semibold text-sm">
                      Rank
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-sm">
                      Team
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-sm">
                      W
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-sm">
                      D
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-sm">
                      L
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-sm">
                      Pts
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row) => (
                    <tr
                      key={row.rank}
                      className="border-b border-border hover:bg-muted"
                    >
                      <td className="py-2 px-3 text-sm font-bold text-primary">
                        {row.rank}
                      </td>
                      <td className="py-2 px-3 text-sm font-medium text-foreground">
                        {row.team}
                      </td>
                      <td className="py-2 px-3 text-sm text-muted-foreground">
                        {row.wins}
                      </td>
                      <td className="py-2 px-3 text-sm text-muted-foreground">
                        {row.draws}
                      </td>
                      <td className="py-2 px-3 text-sm text-muted-foreground">
                        {row.losses}
                      </td>
                      <td className="py-2 px-3 text-sm font-bold text-foreground">
                        {row.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Registered Teams */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Registered Teams
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {registeredTeams.map((team) => (
              <div
                key={team.id}
                className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
              >
                <p className="font-medium text-foreground">{team.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Coach: {team.coach}
                </p>
                <p className="text-xs text-muted-foreground">
                  {team.players} players
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
