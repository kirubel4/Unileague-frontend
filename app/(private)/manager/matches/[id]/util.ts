export type Team = {
  id: string;
  name: string;
};

export type MatchEvent = {
  id: string;
  minute: number;
  type: "Goal" | "Yellow" | "Red";
  player: { name: string };
  team: { teamName: string };
};

export type PlayerMatchStat = {
  playerId: string;
  goals: number;
  assists: number;
  yellow: number;
  red: number;
  minutes: number;
};

export type MatchDetail = {
  id: string;
  status: "UPCOMING" | "LIVE" | "FINISHED";
  scheduledDate: string;
  venue: string;

  homeTeam: Team;
  awayTeam: Team;

  score: {
    home: number;
    away: number;
  };

  events: MatchEvent[];
};
export function mapMatchDetail(apiData: any): MatchDetail {
  return {
    id: apiData?.id,
    status: apiData?.status,
    scheduledDate: apiData?.scheduledDate,
    venue: apiData?.venue,

    homeTeam: {
      id: apiData?.homeTeam?.id,
      name: apiData?.homeTeam?.teamName ?? "Unknown Team",
    },

    awayTeam: {
      id: apiData?.awayTeam?.id,
      name: apiData?.awayTeam?.teamName ?? "Unknown Team",
    },

    score: {
      home: apiData?.homeScore ?? 0,
      away: apiData?.awayScore ?? 0,
    },

    // ✅ SAFE ARRAY MAPPING
    events: Array.isArray(apiData?.events)
      ? apiData.events.map((e: any) => ({
          id: e.id,
          minute: e.minute,
          type: e.eventType,
          team: { teamName: e.team.teamName },
          player: { name: e.player.name },
        }))
      : [],

    // ✅ SAFE ARRAY MAPPING
  };
}
export function mapPlayerNames(apiResponse: any): string[] {
  return Array.isArray(apiResponse)
    ? apiResponse
        .map((p: any) => p?.name)
        .filter((name: any): name is string => typeof name === "string")
    : [];
}
