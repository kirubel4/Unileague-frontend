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
    scheduledDate: Date;
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
    scheduledDate: Date;
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
    state: response.state,
    submittedAt: response.submittedAt ? new Date(response.submittedAt) : null,
    approvedAt: response.approvedAt ? new Date(response.approvedAt) : null,
    approvedBy: response.approvedBy,
    match: {
      id: response.match.id,
      scheduledDate: new Date(response.match.scheduledDate),
      venue: response.match.venue,
      homeTeam: {
        id: response.match.homeTeam.id,
        teamName: response.match.homeTeam.teamName,
      },
      awayTeam: {
        id: response.match.awayTeam.id,
        teamName: response.match.awayTeam.teamName,
      },
    },
  };
}
