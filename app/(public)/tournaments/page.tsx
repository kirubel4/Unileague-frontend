"use client";

import { useState } from "react";
import TournamentCardComponent from "@/components/tournament/cardComponent";

const TOURNAMENTS = [
  {
    id: "1",
    name: "Winter Championship 2024",
    status: "ONGOING",
    teams: 16,
    matches: 32,
    year: 2024,
  },
  {
    id: "2",
    name: "Batch Cup 2023",
    status: "COMPLETED",
    teams: 12,
    matches: 24,
    year: 2023,
  },
  {
    id: "3",
    name: "Summer League 2025",
    status: "UPCOMING",
    teams: 20,
    matches: 40,
    year: 2025,
  },
  {
    id: "4",
    name: "Batch Cup 2024",
    status: "COMPLETED",
    teams: 12,
    matches: 24,
    year: 2023,
  },
  {
    id: "5",
    name: "GC Cup 2023",
    status: "ONGOING",
    teams: 12,
    matches: 24,
    year: 2023,
  },
  {
    id: "6",
    name: "4th Year Cup",
    status: "ONGOING",
    teams: 12,
    matches: 24,
    year: 2023,
  },
  {
    id: "7",
    name: "3rd Year Cup",
    status: "ONGOING",
    teams: 12,
    matches: 24,
    year: 2023,
  }
];

const YEARS = [2023, 2024, 2025];

export default function TournamentsPage() {
  const [activeYear, setActiveYear] = useState<number>(2023);

  const filteredTournaments = TOURNAMENTS.filter(
    (t) => t.year === activeYear
  );

  return (
    <main className="min-h-screen">
      
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899] opacity-90" />
        <div className="relative px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary-foreground)]">
            Tournaments
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm md:text-base text-[var(--color-primary-foreground)]/85">
            Discover all football tournaments and competitions at ASTU
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {/* Year Filter */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-card)] p-1">
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition
                  ${
                    activeYear === year
                      ? "bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899] text-[var(--color-primary-foreground)] shadow"
                      : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
                  }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {filteredTournaments.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {filteredTournaments.map((tournament) => (
              <TournamentCardComponent
                key={tournament.id}
                tournament={tournament}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-[var(--color-muted-foreground)]">
            No tournaments found for {activeYear}
          </p>
        )}
      </section>
    </main>
  );
}
