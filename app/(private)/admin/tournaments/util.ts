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
  _count?: {
    teams?: number;
    managers?: number;
  };
  logo?: string;
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

export function mapTournaments(apiData: ApiResponse & { data: any[] }): Tournament[] {
  if (!apiData?.success || !Array.isArray(apiData?.data)) return [];

  return apiData.data.map(t => ({
    id: t.id,
    tournamentName: t.tournamentName ?? 'Unknown Tournament',
    startingDate: t.startingDate,
    endingDate: t.endingDate,
    status:
      t.status.toUpperCase() === 'ONGOING'
        ? 'ONGOING'
        : t.status.toUpperCase() === 'UPCOMING'
        ? 'UPCOMING'
        : 'COMPLETED',
    teams: t._count?.teams ?? 0,
    managers: t._count?.managers ?? 0,
    logurl: t.logo ?? undefined,
  }));
}
