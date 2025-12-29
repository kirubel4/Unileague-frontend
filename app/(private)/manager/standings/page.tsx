"use client";
import { Layout } from "@/components/Layout";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { mapApiDataToTable } from "./util";

export default function ManagerStandings() {
  const userName = localStorage.getItem("userName") || "Manager";
  const { data, isLoading, error } = useSWR(
    "/api/public/tournament/standings?id=fb1c80f4-7ffc-4b84-b329-d08511349fa2",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const standing = mapApiDataToTable(data?.data || []);

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Standings</h1>
        <p className="text-muted-foreground mt-2">
          Current tournament rankings and statistics
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground w-12">
                  Rank
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Team
                </th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                  MP
                </th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                  W
                </th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                  D
                </th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                  L
                </th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                  GF
                </th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                  GA
                </th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Pts
                </th>
              </tr>
            </thead>
            <tbody>
              {standing.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-border ${
                    idx < 2
                      ? "bg-green-50"
                      : idx < 4
                      ? "bg-blue-50"
                      : "hover:bg-muted"
                  } transition-colors`}
                >
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        row.rank === 1
                          ? "bg-yellow-400 text-white"
                          : row.rank === 2
                          ? "bg-gray-300 text-white"
                          : row.rank === 3
                          ? "bg-orange-400 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">
                    {row.team}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                    {row.matches}
                  </td>
                  <td className="py-3 px-4 text-center text-sm font-semibold text-foreground">
                    {row.wins}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                    {row.draws}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                    {row.losses}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                    {row.goalsFor}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                    {row.goalsAgainst}
                  </td>
                  <td className="py-3 px-4 text-center text-sm font-bold text-primary">
                    {row.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground font-medium">Legend</p>
          <div className="space-y-2 mt-3 text-xs">
            <div className="flex gap-2 items-center">
              <span className="w-4 h-4 bg-yellow-400 rounded-full"></span>
              <span>Champion</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="w-4 h-4 bg-gray-300 rounded-full"></span>
              <span>Runner-up</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="w-4 h-4 bg-orange-400 rounded-full"></span>
              <span>Third Place</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground font-medium">
            Abbreviations
          </p>
          <div className="space-y-1 mt-3 text-xs">
            <p>
              <span className="font-semibold">MP</span> - Matches Played
            </p>
            <p>
              <span className="font-semibold">W</span> - Wins
            </p>
            <p>
              <span className="font-semibold">D</span> - Draws
            </p>
            <p>
              <span className="font-semibold">L</span> - Losses
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-4 md:col-span-2">
          <p className="text-sm text-muted-foreground font-medium">
            Points System
          </p>
          <div className="space-y-1 mt-3 text-xs">
            <p>
              <span className="font-semibold">Win</span> - 3 points
            </p>
            <p>
              <span className="font-semibold">Draw</span> - 1 point
            </p>
            <p>
              <span className="font-semibold">Loss</span> - 0 points
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
