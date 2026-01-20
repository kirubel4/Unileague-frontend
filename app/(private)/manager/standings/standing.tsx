"use client";
import { Layout } from "@/components/Layout";
import { ApiResponse, fetcher, getCookie } from "@/lib/utils";
import useSWR from "swr";
import { mapApiDataToTable } from "./util";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ListStartIcon } from "lucide-react";
type ManagerStandingsProps = {
  id?: string;
};

export default function ManagerStandings({ id }: ManagerStandingsProps) {
  const userName = getCookie("uName") || "Manager";
  const endpoint = id
    ? `/api/public/tournament/standings?id=${id}`
    : `/api/public/tournament/standings`;

  const { data, isLoading, error } = useSWR(endpoint, fetcher, {
    revalidateOnFocus: false,
  });
  const initStanding = async () => {
    toast.loading("initializing tournament standing", { id: "12" });
    const res = await fetch("/api/protected/manager/standing/init", {
      method: "GET",
    });
    const response: ApiResponse = await res.json();
    if (!response.success) {
      toast.error(response.message, { id: "12" });
      return;
    }
    toast.success(response.message || "initialized successfully", { id: "12" });
  };
  const standing = mapApiDataToTable(data?.data || []);

  const Content = (
    <>
      <div className="mb-8">
        <Toaster />
        <h1 className="text-3xl font-bold text-foreground">Standings</h1>
        <p className="text-muted-foreground mt-2">
          Current tournament rankings and statistics
        </p>
      </div>
      {!id ? (
        <div className="flex justify-end mb-6">
          <Button
            onClick={initStanding}
            className="
      relative overflow-hidden
      gap-2 px-6 py-2.5
      rounded-lg
      bg-linear-to-r from-blue-600 to-indigo-600
      text-white font-semibold
      shadow-md
      hover:shadow-lg hover:from-blue-700 hover:to-indigo-700
      active:scale-[0.98]
      transition-all
    "
          >
            <ListStartIcon className="w-4 h-4" />
            <span>
              {standing.length > 0
                ? "Reinitialize Standing"
                : "Initialize Standing"}
            </span>
          </Button>
        </div>
      ) : (
        <div />
      )}
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lineup requests...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600">Error Fetching Standing</p>
          </div>
        </div>
      )}
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
    </>
  );
  return id ? (
    Content
  ) : (
    <Layout role="manager" userName={userName}>
      {Content}
    </Layout>
  );
}
