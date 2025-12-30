"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiResponse, fetcher, getCookie } from "@/lib/utils";

import { Trash2, Edit, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { mapTeams, Team } from "../players/transfer/util";
export default function ManagerTeams() {
  const userName = getCookie("uName") || "Manager";
  const [searchTerm, setSearchTerm] = useState("");

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

  async function handleDelete(id: string) {
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
    return;
  }

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teams</h1>
          <p className="text-muted-foreground mt-1">Manage tournament teams</p>
        </div>
        <Link href="/manager/teams/create">
          <Button className="bg-primary hover:bg-blue-600 text-white rounded-lg gap-2 h-10">
            <Plus className="w-4 h-4" />
            Register Team
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-border p-4 mb-6">
        <Input
          type="text"
          placeholder="Search by team name or coach..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg h-9"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading teams...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-destructive">
              Error fetching teams
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                    Team Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                    Coach
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                    Players
                  </th>

                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams?.length > 0 ? (
                  filteredTeams?.map((team) => (
                    <tr
                      key={team.id}
                      className="border-b border-border hover:bg-muted transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        {team.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {team.coachName}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {team.coachEmail}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {team.playerCount}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link href={`/manager/teams/${team.id}/edit`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 h-8 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 h-8 rounded text-destructive hover:bg-red-50"
                            onClick={() => handleDelete(team.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 px-4 text-center text-muted-foreground"
                    >
                      No teams found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
