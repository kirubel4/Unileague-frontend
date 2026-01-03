"use client";
import { mapTeams, Team } from "@/app/(private)/manager/players/transfer/util";
import { mapApiDataToTable } from "@/app/(private)/manager/standings/util";
import { Layout } from "@/components/Layout";

import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/utils";

import { ChevronLeft, Edit, Flag, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { ManagerTableRow, mapManagersToTableRows } from "../../managers/util";

type TournamentManager = {
  id: string;
  name: string;
  email: string;
};

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

export default function AdminTournamentDetail() {
  const userName = "Admin";
  const params = useParams();
  const id = params?.id ?? "";
  const [managers, setManagers] = useState<ManagerTableRow[]>([]);
  // Fetch tournament details
  const { data: tournamentRes } = useSWR(
    `/api/public/tournament/detail?id=${id}`,
    fetcher
  );
  const {
    data: manager,
    error: err,
    mutate: mutateManager,
  } = useSWR("/api/protected/admin/manager", fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (data?.data) {
      setManagers(mapManagersToTableRows(manager?.data));
    }
  }, [manager]);

  const tournament: Tournament | null = tournamentRes?.data ?? null;

  const { data: teamRes } = useSWR(
    `/api/public/team/tournament?tid=${id}`,
    fetcher
  );
  const teams: Team[] = mapTeams(teamRes || { data: [] });
  const { data, isLoading, error } = useSWR(
    `/api/public/tournament/standings?id=${id}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const standing = mapApiDataToTable(data?.data || []);

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
  console.log(tournament);
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
              {mappedTournament?.name}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {mappedTournament?.location} • {mappedTournament?.startDate}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link href={`/admin/tournaments/${id}/edit`}>
              <Button className="bg-primary hover:bg-blue-600 text-white rounded-lg gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </Link>
            {tournament?.status !== "finished" && (
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground font-medium mb-2">
            Status
          </p>
          <p className="text-2xl font-bold text-foreground capitalize">
            {mappedTournament?.status}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground font-medium mb-2">
            Teams
          </p>
          <p className="text-2xl font-bold text-foreground">
            {mappedTournament?.teams}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground font-medium mb-2">
            Players
          </p>
          <p className="text-2xl font-bold text-foreground">
            {mappedTournament?.players ?? 0}
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
                  {tournament?.startingDate} to {mappedTournament?.endDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Description
                </p>
                <p className="text-foreground">
                  {mappedTournament?.description}
                </p>
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
              {mappedTournament?.managers === undefined ||
              mappedTournament?.managers === null ? (
                <>
                  <div>No Assign Managers</div>
                  <Button variant="outline" className="w-full mt-4 rounded-lg">
                    Add Manager
                  </Button>
                </>
              ) : (
                (mappedTournament?.managers ?? []).map((manager) => (
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
                ))
              )}
            </div>
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
                  {standing?.map((row) => (
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
            {teams?.map((team) => (
              <div
                key={team.id}
                className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
              >
                <p className="font-medium text-foreground">{team.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Coach: {team.coachName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {team.playerCount} players
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
