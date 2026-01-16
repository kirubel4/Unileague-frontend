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
export function mapPlayerNames(
  apiResponse: any[],
): { id: string; name: string; number: number; position: string }[] {
  if (!Array.isArray(apiResponse)) return [];

  return apiResponse
    .map((p) => ({
      id: p?.id,
      name: p?.name,
      number: p?.number,
      position: p?.position,
    }))
    .filter(
      (
        p,
      ): p is { id: string; name: string; number: number; position: string } =>
        typeof p.id === "string" && typeof p.name === "string",
    );
}
export function lineUpMapperStarting(apiResponse: any) {
  if (!apiResponse || !Array.isArray(apiResponse.starting)) return [];
  return apiResponse.starting.map((p: any) => ({
    id: p?.player?.id,
    name: p?.player?.name,
    number: p?.player?.number,
    position: p?.position,
    role: p?.role,
    isCaptain: p?.isCaptain,
  }));
}
export function lineUpMapperBench(apiResponse: any) {
  if (!apiResponse || !Array.isArray(apiResponse.bench)) return [];
  return apiResponse.bench.map((p: any) => ({
    id: p?.player?.id,
    name: p?.player?.name,
    number: p?.player?.number,
    position: p?.position,
    role: p?.role,
    isCaptain: p?.isCaptain,
  }));
}
