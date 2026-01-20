import { mapTeams } from "@/app/(private)/manager/players/transfer/util";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { fetcher, getCookie } from "@/lib/utils";

import Link from "next/link";
import { useState } from "react";
import { Toaster } from "sonner";
import useSWR from "swr";
export type LeagueConfig = {
  rounds: number;
  matchesPerWeek: number;
};
export type TournamentFormat = "League" | "knockout";
export type Match = {
  week: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
};

export type Team = {
  id: string;
  name: string;
};
type Props = {
  teams: Team[];
  format: TournamentFormat;
  setFormat: (v: TournamentFormat) => void;
  selectedTeams: Team[];
  setSelectedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  onNext: () => void;
  isLoading: boolean;
  error?: string |undefined;
};

export default function ManagerFixturesSetup({
  teams,
  error: err,
  format,
  setFormat,
  selectedTeams,
  setSelectedTeams,
  onNext,
  isLoading,
}: Props) {
  const userName = getCookie("uName") || "Manager";
  const {
    data,
    error,
    isLoading: load,
  } = useSWR("/api/public/team/tournament", fetcher, {
    revalidateOnFocus: false,
  });
  const [rounds, setRounds] = useState(1);
  const [matchesPerWeek, setMatchesPerWeek] = useState(1);

  const Teams: Team[] = mapTeams(data || { data: [] });

  const toggleTeam = (team: Team) => {
    setSelectedTeams((prev) =>
      prev.some((t) => t.id === team.id)
        ? prev.filter((t) => t.id !== team.id)
        : [...prev, team],
    );
  };

  // ---- validation rules (API-safe) ----
  const teamCount = selectedTeams.length;
  const hasMinimumTeams = teamCount >= 2;
  const knockoutValid = format !== "knockout" || teamCount % 2 === 0;

  const canContinue = hasMinimumTeams && knockoutValid;

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <Toaster />
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Setup Fixtures</h1>
        <p className="text-muted-foreground mt-1">
          Step 1 of 4: Tournament setup
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 bg-white border rounded-lg p-5 md:p-8">
          <h2 className="text-xl font-bold mb-6">Tournament Format</h2>

          <div className="space-y-4">
            {/* League */}
            <label
              className={`block border-2 rounded-lg p-5 cursor-pointer transition ${
                format === "League"
                  ? "border-primary bg-blue-50"
                  : "border-border hover:border-primary"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={format === "League"}
                  onChange={() => setFormat("League")}
                  className="mt-1"
                />
                <div>
                  <p className="font-semibold text-lg">League Format</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Each team plays every other team (home & away)
                  </p>
                  <ul className="mt-3 text-sm text-muted-foreground space-y-1">
                    <li>✓ Round-robin tournament</li>
                    <li>✓ Fair play for all teams</li>
                    <li>✓ Best for long seasons</li>
                  </ul>
                </div>
              </div>
              {format === "League" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Rounds</label>
                    <input
                      type="number"
                      min={1}
                      value={rounds}
                      onChange={(e) => setRounds(Number(e.target.value))}
                      className="mt-1 w-full border rounded px-2 py-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Matches per week
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={matchesPerWeek}
                      onChange={(e) =>
                        setMatchesPerWeek(Number(e.target.value))
                      }
                      className="mt-1 w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>
              )}
            </label>

            {/* Knockout */}
            <label
              className={`block border-2 rounded-lg p-5 cursor-pointer transition ${
                format === "knockout"
                  ? "border-primary bg-blue-50"
                  : "border-border hover:border-primary"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={format === "knockout"}
                  onChange={() => setFormat("knockout")}
                  className="mt-1"
                />
                <div>
                  <p className="font-semibold text-lg">Knockout Format</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Single elimination tournament
                  </p>
                  <ul className="mt-3 text-sm text-muted-foreground space-y-1">
                    <li>✓ Fast competition</li>
                    <li>✓ High intensity matches</li>
                    <li>✓ Quick path to finals</li>
                  </ul>
                </div>
              </div>
            </label>
          </div>

          {/* Validation message */}
          {!hasMinimumTeams && (
            <p className="mt-4 text-sm text-red-500">
              Select at least 2 teams to continue.
            </p>
          )}

          {format === "knockout" && !knockoutValid && (
            <p className="mt-2 text-sm text-red-500">
              Knockout format requires an even number of teams.
            </p>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => onNext()}
              disabled={!canContinue}
              className="w-full h-10"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Generating fixtures...
                </>
              ) : (
                "Continue to Preview"
              )}
            </Button>

            <Link href="/manager/fixtures">
              <Button variant="outline" className="w-full sm:w-auto h-10">
                Cancel
              </Button>
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white border rounded-lg p-5 md:p-6">
          <h2 className="text-lg font-bold mb-2">Registered Teams</h2>

          <p className="text-sm text-muted-foreground mb-4">
            Select teams to include
          </p>

          <div className="space-y-2  overflow-y-auto pr-1">
            {Teams?.map((team) => (
              <label
                key={team.id}
                className="flex items-center gap-3 border rounded-md p-2 cursor-pointer hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={selectedTeams.some((t) => t.id === team.id)}
                  onChange={() => toggleTeam(team)}
                />

                <span className="text-sm font-medium">{team.name}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Selected teams:{" "}
            <span className="font-semibold text-foreground">{teamCount}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
