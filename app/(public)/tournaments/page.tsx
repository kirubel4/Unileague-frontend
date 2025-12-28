
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

const TOURNAMENTS = [
  { id: "2025", name: "4th Year Championship 2025", status: "Ongoing", teams: 16, matches: 32 },
  { id: "2025", name: "batch Cup 2025", status: "Completed", teams: 12, matches: 24 },
];

export default function TournamentsPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TOURNAMENTS.map((t) => (
          <Link key={t.id} href={`/tournaments/tournament${t.id}`}
            className="hover:scale-[1.02] transition-transform">
            <Card>
              <CardHeader>
                <CardTitle>{t.name}</CardTitle>
                <CardDescription>
                  Status: <span className="font-semibold">{t.status}</span> <br />
                  Teams: {t.teams} <br />
                  Matches: {t.matches}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
