interface ApiTournament {
  id: string;
  managerId: string | null;
  tournamentName: string;
  startingDate: string;
  endingDate: string;
  description: string;
  venue: string;
  sponsor: string;
  status: string;
}

interface Tournament {
  id: string;
  tournamentName: string;
  startingDate: string;
  endingDate: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  teams?: number;
  managers?: number;
  logurl?: string;
}

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ApiTournament[];
}

export function mapTournaments(apiData: ApiResponse): Tournament[] {
  if (!apiData?.success || !Array.isArray(apiData?.data)) return [];

  return apiData.data.map(tournament => ({
    id: tournament.id,
    tournamentName: tournament.tournamentName ?? 'Unknown Tournament',
    startingDate: tournament.startingDate,
    endingDate: tournament.endingDate,
    status:
      tournament.status.toUpperCase() === 'ONGOING'
        ? 'ONGOING'
        : tournament.status.toUpperCase() === 'UPCOMING'
        ? 'UPCOMING'
        : 'COMPLETED',
    teams: 0, // default value if your backend doesn't provide it
    managers: 0, // default value if your backend doesn't provide it
    logurl: undefined, // default undefined
  }));
}
