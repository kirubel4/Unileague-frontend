"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

import { Calendar, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ManagerFixtures() {
  const userName = "Manager";

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Fixtures</h1>
        <p className="text-muted-foreground mt-2">
          Manage and generate tournament match fixtures
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-lg border border-border p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <AlertCircle className="w-8 h-8 text-orange-500 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Fixtures Not Yet Generated
            </h2>
            <p className="text-muted-foreground">
              Set up the tournament format and generate match fixtures to start
              scheduling matches.
            </p>
          </div>
        </div>

        <Link href="/manager/fixtures/setup">
          <Button className="bg-primary hover:bg-blue-600 text-white rounded-lg h-10 gap-2">
            <Calendar className="w-4 h-4" />
            Setup Fixtures
          </Button>
        </Link>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Steps */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Setup Steps
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">Select Format</p>
                <p className="text-sm text-muted-foreground">
                  Choose League or Knockout format
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">Validate Teams</p>
                <p className="text-sm text-muted-foreground">
                  Ensure all teams are registered
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">Preview Fixtures</p>
                <p className="text-sm text-muted-foreground">
                  Review generated match schedule
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <p className="font-medium text-foreground">Confirm</p>
                <p className="text-sm text-muted-foreground">
                  Finalize and create matches
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Tournament Info
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Teams
              </p>
              <p className="text-2xl font-bold text-foreground">16</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Recommended Format
              </p>
              <p className="text-foreground">League Format (Round Robin)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Estimated Matches
              </p>
              <p className="text-foreground">
                120 matches (16 teams, double round-robin)
              </p>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Each team will play against every other team twice (home and
                away)
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
