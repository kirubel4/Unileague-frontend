"use client";
import ManagerFixturesConfirm from "@/components/pages/ManagerFixturesConfirm";
import ManagerFixturesPreview from "@/components/pages/ManagerFixturesPreview";
import ManagerFixturesSetup, {
  Team,
} from "@/components/pages/ManagerFixturesSetup";
import { useState } from "react";

export type TournamentFormat = "league" | "knockout";

export type Match = {
  week: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
};
export function generateFixtures(
  teams: Team[],
  format: TournamentFormat,
  selectedTeamIds: number[]
): Match[] {
  if (selectedTeamIds.length < 2) return [];

  const selectedTeams = selectedTeamIds
    .map((id) => teams.find((t) => t.id === id))
    .filter(Boolean) as Team[];

  const matches: Match[] = [];
  let week = 1;

  for (let i = 0; i < selectedTeams.length; i++) {
    for (let j = i + 1; j < selectedTeams.length; j++) {
      matches.push({
        week,
        homeTeam: selectedTeams[i].name,
        awayTeam: selectedTeams[j].name,
        date: `Week ${week}`,
      });
      week++;
    }
  }

  return matches;
}

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

export default function ManagerFixturesWizard() {
  const [step, setStep] = useState<"setup" | "preview" | "confirm">("setup");
  const [teams] = useState<Team[]>(MOCK_TEAMS);
  const [format, setFormat] = useState<TournamentFormat>("league");
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  return (
    <>
      {step === "setup" && (
        <ManagerFixturesSetup
          teams={teams}
          format={format}
          setFormat={setFormat}
          selectedTeams={selectedTeams}
          setSelectedTeams={setSelectedTeams}
          onNext={() => {
            const generated = generateFixtures(teams, format, selectedTeams);

            setMatches(generated);
            setStep("preview");
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
