import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

const TEAMS = [
  { id: "1", name: "Software FC", players: 18, points: 45 },
  { id: "2", name: "ECE", players: 17, points: 42 },
  { id: "3", name: "Mechanical", players: 16, points: 38 },
];

export default function TeamsPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TEAMS.map((team) => (
          <Link key={team.id} href={`/teams/team${team.id}`}
            className="hover:scale-[1.02] transition-transform">
            <Card>
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>
                  Players: {team.players} <br />
                  Points: {team.points}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
