// UI-friendly live match model
export interface LiveMatchUI {
  id: string;
  teamA: {
    name: string;
    logo: string;
    score: number;
  };
  teamB: {
    name: string;
    logo: string;
    score: number;
  };
  date: string;
  time: string;
  status: "live" | "upcoming" | "finished";
  tournament: string;
  venue: string;
  round: string;
  isFeatured: boolean;
}
function parseScheduledDate(scheduledDate: string) {
  const [time, date] = scheduledDate.split(" ");
  return { time, date };
}
export function mapLiveMatchesToUI(apiResponse: any): LiveMatchUI[] {
  if (!apiResponse?.data || !Array.isArray(apiResponse.data)) {
    return [];
  }

  return apiResponse.data.map((match: any): LiveMatchUI => {
    const { time, date } = parseScheduledDate(match.scheduledDate);

    return {
      id: match.id,

      teamA: {
        name: match.homeTeam?.teamName ?? "Unknown",
        logo: "", // backend doesn’t provide logo yet
        score: match.homeScore ?? 0,
      },

      teamB: {
        name: match.awayTeam?.teamName ?? "Unknown",
        logo: "",
        score: match.awayScore ?? 0,
      },

      date,
      time,

      status:
        match.status === "LIVE"
          ? "live"
          : match.status === "FINISHED"
          ? "finished"
          : "upcoming",

      tournament: match.tournament?.tournamentName ?? "",

      venue: match.venue ?? "",

      // Backend has no round info → derive or fallback
      round: `Match Week ${match.matchWeek ?? "-"}`,

      // Example logic: featured if LIVE and has events
      isFeatured: match.status === "LIVE" && match.events?.length > 0,
    };
  });
}
