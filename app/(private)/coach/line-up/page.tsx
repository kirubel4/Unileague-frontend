// app/lineup/page.tsx
"use client";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { mapLiveMatchesToUI } from "@/app/(public)/matches/utility";

const LineupPage = () => {
  const {
    data,
    isLoading: load,
    error,
  } = useSWR(`/api/public/match/up-coming/team`, fetcher, {
    revalidateOnFocus: false,
  });
  const recentMatches = mapLiveMatchesToUI(data);
  return (
    <div className="flex flex-1">
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lineup Management
              </h1>
              <p className="text-gray-600 mt-2">
                Select your starting lineup for upcoming games and submit for
                approval
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Upcoming Games
              </h2>
              <div className="text-sm text-gray-500">
                {recentMatches?.length} games scheduled
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {load &&
                Array.from({ length: 6 }).map((_, i) => (
                  <MatchCardSkeleton key={i} />
                ))}

              {/* Error */}
              {!load && error && (
                <div className="col-span-full">
                  <MatchLoadError onRetry={() => location.reload()} />
                </div>
              )}

              {/* Empty */}
              {!load && !error && recentMatches.length === 0 && (
                <div className="col-span-full text-center py-20 text-gray-500">
                  No upcoming matches available
                </div>
              )}

              {/* Data */}
              {!load &&
                !error &&
                recentMatches.map((game) => (
                  <Card
                    key={game.id}
                    className="group relative overflow-hidden transition-all hover:shadow-xl"
                  >
                    <CardContent className="p-6 space-y-5">
                      {/* Top badges */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            game.isFeatured
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {game.isFeatured ? "Featured Match" : "Regular Match"}
                        </span>

                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {game.status}
                        </span>
                      </div>

                      {/* Teams */}
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900">
                          {game.teamA?.name}
                          <span className="mx-2 text-gray-400">vs</span>
                          {game.teamB?.name}
                        </h3>
                      </div>

                      {/* Match meta */}
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{game.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{game.time}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{game.venue}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="pt-4 border-t">
                        <Link
                          href={`/coach/line-up/${game.id}/${game.teamB.name}`}
                        >
                          <Button
                            size="lg"
                            className="w-full gap-2 group-hover:scale-[1.02] transition-transform"
                          >
                            <Users className="w-4 h-4" />
                            Select Lineup
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LineupPage;
const MatchCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-6 space-y-5 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-24 rounded bg-gray-200" />
        <div className="h-5 w-20 rounded bg-gray-200" />
      </div>

      <div className="h-6 w-3/4 mx-auto rounded bg-gray-200" />

      <div className="space-y-3">
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>

      <div className="h-10 w-full rounded bg-gray-200" />
    </CardContent>
  </Card>
);
const MatchLoadError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <p className="text-lg font-semibold text-gray-800">
      Failed to load matches
    </p>
    <p className="text-sm text-gray-500 mt-1">
      Please check your connection and try again.
    </p>

    <Button className="mt-4" onClick={onRetry}>
      Retry
    </Button>
  </div>
);
