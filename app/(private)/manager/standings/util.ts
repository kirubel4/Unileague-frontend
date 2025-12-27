type ApiTeamData = {
  id: string;
  tournamentId: string;
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  rank: number | null;
  form: string | null;
  team: {
    teamName: string;
  };
};

type MappedTeamData = {
  rank: number;
  team: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export function mapApiDataToTable(data: ApiTeamData[]): MappedTeamData[] {
  // Sort by points descending, then goal difference, then goals for
  const sorted = [...data].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return sorted.map((team, index) => ({
    rank: index + 1,
    team: team.team.teamName,
    matches: team.played,
    wins: team.wins,
    draws: team.draws,
    losses: team.losses,
    goalsFor: team.goalsFor,
    goalsAgainst: team.goalsAgainst,

    points: team.points,
  }));
}
