import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

const MATCHES = [
  { id: "1", home: "Software FC", away: "ECE", date: "2025-12-10", status: "Finished", score: "2 - 1" },
  { id: "2", home: "WAR", away: "MECH", date: "2025-12-11", status: "Upcoming", score: null },
];

export default function MatchesPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MATCHES.map((m) => (
          <Link key={m.id} href={`/matches/match${m.id}`}
            className="hover:scale-[1.02] transition-transform">
            <Card>
              <CardHeader>
                <CardTitle>{m.home} vs {m.away}</CardTitle>
                <CardDescription>
                  Date: {m.date} <br />
                  Status: {m.status} <br />
                  {m.score && <>Score: {m.score}</>}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
