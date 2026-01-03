"use client";

import {
  mapApiPlayersToPlayers,
  mapTeamApiToTeamData,
  mapTeamStats,
} from "@/app/(private)/manager/teams/[id]/util";
import { Player, TeamDetail } from "@/components/pages/teamDetail";
import { fetcher } from "@/lib/utils";
import {
  Shield,
  Target,
  Trophy,
  Users,
  Calendar,
  MapPin,
  Award,
  Star,
  TrendingUp,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export interface TeamData {
  id: string;
  name: string;
  coach: string;
  coachEmail: string;
  logo?: string;
  location?: string;
  foundedYear?: number;
  currentTournament?: string;
  achievements?: string[];
}

export default function AdminTeamDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [error, setError] = useState<string | null>(null);

  // Fetch team data
  const {
    data,
    error: err,
    isLoading,
  } = useSWR("/api/public/team/detail?id=" + id, fetcher, {
    revalidateOnFocus: false,
  });
  const team: TeamData = mapTeamApiToTeamData(data?.data);

  // Fetch players data
  const {
    data: players,
    error: erro,
    isLoading: loading,
  } = useSWR("/api/public/player/team?id=" + id, fetcher, {
    revalidateOnFocus: false,
  });
  const playerz: Player[] = mapApiPlayersToPlayers(players?.data);

  // Fetch team stats
  const {
    data: status,
    error: errors,
    isLoading: loadingsat,
  } = useSWR("/api/public/team/status?id=" + id, fetcher, {
    revalidateOnFocus: false,
  });
  const stats = mapTeamStats(status?.data);

  // Format stats or use defaults
  const teamStats = {
    totalMatches: stats?.matchesPlayed || 0,
    wins: stats?.wins || 0,
    draws: stats?.draws || 0,
    losses: stats?.losses || 0,
    goalsScored: stats?.goalsFor || 0,
    goalsConceded: stats?.goalsAgainst || 0,
    winRate:
      stats?.wins && stats?.matchesPlayed
        ? Math.round((stats.wins / stats.matchesPlayed) * 100)
        : 0,
  };

  return (
    <main>
      {/* Team Header Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />

        {/* Background overlay with team logo pattern */}
        {team?.logo && (
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${team.logo})` }}
            />
          </div>
        )}

        <div className="relative px-6 py-24 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
              {/* Team Logo */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
                  {team?.logo ? (
                    <img
                      src={team.logo}
                      alt={team?.name || "Team Logo"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Shield className="w-16 h-16 md:w-20 md:h-20 text-white/60" />
                  )}
                </div>
              </div>

              {/* Team Info */}
              <div className="flex-1">
                {/* Team Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                  <Shield className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    {team?.currentTournament || "ASTU Football Team"}
                  </span>
                </div>

                {/* Team Name */}
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                  {team?.name || "Loading Team..."}
                  {team?.foundedYear && (
                    <span className="text-xl md:text-2xl text-white/60 ml-3">
                      • Est. {team.foundedYear}
                    </span>
                  )}
                </h1>

                {/* Team Description */}
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl">
                  {team?.location ||
                    "Addis Ababa Science and Technology University"}
                  {team?.coach && ` • Coach: ${team.coach}`}
                </p>

                {/* Team Stats */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-white/80">
                    <Users className="w-5 h-5" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {playerz?.length || 0}
                      </div>
                      <div className="text-sm text-white/60">Players</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white/80">
                    <Target className="w-5 h-5" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {teamStats.wins}
                      </div>
                      <div className="text-sm text-white/60">Wins</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white/80">
                    <Trophy className="w-5 h-5" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {teamStats.winRate}%
                      </div>
                      <div className="text-sm text-white/60">Win Rate</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white/80">
                    <TrendingUp className="w-5 h-5" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {teamStats.goalsScored}
                      </div>
                      <div className="text-sm text-white/60">Goals</div>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 mt-6">
                  {team?.coach && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Coach: {team.coach}</span>
                    </div>
                  )}
                  {team?.location && (
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{team.location}</span>
                    </div>
                  )}
                  {team?.coachEmail && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{team.coachEmail}</span>
                    </div>
                  )}
                </div>

                {/* Achievements Badges */}
                {team?.achievements && team.achievements.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {team.achievements.slice(0, 3).map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30"
                      >
                        <Award className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-300">
                          {achievement}
                        </span>
                      </div>
                    ))}
                    {team.achievements.length > 3 && (
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                        <span className="text-xs text-white/80">
                          +{team.achievements.length - 3} more
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gradient transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto pb-12 px-4">
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
    </main>
  );
}
