interface ApiResponseTeam {
  team: {
    id: string;
    teamName: string;
    players: {
      id: string;
      name: string;
      position: string;
      number: number;
    }[];
  };
}

export interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  number: number;
}

export function mapPlayers(apiData: ApiResponseTeam[]): Player[] {
  return apiData.flatMap(({ team }) =>
    team.players.map((player) => ({
      id: player.id,
      name: player.name,
      position: player.position,
      number: player.number,
      team: team.teamName,
    }))
  );
}
