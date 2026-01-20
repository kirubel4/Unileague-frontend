import { MatchList } from "@/components/pages/MatchList";

export default function MatchView() {
  return (
    <MatchList
      mode={"public"}
      title=" Matches Fixture"
      description="View Matches "
      apiEndpoint={`/api/public/match/team`}
      className="mt-8"
    />
  );
}
