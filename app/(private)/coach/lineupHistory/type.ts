// types/lineup-request.ts
export enum LineupReq {
  WAITING = "WAITING",
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface LineupRequest {
  id: string;
  state: LineupReq;
  submittedAt: Date | null;
  approvedAt: Date | null;
  approvedBy: {
    username: string;
  } | null;
  match: {
    id: string;
    date: Date;
    venue: string;
    homeTeam: {
      id: string;
      teamName: string;
      logo?: string;
    };
    awayTeam: {
      id: string;
      teamName: string;
      logo?: string;
    };
  };
}

export interface LineupRequestResponse {
  id: string;
  state: LineupReq;
  submittedAt: Date | null;
  approvedAt: Date | null;
  approvedBy: {
    username: string;
  } | null;
  match: {
    id: string;
    date: Date;
    venue: string;
    homeTeam: {
      id: string;
      teamName: string;
    };
    awayTeam: {
      id: string;
      teamName: string;
    };
  };
}

export function mapLineupRequestResponseToLineupRequest(
  response: LineupRequestResponse,
): LineupRequest {
  return {
    id: response.id,
    state: response.state as any, // This maps $Enums.LineupReq to LineupReq
    submittedAt: response.submittedAt ? new Date(response.submittedAt) : null,
    approvedAt: response.approvedAt ? new Date(response.approvedAt) : null,
    approvedBy: response.approvedBy,
    match: {
      id: response.match.id,
      date: new Date(response.match.date),
      venue: response.match.venue,
      homeTeam: {
        id: response.match.homeTeam.id,
        teamName: response.match.homeTeam.teamName,
        logo: `/teams/${response.match.homeTeam.id}/logo.png`, // Adjust path as needed
      },
      awayTeam: {
        id: response.match.awayTeam.id,
        teamName: response.match.awayTeam.teamName,
        logo: `/teams/${response.match.awayTeam.id}/logo.png`, // Adjust path as needed
      },
    },
  };
}
