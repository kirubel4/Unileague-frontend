"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Trophy,
  Users,
  UserPlus,
  ArrowLeft,
  Crown,
  Star,
  Check,
  X,
} from "lucide-react";

import { mockGames, mockPlayers } from "../../mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Player = (typeof mockPlayers)[number] & {
  isStarting: boolean;
  isBench: boolean;
  isCaptain: boolean;
};

export default function LineupBuilder() {
  const { gameId } = useParams<{ gameId: string }>();
  const router = useRouter();

  const game = mockGames.find((g) => g.id === gameId);

  const [players, setPlayers] = useState<Player[]>(
    mockPlayers.map((p) => ({
      ...p,
      isStarting: false,
      isBench: false,
      isCaptain: false,
    }))
  );

  const [error, setError] = useState<string | null>(null);

  const startingPlayers = useMemo(
    () => players.filter((p) => p.isStarting),
    [players]
  );

  const benchPlayers = useMemo(
    () => players.filter((p) => p.isBench),
    [players]
  );

  const captain = startingPlayers.find((p) => p.isCaptain);

  /* =========================
     PLAYER ACTION HANDLERS
  ========================== */

  function toggleStarting(playerId: string) {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? {
              ...p,
              isStarting: !p.isStarting,
              isBench: false,
              isCaptain: p.isStarting ? false : p.isCaptain,
            }
          : p
      )
    );
  }

  function toggleBench(playerId: string) {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? {
              ...p,
              isBench: !p.isBench,
              isStarting: false,
              isCaptain: false,
            }
          : p
      )
    );
  }

  function setCaptain(playerId: string) {
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        isCaptain: p.id === playerId,
      }))
    );
  }

  /* =========================
     SUBMIT
  ========================== */

  function submitLineup() {
    setError(null);

    if (startingPlayers.length !== 11) {
      setError("You must select exactly 11 starting players.");
      return;
    }

    if (benchPlayers.length === 0) {
      setError("Select at least one bench player.");
      return;
    }

    if (!captain) {
      setError("Select a captain from starting players.");
      return;
    }

    console.log({
      gameId,
      startingPlayers,
      benchPlayers,
      captain,
    });

    toast.success("submited");

    router.push("/lineup");
  }

  if (!game) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg font-semibold">Game not found</p>
        <Button className="mt-4" onClick={() => router.push("/lineup")}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Lineup vs {game.opponent}</h1>
              <p className="text-sm text-gray-500">
                {game.date} • {game.time} • {game.location}
              </p>
            </div>

            <div className="flex gap-6">
              <Stat label="Starting" value={`${startingPlayers.length}/11`} />
              <Stat label="Bench" value={benchPlayers.length} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Players */}
        <div className="lg:col-span-2 space-y-3">
          {players.map((player) => (
            <PlayerRow
              key={player.id}
              player={player}
              onStart={() => toggleStarting(player.id)}
              onBench={() => toggleBench(player.id)}
              onCaptain={() => setCaptain(player.id)}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="sticky top-6 h-fit rounded-xl border bg-white p-4 space-y-4">
          <h2 className="font-semibold">Lineup Summary</h2>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <SummarySection
            title={`Starting XI (${startingPlayers.length}/11)`}
            icon={<Users className="h-4 w-4" />}
            players={startingPlayers}
            showCaptain
          />

          <SummarySection
            title={`Bench (${benchPlayers.length})`}
            icon={<UserPlus className="h-4 w-4" />}
            players={benchPlayers}
          />

          <Button size="lg" className="w-full" onClick={submitLineup}>
            Submit Lineup
          </Button>

          <p className="text-xs text-gray-500">
            Lineup will be reviewed before approval.
          </p>
        </div>
      </div>
    </div>
  );
}

function PlayerRow({
  player,
  onStart,
  onBench,
  onCaptain,
}: {
  player: Player;
  onStart: () => void;
  onBench: () => void;
  onCaptain: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative flex items-center justify-between gap-4 rounded-xl px-4 py-3 transition-all duration-200",
        "border border-gray-200 hover:border-gray-300 hover:shadow-sm",
        player.isStarting &&
          "border-l-4 border-l-blue-500 bg-linear-to-r from-blue-50/50 to-white shadow-sm",
        player.isBench &&
          "border-l-4 border-l-green-500 bg-linear-to-r from-green-50/50 to-white shadow-sm",
        !player.isAvailable && "opacity-60 cursor-not-allowed",
        player.isCaptain && "ring-1 ring-yellow-200 ring-offset-1"
      )}
    >
      {/* Captain Badge */}
      {player.isCaptain && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm"></div>
            <div className="relative bg-yellow-500 p-1 rounded-full shadow-md">
              <Crown className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Player Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Player Number */}
        <div
          className={cn(
            "shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold",
            player.isStarting
              ? "bg-blue-500 text-white"
              : player.isBench
              ? "bg-green-500 text-white"
              : player.isAvailable
              ? "bg-gray-800 text-white"
              : "bg-gray-300 text-gray-600"
          )}
        >
          #{player.number}
        </div>

        {/* Name and Position */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 truncate">
              {player.name}
            </p>
            {!player.isAvailable && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Unavailable
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{player.position}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Start Button */}
        <Button
          size="sm"
          variant={player.isStarting ? "default" : "outline"}
          onClick={onStart}
          disabled={!player.isAvailable}
          className={cn(
            "transition-all duration-200",
            player.isStarting
              ? "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
              : "border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
          )}
        >
          {player.isStarting ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Starting
            </>
          ) : (
            "Start"
          )}
        </Button>

        {/* Bench Button */}
        <Button
          size="sm"
          variant={player.isBench ? "secondary" : "outline"}
          onClick={onBench}
          disabled={!player.isAvailable}
          className={cn(
            "transition-all duration-200",
            player.isBench
              ? "bg-green-500 hover:bg-green-600 text-white shadow-sm"
              : "border-gray-300 hover:border-green-500 hover:bg-green-50 hover:text-green-600"
          )}
        >
          {player.isBench ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Bench
            </>
          ) : (
            "Bench"
          )}
        </Button>

        {/* Captain Button */}
        {player.isStarting && (
          <button
            onClick={onCaptain}
            className={cn(
              "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
              "transition-all duration-200",
              "border border-gray-300 hover:border-yellow-400",
              player.isCaptain
                ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-md"
                : "hover:bg-yellow-50 hover:text-yellow-600"
            )}
            title={player.isCaptain ? "Team Captain" : "Set as Captain"}
            aria-label={player.isCaptain ? "Team Captain" : "Set as Captain"}
          >
            {player.isCaptain ? (
              <Crown className="h-4 w-4" />
            ) : (
              <Star className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Remove Button (only shows on hover for selected players) */}
        {(player.isStarting || player.isBench) && (
          <button
            onClick={player.isStarting ? onStart : onBench}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            title="Remove from lineup"
            aria-label="Remove from lineup"
          >
            <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors">
              <X className="h-3.5 w-3.5" />
            </div>
          </button>
        )}
      </div>

      {/* Status Indicators */}
      <div className="absolute right-2 top-2">
        {!player.isAvailable && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs text-red-600 font-medium">OUT</span>
          </div>
        )}
      </div>
    </div>
  );
}
function SummarySection({
  title,
  icon,
  players,
  showCaptain,
}: {
  title: string;
  icon: React.ReactNode;
  players: Player[];
  showCaptain?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
        {icon}
        {title}
      </div>

      <div className="space-y-1">
        {players.length === 0 && (
          <p className="text-xs text-gray-500 italic">None selected</p>
        )}

        {players.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded bg-gray-50 px-2 py-1 text-sm"
          >
            <span>
              {p.name} #{p.number}
            </span>
            {showCaptain && p.isCaptain && (
              <Trophy className="h-4 w-4 text-yellow-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
