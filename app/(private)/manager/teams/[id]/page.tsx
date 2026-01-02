// app/(private)/manager/teams/[id]/page.tsx
"use client";
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
import {
  mapApiPlayersToPlayers,
  mapTeamApiToTeamData,
  mapTeamStats,
} from "./util";

export default function AdminTeamDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const userName = getCookie("uName") || "Manager";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(id);
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
  const handleDeleteTeam = () => {
    if (
      confirm(
        "Are you sure you want to delete this team? This action cannot be undone."
      )
    ) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Deleted team:", params.id);
        setIsLoading(false);
        // In real app, redirect to teams list after delete
        // router.push('/manager/teams');
      }, 1500);
    }
  };

  const handleEditTeam = () => {
    console.log("Edit team:", params.id);
    // In real app: router.push(`/manager/teams/${params.id}/edit`);
  };

  const handleAddPlayer = () => {
    console.log("Add player to team:", params.id);
    // In real app: router.push(`/manager/teams/${params.id}/players/add`);
  };

  const handleShareTeam = () => {
    console.log("Share team:", params.id);
    // Implement share logic
  };

  const handleExportData = () => {
    console.log("Export team data:", params.id);
    // Implement export logic
  };

  return (
    <Layout role="manager" userName={userName}>
      <TeamDetail
        mode="admin"
        teamData={team}
        players={playerz}
        id={id}
        stats={stats}
        isLoading={isLoading}
        error={error}
        onDeleteTeam={handleDeleteTeam}
        onEditTeam={handleEditTeam}
        onAddPlayer={handleAddPlayer}
        onShareTeam={handleShareTeam}
        onExportData={handleExportData}
        basePath="/manager/teams"
        title="Team Management"
        showBreadcrumb={true}
        className="mt-8"
      />
    </Layout>
  );
}
