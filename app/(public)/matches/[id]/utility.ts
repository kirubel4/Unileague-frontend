export interface MatchEvent {
  id: string;
  minute: number;
  type: "GOAL" | "CARD" | "SUBSTITUTION" | "PENALTY" | "INJURY";
  playerName: string;
  team: "HOME" | "AWAY";
  details?: string;
  cardType?: "YELLOW" | "RED";
  playerOut?: string;
  playerIn?: string;
}

export interface MatchData {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    shortName: string;
    logo?: string;
    color: string;
  };
  awayTeam: {
    id: string;
    name: string;
    shortName: string;
    logo?: string;
    color: string;
  };
  score: {
    home: number;
    away: number;
  };
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  dateTime: string;
  venue: string;
  tournament: string;
  round: string;
  referee: string;
  events: MatchEvent[];
  statistics: {
    possession: { home: number; away: number };
    shots: { home: number; away: number };
    shotsOnTarget: { home: number; away: number };
    corners: { home: number; away: number };
    fouls: { home: number; away: number };
    offsides: { home: number; away: number };
    yellowCards: { home: number; away: number };
    redCards: { home: number; away: number };
  };
}

function mapMatchStatus(status: string): MatchData["status"] {
  switch (status) {
    case "LIVE":
      return "ONGOING";
    case "FINISHED":
      return "COMPLETED";
    case "CANCELLED":
      return "CANCELLED";
    default:
      return "UPCOMING";
  }
}
function mapEventType(eventType: string): MatchEvent["type"] {
  switch (eventType) {
    case "Goal":
      return "GOAL";
    case "Yellow":
    case "Red":
      return "CARD";
    default:
      return "INJURY";
  }
}
function mapMatchEvent(event: any, homeTeamName: string): MatchEvent {
  const isHome = event.team?.teamName === homeTeamName;

  return {
    id: event.id,
    minute: event.minute,
    type: mapEventType(event.eventType),
    playerName: event.player?.name ?? "Unknown",
    team: isHome ? "HOME" : "AWAY",
    cardType:
      event.eventType === "Yellow"
        ? "YELLOW"
        : event.eventType === "Red"
        ? "RED"
        : undefined,
    details: event.eventType,
  };
}
export function mapMatchApiToMatchData(apiResponse: any): MatchData {
  const match = apiResponse?.data;

  return {
    id: match?.id,

    homeTeam: {
      id: match?.homeTeam.id,
      name: match?.homeTeam.teamName,
      shortName: match?.homeTeam.teamName.slice(0, 3).toUpperCase(),
      color: "#1E3A8A", // TEMP (should come from team API)
    },

    awayTeam: {
      id: match?.awayTeam.id,
      name: match?.awayTeam.teamName,
      shortName: match?.awayTeam.teamName.slice(0, 3).toUpperCase(),
      color: "#7C2D12", // TEMP
    },

    score: {
      home: match?.homeScore ?? 0,
      away: match?.awayScore ?? 0,
    },

    status: mapMatchStatus(match?.status),

    dateTime: match?.scheduledDate,
    venue: match?.venue,
    tournament: match?.tournament.tournamentName,
    round: `Week ${match?.matchWeek}`,
    referee: match?.referee ?? "TBD",

    events: (match?.events ?? []).map((event: any) =>
      mapMatchEvent(event, match?.homeTeam.teamName)
    ),

    statistics: {
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 },
      offsides: { home: 0, away: 0 },
      yellowCards: { home: 0, away: 0 },
      redCards: { home: 0, away: 0 },
    },
  };
}
