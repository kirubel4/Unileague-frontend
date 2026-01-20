import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

import { Team, TournamentFormat } from "./ManagerFixturesSetup";
import { MatchWeekPreview } from "@/app/(private)/manager/fixtures/setup/page";
import { getCookie } from "@/lib/utils";

type Props = {
  format: TournamentFormat;
  selectedTeams: Team[];
  matches: MatchWeekPreview[];
  setMatches: (m: MatchWeekPreview[]) => void;
  onNext: () => void;
  onBack: () => void;
  error?: string | undefined;
};

export default function ManagerFixturesPreview({
  error,
  format,
  selectedTeams,
  matches,
  onNext,
  onBack,
}: Props) {
  const userName = getCookie("uName") || "Manager";

  // ---- safety guard ----
  if (!matches || matches.length === 0) {
    return (
      <Layout role="manager" userName={userName}>
        <div className="p-6 bg-muted rounded-lg text-center">
          <p className="text-muted-foreground mb-4">
            No fixtures generated yet. Please complete the setup first.
          </p>
          <>
            <p>{error}</p>
          </>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </Layout>
    );
  }
  console.log(selectedTeams);
  // ---- derive weeks dynamically ----

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Fixtures Preview</h1>
        <p className="text-muted-foreground mt-2">
          Step 2 of 4: Review generated fixtures
        </p>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Preview:</span>{" "}
          {matches.reduce((acc, w) => acc + w.matches.length, 0)} matches •{" "}
          <span className="capitalize">{format}</span> format •{" "}
          {selectedTeams.length} teams
        </p>
      </div>

      {/* Weeks */}
      <div className="space-y-8 mb-8">
        {matches.map((week) => (
          <div key={week.matchWeek}>
            <h3 className="text-lg font-bold mb-4">
              {format === "League"
                ? `Match Week ${week.matchWeek}`
                : `Round ${week.matchWeek}`}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {week.matches.map((match, idx) => (
                <div key={idx} className="bg-white rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    {match.date
                      ? new Date(match.date).toDateString()
                      : "Date TBD"}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="font-medium flex-1">
                      {match.homeTeamName}
                    </span>

                    <span className="px-2 text-muted-foreground">vs</span>

                    <span className="font-medium flex-1 text-right">
                      {match.awayTeamName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex-col gap-3">
        <Button
          onClick={onNext}
          variant="outline"
          className="flex-1 bg-primary text-white"
        >
          Continue to Confirm
        </Button>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </Layout>
  );
}
