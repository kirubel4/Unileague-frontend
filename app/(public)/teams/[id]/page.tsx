// app/(private)/manager/teams/[id]/page.tsx
"use client";
import {
  mapApiPlayersToPlayers,
  mapTeamApiToTeamData,
  mapTeamStats,
} from "@/app/(private)/manager/teams/[id]/util";
import { Layout } from "@/components/Layout";
import {
  Player,
  TeamData,
  TeamDetail,
  TeamStats,
} from "@/components/pages/teamDetail";

import { fetcher, getCookie } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
export default function AdminTeamDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const userName = getCookie("uName") || "Manager";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    data,
    error: err,
    isLoading: load,
  } = useSWR("/api/public/team/detail?id=" + id, fetcher, {
    revalidateOnFocus: false,
  });
  const team: TeamData = mapTeamApiToTeamData(data?.data);
  const {
    data: players,
    error: erro,
    isLoading: loading,
  } = useSWR("/api/public/player/team?id=" + id, fetcher, {
    revalidateOnFocus: false,
  });
  const playerz: Player[] = mapApiPlayersToPlayers(players?.data);
  const {
    data: status,
    error: errors,
    isLoading: loadingsat,
  } = useSWR("/api/public/team/status?id=" + id, fetcher, {
    revalidateOnFocus: false,
  });
  const stats = mapTeamStats(status?.data);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <TeamDetail
        mode="public"
        teamData={team}
        players={playerz}
        id={id}
        stats={stats}
        isLoading={isLoading}
        error={error}
        basePath="/teams"
        title="View"
        showBreadcrumb={true}
        className="mt-8"
      />
    </div>
  );
}
