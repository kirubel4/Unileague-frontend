import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Match, TournamentFormat } from "./ManagerFixturesSetup";

type Props = {
  format: TournamentFormat;
  selectedTeams: number[];
  matches: Match[];
  setMatches: (m: Match[]) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function ManagerFixturesPreview({
  format,
  selectedTeams,
  matches,
  onNext,
  onBack,
}: Props) {
  const userName = localStorage.getItem("userName") || "Manager";

  // ---- safety guard ----
  if (!matches || matches.length === 0) {
    return (
      <Layout role="manager" userName={userName}>
        <div className="p-6 bg-muted rounded-lg text-center">
          <p className="text-muted-foreground mb-4">
            No fixtures generated yet. Please complete the setup first.
          </p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  // ---- derive weeks dynamically ----
  const weeks = Array.from(new Set(matches.map((m) => m.week))).sort(
    (a, b) => a - b,
  );

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Fixtures
        </Button>

        <h1 className="text-3xl font-bold text-foreground">Fixtures Preview</h1>
        <p className="text-muted-foreground mt-2">
          Step 2 of 4: Review generated fixtures
        </p>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Preview:</span> {matches.length}{" "}
          matches generated in <span className="capitalize">{format}</span>{" "}
          format for {selectedTeams.length} teams.
        </p>
      </div>

      {/* Matches */}
      <div className="space-y-8 mb-8">
        {weeks.slice(0, 2).map((week) => {
          const weekMatches = matches.filter((m) => m.week === week);

          return (
            <div key={week}>
              <h3 className="text-lg font-bold text-foreground mb-4">
                Week {week}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weekMatches.map((match, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg border border-border p-4"
                  >
                    <p className="text-xs text-muted-foreground mb-3">
                      {match.date}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground flex-1">
                        {match.homeTeam}
                      </span>

                      <span className="text-muted-foreground px-2">vs</span>

                      <span className="font-medium text-foreground flex-1 text-right">
                        {match.awayTeam}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onNext}
          className="flex-1 bg-primary text-white rounded-lg h-10"
        >
          Continue to Confirm
        </Button>

        <Button variant="outline" onClick={onBack} className="rounded-lg h-10">
          Back
        </Button>
      </div>
    </Layout>
  );
}
