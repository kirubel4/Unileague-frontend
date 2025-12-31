"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiResponse, fetcher, getCookie } from "@/lib/utils";
import {
  Trash2,
  Edit,
  Plus,
  Users,
  Search,
  Shield,
  Trophy,
  Filter,
  Download,
  MoreVertical,
  Eye,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { mapTeams, Team } from "../players/transfer/util";

export default function ManagerTeams() {
  const userName = getCookie("uName") || "Manager";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const {
    data,
    error,
    isLoading,
    mutate: teamMutate,
  } = useSWR("/api/public/team/tournament", fetcher, {
    revalidateOnFocus: false,
  });

  const teams: Team[] = mapTeams(data || { data: [] });
  const filteredTeams = teams?.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.coachName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeams.length === filteredTeams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(filteredTeams.map((team) => team.id));
    }
  };

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this team? This action cannot be undone."
      )
    ) {
      return;
    }

    const res = await fetch(`/api/protected/manager/team/delete?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const response: ApiResponse = await res.json();
    if (!response.success) {
      console.log(response.message);
      return;
    }
    console.log("deleted");
    await teamMutate();
  }

  async function handleBulkDelete() {
    if (selectedTeams.length === 0) return;
    if (
      !confirm(
        `Are you sure you want to delete ${selectedTeams.length} selected teams?`
      )
    ) {
      return;
    }
    // Implement bulk delete logic here
  }

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Team Management
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage and organize tournament teams, players, and coaches
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/manager/teams/create">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md">
                <Plus className="w-4 h-4" />
                Register New Team
              </Button>
            </Link>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Teams
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {teams?.length || 0}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Players
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {teams?.reduce((sum, team) => sum + team.playerCount, 0) || 0}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Coaches
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {teams?.filter((t) => t.coachName).length || 0}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Avg. Players/Team
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {teams?.length
                  ? Math.round(
                      teams.reduce((sum, team) => sum + team.playerCount, 0) /
                        teams.length
                    )
                  : 0}
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <UserPlus className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search teams by name, coach, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg h-10"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>

            {selectedTeams.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedTeams.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading teams...</p>
            </div>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 text-red-800 mb-3">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium">Error loading teams</p>
              </div>
              <p className="text-sm text-red-600">
                Please try refreshing the page or check your connection.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => teamMutate()}
              >
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        selectedTeams.length === filteredTeams.length &&
                        filteredTeams.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {selectedTeams.length > 0
                        ? `${selectedTeams.length} selected`
                        : `${filteredTeams.length} teams`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Sorted by: Name
                  </span>
                </div>
              </div>
            </div>

            {/* Teams List */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-border">
                  <tr>
                    <th className="py-4 px-6 text-left">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Team
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Coach
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Contact
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Players
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams?.length > 0 ? (
                    filteredTeams.map((team) => (
                      <tr
                        key={team.id}
                        className="border-b border-border hover:bg-gray-50 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedTeams.includes(team.id)}
                              onChange={() => handleSelectTeam(team.id)}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground">
                                  {team.name}
                                </p>
                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                  ID: {team.id.slice(0, 8)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Registered{" "}
                                {new Date().toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-foreground">
                              {team.coachName}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Head Coach
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <a
                              href={`mailto:${team.coachEmail}`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {team.coachEmail}
                            </a>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {team.playerCount} players
                              </p>
                              <Link
                                href={`/manager/teams/${team.id}/players`}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                View roster →
                              </Link>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Link href={`/manager/teams/${team.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>

                            <Link href={`/manager/teams/${team.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => handleDelete(team.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 px-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            No teams found
                          </h3>
                          <p className="text-gray-500 max-w-md mx-auto mb-6">
                            {searchTerm
                              ? "No teams match your search criteria. Try a different search term."
                              : "No teams have been registered yet. Register your first team to get started."}
                          </p>
                          {!searchTerm && (
                            <Link href="/manager/teams/create">
                              <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Register First Team
                              </Button>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination/Footer */}
            {filteredTeams.length > 0 && (
              <div className="px-6 py-4 border-t border-border bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredTeams.length} of {teams.length} teams
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-50 border-blue-200 text-blue-600"
                    >
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
