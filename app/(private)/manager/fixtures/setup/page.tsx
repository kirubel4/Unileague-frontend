"use client";
import ManagerFixturesConfirm from "@/app/(private)/manager/fixtures/setup/ManagerFixturesConfirm";
import ManagerFixturesPreview from "@/components/pages/ManagerFixturesPreview";
import ManagerFixturesSetup, {
  Team,
} from "@/components/pages/ManagerFixturesSetup";
import { ApiResponse } from "@/lib/utils";
import { useState } from "react";

import { toast } from "sonner";

export type TournamentFormat = "League" | "knockout";
export interface MatchWeekPreview {
  matchWeek: number;
  matches: MatchPreview[];
}
export interface MatchPreview {
  homeTeamId: string; // later you can switch to UUID
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  date?: string; // ISO date string (API-safe)
}

export default function ManagerFixturesWizard() {
  const [error, setError] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<"setup" | "preview" | "confirm">("setup");
  const [teams] = useState<Team[]>([]);
  const [format, setFormat] = useState<TournamentFormat>("League");
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<MatchWeekPreview[] | []>([]);
  const generateFixture = async (
    tournamentType: "League" | "knockout",
    round: number,
    matchesPerWeek: number,
    startingDate: string,
    teams: Team[],
  ): Promise<MatchWeekPreview[]> => {
    try {
      const res = await fetch("/api/protected/manager/match/generateFixture", {
        method: "POST",
        body: JSON.stringify({
          tournamentType,
          round,
          matchesPerWeek,
          startingDate,
          teams,
        }),
      });

      if (!res) {
        toast.error("network error try again", { id: "44" });
        console.log("somting went wron gcathced aa");
        return [];
      }

      const data: ApiResponse = await res.json();
      if (!data.success) {
        console.log(data.message);
        setError(data?.message ?? "");
        toast.error(data.message ?? "network error try again", { id: "44" });
        return [];
      }
      return data.data;
    } catch (error) {
      console.log("somting went wron gcathced ");
      return [];
    }
  };
  return (
    <>
      {step === "setup" && (
        <ManagerFixturesSetup
          teams={teams}
          format={format}
          setFormat={setFormat}
          selectedTeams={selectedTeams}
          setSelectedTeams={setSelectedTeams}
          isLoading={isGenerating}
          onNext={async () => {
            setIsGenerating(true);
            setMatches(
              await generateFixture(
                format,
                2,
                4,
                "2025-01-15T00:00:00.000Z",
                selectedTeams,
              ),
            );
            setStep("preview");
            setIsGenerating(false);
          }}
        />
      )}

      {step === "preview" && (
        <ManagerFixturesPreview
          error={error}
          format={format}
          selectedTeams={selectedTeams}
          matches={matches}
          setMatches={setMatches}
          onNext={() => setStep("confirm")}
          onBack={() => setStep("setup")}
        />
      )}

      {step === "confirm" && (
        <ManagerFixturesConfirm
          format={format}
          selectedTeams={selectedTeams}
          matches={matches}
          onBack={() => setStep("preview")}
        />
      )}
    </>
  );
}
