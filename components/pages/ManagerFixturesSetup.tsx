import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export type TournamentFormat = "league" | "knockout";
export type Match = {
  week: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
};
export type Team = {
  id: number;
  name: string;
};

const MOCK_TEAMS: Team[] = [
  { id: 1, name: "Red Lions FC" },
  { id: 2, name: "Blue Warriors" },
  { id: 3, name: "Golden Eagles" },
  { id: 4, name: "Thunder United" },
  { id: 5, name: "Phoenix FC" },
  { id: 6, name: "Black Stars" },
  { id: 7, name: "City Rangers" },
  { id: 8, name: "Victory SC" },
];

type Props = {
  teams: Team[];
  format: TournamentFormat;
  setFormat: (v: TournamentFormat) => void;
  selectedTeams: number[];
  setSelectedTeams: React.Dispatch<React.SetStateAction<number[]>>;
  onNext: () => void;
};

export default function ManagerFixturesSetup({
  teams,
  format,
  setFormat,
  selectedTeams,
  setSelectedTeams,
  onNext,
}: Props) {
  const userName = localStorage.getItem("userName") || "Manager";

  const toggleTeam = (id: number) => {
    setSelectedTeams((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
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
      <div className="mb-6">
        <Link href="/manager/fixtures">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Fixtures
          </Button>
        </Link>

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
                format === "league"
                  ? "border-primary bg-blue-50"
                  : "border-border hover:border-primary"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={format === "league"}
                  onChange={() => setFormat("league")}
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
              onClick={onNext}
              disabled={!canContinue}
              className="w-full h-10"
            >
              Continue to Preview
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

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {MOCK_TEAMS.map((team) => (
              <label
                key={team.id}
                className="flex items-center gap-3 border rounded-md p-2 cursor-pointer hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={selectedTeams.includes(team.id)}
                  onChange={() => toggleTeam(team.id)}
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
