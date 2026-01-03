export type TournamentStatus =
  | "UPCOMING"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";

export interface TournamentUI {
  id: string;
  tournamentName: string;
  startingDate: string;
  endingDate: string;
  status: TournamentStatus;
  teams: number;
  logurl?: string | null;
  description?: string | null;
  location?: string | null;
  organizer?: string | null;
  prize?: string | null;
}
function mapTournamentStatus(status: string): TournamentStatus {
  switch (status) {
    case "UPCOMING":
      return "UPCOMING";
    case "ONGOING":
      return "ONGOING";
    case "COMPLETED":
      return "COMPLETED";
    case "CANCELLED":
      return "CANCELLED";
    default:
      return "UPCOMING";
  }
}

export function mapTournamentApiToUI(apiResponse: any): any {
  if (!apiResponse?.data) return [];

  const t = apiResponse?.data;

  return {
    id: t?.id ?? "",
    tournamentName: t?.tournamentName ?? "Unknown Tournament",

    startingDate: t?.startingDate
      ? new Date(t.startingDate).toISOString().split("T")[0]
      : "",

    endingDate: t?.endingDate
      ? new Date(t.endingDate).toISOString().split("T")[0]
      : "",

    status: mapTournamentStatus(t?.status),

    teams: t?.teamCount ?? 0,

    logurl:
      t?.logoUrl ??
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=1600&h=600&fit=crop",

    description: t?.description ?? null,

    location: t?.venue ?? null,

    organizer: null, // not provided by API yet

    prize: null, // not provided by API yet
  };
}
export interface RegisteredTeam {
  id: string;
  teamId: string;
  playerCount: number;
  logo: string;
  team: {
    id: string;
    teamName: string;
    coachName: string | null;
    power: number;
  };
}
