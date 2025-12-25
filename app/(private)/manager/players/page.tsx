"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Trash2, Edit, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Player {
  id: number;
  name: string;
  age: number;
  position: string;
  team: string;
  number: number;
  joinDate: string;
}

export default function ManagerPlayers() {
  const userName = localStorage.getItem("userName") || "Manager";
  const [searchTerm, setSearchTerm] = useState("");

  const players: Player[] = [
    {
      id: 1,
      name: "Alex Johnson",
      age: 28,
      position: "Goalkeeper",
      team: "Tigers United",
      number: 1,
      joinDate: "Jan 10, 2024",
    },
    {
      id: 2,
      name: "Mike Smith",
      age: 25,
      position: "Defender",
      team: "Tigers United",
      number: 4,
      joinDate: "Jan 10, 2024",
    },
    {
      id: 3,
      name: "David Wilson",
      age: 26,
      position: "Midfielder",
      team: "Phoenix FC",
      number: 8,
      joinDate: "Jan 12, 2024",
    },
    {
      id: 4,
      name: "James Brown",
      age: 23,
      position: "Forward",
      team: "Eagles Sports",
      number: 9,
      joinDate: "Jan 15, 2024",
    },
  ];

  const filteredPlayers = players.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  Age
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
                  Join Date
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
                      {player.age}
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
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {player.joinDate}
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
                        <Link href={`/manager/players/${player.id}/transfer`}>
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
                          onClick={() => alert("Delete player: " + player.name)}
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
