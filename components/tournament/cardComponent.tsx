import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Tournament = {
  name: string;
  status: string;
  teams: number;
  matches: number;
};

const statusColor: Record<string, string> = {
    "ONGOING" : "bg-[var(--color-status-active)]",
    "PENDING": "bg-[var(--color-status-pending)]",
    "COMPLETED": "bg-[var(--color-status-completed)]",
    "FINISHED": "bg-[var(--color-status-finished)]",
}

export default function TournamentCardComponent({
  tournament,
}: {
  tournament: Tournament;
}) {
  return (
    <Card className="w-full max-w-sm overflow-hidden border-[var(--color-border)] shadow-sm hover:shadow-lg hover:scale-105  transition">
      <CardHeader className="relative p-6 bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#EC4899]">
        <span className={`absolute top-4 right-4 rounded-full ${statusColor[tournament.status]} px-2 py-1 text-[10px] font-semibold text-white`}>
          {tournament.status}
        </span>

        <h3 className="text-lg font-semibold text-white leading-tight">
          {tournament.name}
        </h3>
        <p className="mt-1 text-xs text-white/80">
          Official ASTU Football Tournament
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-muted-foreground)]">
            Teams Participating
          </span>
          <span className="font-semibold">{tournament.teams}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-muted-foreground)]">
            Total Matches
          </span>
          <span className="font-semibold">{tournament.matches}</span>
        </div>

        <div className="h-px bg-[var(--color-border)]" />

        <button className="w-full rounded-lg bg-gradient-to-tr from-[#6366F1] via-[#8B5CF6] to-[#EC4899] py-2.5 text-sm font-medium text-[var(--color-primary-foreground)] hover:opacity-90 transition">
          View Tournament
        </button>
      </CardContent>
    </Card>
  );
}
