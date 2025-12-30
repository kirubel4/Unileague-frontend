"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiResponse, fetcher, getCookie } from "@/lib/utils";

import { Trash2, Edit, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { mapPlayers, Player } from "./util";

export default function ManagerPlayers() {
  const userName = getCookie("uName") || "Manager";
  const [searchTerm, setSearchTerm] = useState("");
  var players: Player[] = [];
  const {
    data,
    isLoading,
    error,
    mutate: mutatePlayer,
  } = useSWR("/api/public/player/tournament", fetcher, {
    revalidateOnFocus: false,
  });
  players = mapPlayers(data?.data || []);
  const filteredPlayers = players.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.team.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/protected/manager/player/delete?id=${id}`, {
      method: "DELETE",
    });
    const result: ApiResponse = await res.json();
    if (!result.success) {
      console.log("Delete failed:", result.message);
      return;
    }
    console.log("Delete successful");
    await mutatePlayer();
  };

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Players</h1>
          <p className="text-muted-foreground mt-1">
            Manage tournament players
          </p>
        </div>
        <Link href="/manager/players/create">
          <Button className="bg-primary hover:bg-blue-600 text-white rounded-lg gap-2 h-10">
            <Plus className="w-4 h-4" />
            Add Player
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-border p-4 mb-6">
        <Input
          type="text"
          placeholder="Search by player name or team..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg h-9"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Player Name
                </th>

                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Position
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Team
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Number
                </th>

                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player) => (
                  <tr
                    key={player.id}
                    className="border-b border-border hover:bg-muted transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-foreground">
                      {player.name}
                    </td>

                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {player.position}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {player.team}
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-primary">
                      #{player.number}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/manager/players/${player.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 h-8 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link
                          href={`/manager/players/transfer?id=${
                            player.id
                          }&playerName=${encodeURIComponent(
                            player.name
                          )}&teamName=${encodeURIComponent(player.team)}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 h-8 rounded"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 h-8 rounded text-destructive hover:bg-red-50"
                          onClick={() => handleDelete(player.id)}
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
                    No players found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
