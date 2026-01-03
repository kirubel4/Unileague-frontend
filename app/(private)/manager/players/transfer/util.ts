interface ApiTeamWrapper {
  team: {
    id: string;
    teamName: string;
    coachName?: string | null;
    coachEmail?: string | null;
    power?: number;
  };
  id: string; // top-level id
  playerCount?: number;
  logo?: { url: string }[]; // array of logos
}

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ApiTeamWrapper[];
}

export interface Team {
  id: string;
  name: string;
  coachName: string;
  coachEmail: string;
  playerCount: number;
  logoUrl: string;
  power: number;
}

export function mapTeams(apiResponse: ApiResponse): Team[] {
  return apiResponse?.data?.map((item) => ({
    id: item.team.id,
    name: item.team.teamName,
    coachName: item.team.coachName ?? "",
    coachEmail: item.team.coachEmail ?? "",
    playerCount: item.playerCount ?? 0,
    logoUrl:
      item.logo && item.logo.length > 0
        ? item.logo[0].url
        : "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=400&fit=crop",
    power: item.team.power ?? 0,
  }));
}
