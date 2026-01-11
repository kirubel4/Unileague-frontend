"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { fetcher, getCookie } from "@/lib/utils";
import {
  Calendar,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Users,
  Target,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED";

export interface ApiMatch {
  id: string;
  scheduledDate: string;
  venue: string;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  matchWeek: number | null;
  homeTeam: {
    id: string;
    teamName: string;
  };
  awayTeam: {
    id: string;
    teamName: string;
  };
}

export default function ManagerFixtures() {
  const userName = getCookie("uName") || "Manager";
  const { data, isLoading, error } = useSWR(`/api/public/match`, fetcher, {
    revalidateOnFocus: false,
  });
  const apiMatches: ApiMatch[] = data?.data ?? [];
  const hasFixtures = apiMatches.length > 0;
  const totalTeams = 16; // This should ideally come from an API
  const estimatedMatches = totalTeams * (totalTeams - 1); // For round-robin

  if (isLoading) {
    return (
      <Layout role="manager" userName={userName}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading fixtures data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout role="manager" userName={userName}>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">Failed to load fixtures data</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Please try refreshing the page or check your connection.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Fixtures Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate and manage tournament match schedules
            </p>
          </div>
          {hasFixtures && (
            <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">
                  {apiMatches.length} matches scheduled
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Status Card */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-full ${
                hasFixtures ? "bg-green-100" : "bg-amber-100"
              }`}
            >
              {hasFixtures ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                {hasFixtures ? "Fixtures Ready" : "Fixtures Not Generated"}
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                {hasFixtures
                  ? `Tournament fixtures have been generated with ${apiMatches.length} matches. You can view, edit, or regenerate the schedule.`
                  : "Set up the tournament format and generate match fixtures to start scheduling matches for your tournament."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {hasFixtures ? (
              <>
                <Link href="/manager/matches">
                  <Button className="w-full sm:w-auto gap-2">
                    View Matches
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/manager/fixtures/setup">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Regenerate
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/manager/fixtures/setup">
                <Button className="gap-2 w-full sm:w-auto">
                  <Calendar className="w-4 h-4" />
                  Setup Fixtures
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex flex-wrap gap-3">
            <Link href="/manager/matches/create">
              <Button variant="outline" className="gap-2">
                + Create Match Manually
              </Button>
            </Link>
            <Link href="/manager/teams">
              <Button variant="ghost" className="gap-2">
                <Users className="w-4 h-4" />
                Manage Teams
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Setup Guide */}
        <div className="bg-linear-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Setup Guide</h3>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 bg-white border border-blue-200 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Choose Tournament Format
                </p>
                <p className="text-sm text-muted-foreground">
                  Select between League, Knockout, or Hybrid format
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 bg-white border border-blue-200 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Configure Settings
                </p>
                <p className="text-sm text-muted-foreground">
                  Set match duration, venues, and scheduling preferences
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 bg-white border border-blue-200 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Preview & Generate
                </p>
                <p className="text-sm text-muted-foreground">
                  Review the auto-generated schedule and confirm
                </p>
              </div>
            </div>

            {!hasFixtures && (
              <div className="pt-4 mt-4 border-t border-blue-100">
                <Link href="/manager/fixtures/setup">
                  <Button className="w-full gap-2">
                    <Calendar className="w-4 h-4" />
                    Start Setup Process
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tournament Overview */}
        <div className="bg-linear-to-br from-gray-50 to-white rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <BarChart className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Tournament Overview
            </h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Teams
                  </p>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {totalTeams}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground font-medium mb-2">
                  Estimated Matches
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {estimatedMatches}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground font-medium mb-2">
                Recommended Format
              </p>
              <div className="bg-white rounded-lg border border-border p-4">
                <p className="font-medium text-foreground">
                  Round Robin League
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Each team plays against every other team{" "}
                  {totalTeams > 10 ? "once" : "twice"} for balanced competition
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {hasFixtures
                  ? "Fixtures are generated. You can still adjust match times and venues."
                  : "Generate fixtures to get a complete match schedule with dates and venues."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
