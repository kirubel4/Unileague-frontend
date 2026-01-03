"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { ApiResponse, fetcher, getCookie } from "@/lib/utils";
import { mapTeams, Team } from "./util";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
export default function TransferClient() {
  const userName = getCookie("uName") || "Manager";
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const currentPlayer = searchParams.get("playerName") ?? "Unknown Player";
  const currentTeam = searchParams.get("teamName") ?? "Unknown Team";
  const [number, setNumber] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinationTeam, setDestinationTeam] = useState("");

  const navigate = useRouter();

  const { data, error, isLoading } = useSWR(
    "/api/public/team/tournament",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const teams: Team[] = mapTeams(data || { data: [] });
  const filterTeam = teams?.filter((team) => team.name != currentTeam);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationTeam || number <= 0) {
      toast.info("please select team and number");
      return;
    }

    setIsSubmitting(true);
    const data = {
      playerId: id,
      newTeamId: destinationTeam,
      newNumber: number,
    };

    const res = await fetch("/api/protected/manager/player/transfer", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const result: ApiResponse = await res.json();
    if (!result.success) {
      toast.error(result.message);
      setIsSubmitting(false);
      return;
    }
    toast.success("player transferred");
    navigate.push("/manager/players");
  };

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Toaster />
        <h1 className="text-3xl font-bold text-foreground">Transfer Player</h1>
        <p className="text-muted-foreground mt-2">
          Move a player to a different team
        </p>
      </div>

      {/* Transfer Form */}
      <div className="max-w-7xl">
        <div className="bg-white rounded-lg border border-border p-8">
          {/* Current Info */}
          <div className="mb-8 p-6 bg-muted rounded-lg border border-border">
            <h3 className="font-semibold text-foreground mb-4">
              Current Assignment
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Player</p>
                <p className="font-bold text-foreground text-lg">
                  {currentPlayer}
                </p>
              </div>
              <div className="text-muted-foreground">
                <ArrowRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Current Team
                </p>
                <p className="font-bold text-foreground text-lg">
                  {currentTeam}
                </p>
              </div>
            </div>
          </div>

          {/* Transfer Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination Team */}
            <div className="space-y-4">
              <Label className="font-medium text-base">Transfer To *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterTeam.map((team) => (
                  <label
                    key={team.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      destinationTeam === team.id
                        ? "border-primary bg-blue-50"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="team"
                      value={team.id}
                      checked={destinationTeam === team.id}
                      onChange={(e) => setDestinationTeam(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-medium text-foreground">
                      {team.name}
                    </span>
                  </label>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamName" className="font-medium">
                  New Number *
                </Label>
                <Input
                  id="number"
                  name="number"
                  max={99}
                  placeholder="min "
                  value={number}
                  onChange={(e) => setNumber(Number(e.target.value))}
                  required
                  className="h-10 rounded-lg"
                />
              </div>
            </div>

            {/* Warning */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ This action will update the player's team assignment. The
                player will be associated with the new team for all future
                matches.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-blue-600 text-white rounded-lg h-10"
              >
                {isSubmitting ? "Transferring..." : "Confirm Transfer"}
              </Button>
              <Link href="/manager/players">
                <Button variant="outline" className="rounded-lg h-10">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
