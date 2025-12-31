import { Player, TeamData } from "@/components/pages/teamDetail";

type ApiTeamResponse = {
  id: string;
  teamName: string;
  coachName: string;
  coachEmail: string;
  power: number;
  logo: {
    url: string;
    isPrimary: boolean;
    usage: string;
  }[];
};
export function mapTeamApiToTeamData(apiTeam: ApiTeamResponse): TeamData {
  // Check if apiTeam is valid and has the necessary properties

  const primaryLogo =
    apiTeam?.logo?.find((l) => l.isPrimary)?.url ??
    apiTeam?.logo?.[0]?.url ??
    "";

  return {
    id: apiTeam?.id,
    name: apiTeam?.teamName,
    coach: apiTeam?.coachName,
    coachEmail: apiTeam?.coachEmail,
    logo: primaryLogo,
  };
}
type ApiPlayer = {
  id: string;
  name: string;
  position: string; // "GK", "DF", "MF", "FW"
  number: number;
  teamId: string;
  team?: {
    teamName: string;
  };
  avatar: string | null;
};
const POSITION_MAP: Record<string, string> = {
  GK: "Goalkeeper",
  DF: "Defender",
  MF: "Midfielder",
  FW: "Forward",
};

export function mapApiPlayerToPlayer(apiPlayer: ApiPlayer): Player {
  return {
    id: apiPlayer?.id,
    name: apiPlayer?.name,
    number: apiPlayer?.number,
    position:
      POSITION_MAP[apiPlayer?.position] ?? apiPlayer?.position ?? "Unknown",
  };
}
export function mapApiPlayersToPlayers(apiPlayers: ApiPlayer[] = []): Player[] {
  return apiPlayers?.map(mapApiPlayerToPlayer);
}
function parseScheduledDate(scheduledDate: string) {
  // "03:00 15/10/23"
  const [time, date] = scheduledDate.split(" ");
  const [day, month, year] = date.split("/");

  return {
    time,
    date: `20${year}-${month}-${day}`, // → 2023-10-15
  };
}
export type MatchResult = "W" | "D" | "L";

export interface TeamStats {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: string; // formatted
  points: number;
  position: number;
  form: MatchResult[];
}
export interface TeamStatsApiResponse {
  id?: string;
  teamName?: string;
  matchesPlayed?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  yellowCards?: number;
  readCards?: number;
}
export function mapTeamStats(apiData?: TeamStatsApiResponse): TeamStats {
  // Safe fallbacks
  const matchesPlayed = apiData?.matchesPlayed ?? 0;
  const wins = apiData?.wins ?? 0;
  const draws = apiData?.draws ?? 0;
  const losses = apiData?.losses ?? 0;
  const goalsFor = apiData?.goalsFor ?? 0;
  const goalsAgainst = apiData?.goalsAgainst ?? 0;

  // Goal difference formatting (+ / -)
  const goalDiffNumber = apiData?.goalDifference ?? goalsFor - goalsAgainst;

  const goalDifference =
    goalDiffNumber > 0 ? `+${goalDiffNumber}` : `${goalDiffNumber}`;

  // Football standard points calculation
  const points = wins * 3 + draws;

  return {
    matchesPlayed,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference,

    // Not provided by backend → safe defaults
    points,
    position: 0, // unknown ranking
    form: [], // can be filled later when match history exists
  };
}
