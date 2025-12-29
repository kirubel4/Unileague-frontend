import { MatchWeekPreview } from "./page";

export function mapPreviewToMatches(weeks: MatchWeekPreview[]) {
  return weeks.flatMap((week) =>
    week.matches.map((match) => ({
      scheduledDate: match.date!, // make sure it's set in preview
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      venue: "Main Stadium", // hardcoded
      matchWeek: week.matchWeek,
    }))
  );
}
