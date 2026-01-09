"use client";

import { MatchList } from "@/components/pages/MatchList";
import MatchesListing from "@/components/pages/publicMatchListing";
import {
  Calendar,
  Trophy,
  Clock,
  Zap,
  Target,
  ChevronRight,
} from "lucide-react";

export default function MatchesPage() {
  const matchStats = {
    totalMatches: 156,
    upcomingMatches: 12,
    liveMatches: 3,
    totalGoals: 428,
    avgGoalsPerMatch: 2.74,
    biggestWin: "5-0",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />

        {/* Animated Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl" />

        <div className="relative px-6 py-24 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Trophy className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  ASTU Football Fixtures
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                Match{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                  Fixtures
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl">
                Follow all football matches, schedules, and results from ASTU
                tournaments. Never miss a game with real-time updates and live
                scores.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Matches</h2>
              <p className="text-gray-600">
                Complete schedule of all football matches
              </p>
            </div>
          </div>

          <MatchesListing />
        </div>
      </div>
    </div>
  );
}
