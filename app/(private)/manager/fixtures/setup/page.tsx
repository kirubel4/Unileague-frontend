"use client";
import ManagerFixturesConfirm from "@/components/pages/ManagerFixturesConfirm";
import ManagerFixturesPreview from "@/components/pages/ManagerFixturesPreview";
import ManagerFixturesSetup, {
  Team,
} from "@/components/pages/ManagerFixturesSetup";
import { useState } from "react";

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

const generateFixture = async (
  tournamentType: "League" | "knockout",
  round: number,
  matchesPerWeek: number,
  startingDate: string,
  teams: Team[]
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
      console.log("somting went wrong ");
      return [];
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.log("somting went wron gcathced ");
    return [];
  }
};

export default function ManagerFixturesWizard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<"setup" | "preview" | "confirm">("setup");
  const [teams] = useState<Team[]>([]);
  const [format, setFormat] = useState<TournamentFormat>("League");
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<MatchWeekPreview[] | []>([]);

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
                selectedTeams
              )
            );
            setStep("preview");
            setIsGenerating(false);
          }}
        />
      )}

      {step === "preview" && (
        <ManagerFixturesPreview
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
