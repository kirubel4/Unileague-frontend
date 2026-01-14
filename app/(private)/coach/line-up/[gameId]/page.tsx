"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Crown, X, Users2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { cn, fetcher } from "@/lib/utils";
import useSWR from "swr";
import { mapApiPlayersToPlayers } from "@/app/(private)/manager/teams/[id]/util";
import {
  FORMATIONS,
  LineupRole,
  MatchInfo,
  Player,
  PlayerPosition,
} from "./utlity";
export interface PositionSlot {
  position: PlayerPosition;
  player: Player | null;
}

export default function LineupBuilder() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedFormation, setSelectedFormation] = useState("4-3-3");
  const [positionSlots, setPositionSlots] = useState<PositionSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const [matchInfo] = useState<MatchInfo>({
    id: "match-123",
    opponent: "FC Barcelona",
    date: "2024-01-20",
    time: "15:00",
    location: "Home Stadium",
    teamId: "team-456",
  });

  const {
    data,
    error: fetchError,
    isLoading,
    mutate,
  } = useSWR("/api/public/player/team", fetcher);

  // Initialize players
  useEffect(() => {
    if (data?.data) {
      const apiPlayers = mapApiPlayersToPlayers(data.data);
      setPlayers(
        apiPlayers.map((p) => ({
          ...p,
          isAvailable: p.isAvailable ?? true,
          isSelected: false,
          assignedPosition: null,
          role: null,
          isCaptain: false,
        }))
      );
    }
  }, [data]);

  // Initialize position slots based on formation
  useEffect(() => {
    const formation = FORMATIONS.find((f) => f.value === selectedFormation);
    if (formation) {
      const slots = formation.positions.map((pos, idx) => ({
        id: `${pos}-${idx}`,
        position: pos as PlayerPosition,
        player: null,
      }));
      setPositionSlots(slots);
    }
  }, [selectedFormation]);

  // Update positionSlots when players change (to keep them in sync)
  useEffect(() => {
    setPositionSlots((prev) =>
      prev.map((slot) => {
        const player = players.find(
          (p) =>
            p.assignedPosition === slot.position &&
            p.role === LineupRole.STARTING
        );
        return {
          ...slot,
          player: player || null,
        };
      })
    );
  }, [players]);

  // Derived state
  const startingPlayers = useMemo(
    () => players.filter((p) => p.role === LineupRole.STARTING),
    [players]
  );

  const benchPlayers = useMemo(
    () => players.filter((p) => p.role === LineupRole.BENCH),
    [players]
  );

  const availablePlayers = useMemo(
    () => players.filter((p) => p.isAvailable && !p.isSelected),
    [players]
  );

  const unavailablePlayers = useMemo(
    () => players.filter((p) => !p.isAvailable),
    [players]
  );

  const captain = useMemo(
    () => startingPlayers.find((p) => p.isCaptain),
    [startingPlayers]
  );

  // Assign player to position
  const assignPlayerToPosition = (player: Player, position: PlayerPosition) => {
    setPlayers((prev) =>
      prev.map((p) => {
        // Clear previous player in the same position
        if (p.assignedPosition === position && p.id !== player.id) {
          return {
            ...p,
            isSelected: false,
            assignedPosition: null,
            role: null,
          };
        }
        // Assign the selected player
        if (p.id === player.id) {
          return {
            ...p,
            isSelected: true,
            assignedPosition: position,
            role: LineupRole.STARTING,
            isCaptain: false,
          };
        }
        return p;
      })
    );
  };

  // Remove player from position
  const removePlayerFromPosition = (position: PlayerPosition) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.assignedPosition === position
          ? {
              ...p,
              isSelected: false,
              assignedPosition: null,
              role: null,
              isCaptain: false,
            }
          : p
      )
    );
  };

  // Add to bench
  const addToBench = (player: Player) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === player.id
          ? {
              ...p,
              isSelected: true,
              role: LineupRole.BENCH,
              assignedPosition: null,
              isCaptain: false, // Can't be captain from bench
            }
          : p
      )
    );
  };

  // Remove from bench
  const removeFromBench = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? { ...p, isSelected: false, role: null, isCaptain: false }
          : p
      )
    );
  };

  // Set captain - FIXED VERSION
  const setCaptain = (playerId: string) => {
    console.log("Setting captain for:", playerId);

    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        isCaptain: p.id === playerId && p.role === LineupRole.STARTING,
      }))
    );

    toast.success("Captain set!");
  };

  // Clear captain
  const clearCaptain = () => {
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        isCaptain: false,
      }))
    );
  };

  // Auto-assign based on positions
  const autoAssign = () => {
    const formation = FORMATIONS.find((f) => f.value === selectedFormation);
    if (!formation) return;

    const available = [...availablePlayers];
    const positions = formation.positions as PlayerPosition[];

    positions.forEach((position) => {
      // Check if position is already filled
      const isAlreadyFilled = players.some(
        (p) => p.assignedPosition === position && p.role === LineupRole.STARTING
      );

      if (!isAlreadyFilled && available.length > 0) {
        // Find best matching player for this position
        const matchingPlayer =
          available.find(
            (p) =>
              p.position.toLowerCase() === position.toLowerCase() ||
              (position === "CB" &&
                (p.position === "RCB" || p.position === "LCB"))
          ) || available[0];

        if (matchingPlayer) {
          assignPlayerToPosition(matchingPlayer, position);
          available.splice(available.indexOf(matchingPlayer), 1);
        }
      }
    });

    toast.success("Auto-assigned players to positions");
  };

  // Clear all assignments
  const clearAll = () => {
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        isSelected: false,
        assignedPosition: null,
        role: null,
        isCaptain: false,
      }))
    );
    toast.info("All assignments cleared");
  };

  // Prepare submission data
  const prepareLineupData = () => {
    const startingLineup = players
      .filter((p) => p.role === LineupRole.STARTING && p.assignedPosition)
      .map((player) => ({
        playerId: player.id,
        position: player.assignedPosition!,
        role: LineupRole.STARTING,
        isCaptain: player.isCaptain || undefined,
      }));

    const benchLineup = benchPlayers.map((player) => ({
      playerId: player.id,
      position: player.position.toUpperCase() as PlayerPosition,
      role: LineupRole.BENCH,
      isCaptain: false,
    }));

    return [...startingLineup, ...benchLineup];
  };

  // Validate lineup
  const validateLineup = (): string | null => {
    const formation = FORMATIONS.find((f) => f.value === selectedFormation);
    if (!formation) return "Formation not found";

    const unfilled = formation.positions.filter(
      (pos) =>
        !players.some(
          (p) => p.assignedPosition === pos && p.role === LineupRole.STARTING
        )
    );

    if (unfilled.length > 0) {
      return `Missing players for: ${unfilled.join(", ")}`;
    }

    if (benchPlayers.length === 0) {
      return "Add at least 1 bench player";
    }

    if (!captain) {
      return "Select a captain";
    }

    const hasGK = players.some(
      (p) =>
        p.assignedPosition === PlayerPosition.GK &&
        p.role === LineupRole.STARTING
    );
    if (!hasGK) return "Must assign a goalkeeper";

    return null;
  };

  // Submit lineup
  const submitLineup = async () => {
    setError(null);
    const validationError = validateLineup();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const lineupData = prepareLineupData();
      const payload = {
        teamId: matchInfo.teamId,
        matchId: matchInfo.id,
        formation: selectedFormation,
        requestById: "user-123",
        players: lineupData,
      };

      console.log("Submitting:", payload);
      // await fetch("/api/lineup", { method: "POST", body: JSON.stringify(payload) });

      toast.success("Lineup submitted for approval!");
      setTimeout(() => router.push("/coach/line-up"), 1500);
    } catch (error) {
      setError("Failed to submit lineup");
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render formation layout
  const renderFormationLayout = () => {
    const formation = FORMATIONS.find((f) => f.value === selectedFormation);
    if (!formation) return null;

    // Group positions by line (GK, Defense, Midfield, Attack)
    const lines = {
      GK: formation.positions.filter((p) => p === "GK"),
      Defense: formation.positions.filter((p) =>
        ["RB", "RCB", "LCB", "LB", "CB"].includes(p)
      ),
      Midfield: formation.positions.filter((p) =>
        ["CDM", "CM", "CAM", "RM", "LM"].includes(p)
      ),
      Attack: formation.positions.filter((p) =>
        ["RW", "LW", "ST", "CF"].includes(p)
      ),
    };

    return (
      <div className="mb-8">
        <Toaster />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <select
              value={selectedFormation}
              onChange={(e) => {
                setSelectedFormation(e.target.value);
                clearAll();
              }}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {FORMATIONS.map((form) => (
                <option key={form.value} value={form.value}>
                  {form.label} Formation
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={autoAssign}>
                Auto Assign
              </Button>
              <Button size="sm" variant="ghost" onClick={clearAll}>
                Clear All
              </Button>
              {captain && (
                <Button size="sm" variant="ghost" onClick={clearCaptain}>
                  Clear Captain
                </Button>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {formation.positions.length} players needed
          </div>
        </div>

        {/* Formation visualization */}
        <div className="relative rounded-2xl bg-linear-to-br from-gray-900 to-gray-800 p-6">
          {/* Soccer field background */}
          <div className="absolute inset-4 rounded-xl border-2 border-white/20"></div>
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-white/20"></div>
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/20"></div>

          {/* Position slots */}
          <div className="relative grid grid-cols-1 gap-8">
            {/* Goalkeeper */}
            <div className="flex justify-center">
              {lines.GK.map((pos) => {
                const player = players.find(
                  (p) =>
                    p.assignedPosition === pos && p.role === LineupRole.STARTING
                );
                return (
                  <PositionSlot
                    key={pos}
                    position={pos as PlayerPosition}
                    player={player || null}
                    onAssign={(player) =>
                      assignPlayerToPosition(player, pos as PlayerPosition)
                    }
                    onRemove={() =>
                      removePlayerFromPosition(pos as PlayerPosition)
                    }
                    onCaptain={() => player && setCaptain(player.id)}
                    isCaptain={!!player?.isCaptain}
                  />
                );
              })}
            </div>

            {/* Defense */}
            <div className="flex justify-center gap-4">
              {lines.Defense.map((pos) => {
                const player = players.find(
                  (p) =>
                    p.assignedPosition === pos && p.role === LineupRole.STARTING
                );
                return (
                  <PositionSlot
                    key={pos}
                    position={pos as PlayerPosition}
                    player={player || null}
                    onAssign={(player) =>
                      assignPlayerToPosition(player, pos as PlayerPosition)
                    }
                    onRemove={() =>
                      removePlayerFromPosition(pos as PlayerPosition)
                    }
                    onCaptain={() => player && setCaptain(player.id)}
                    isCaptain={!!player?.isCaptain}
                  />
                );
              })}
            </div>

            {/* Midfield */}
            <div className="flex justify-center gap-4">
              {lines.Midfield.map((pos, idx) => {
                const player = players.find(
                  (p) =>
                    p.assignedPosition === pos && p.role === LineupRole.STARTING
                );
                return (
                  <PositionSlot
                    key={`${pos}-${idx}`} // Use string + index
                    position={pos as PlayerPosition}
                    player={player || null}
                    onAssign={(player) =>
                      assignPlayerToPosition(player, pos as PlayerPosition)
                    }
                    onRemove={() =>
                      removePlayerFromPosition(pos as PlayerPosition)
                    }
                    onCaptain={() => player && setCaptain(player.id)}
                    isCaptain={!!player?.isCaptain}
                  />
                );
              })}
            </div>

            {/* Attack */}
            <div className="flex justify-center gap-4">
              {lines.Attack.map((pos, idx) => {
                const player = players.find(
                  (p) =>
                    p.assignedPosition === pos && p.role === LineupRole.STARTING
                );
                return (
                  <PositionSlot
                    key={`${pos}-${idx}`}
                    position={pos as PlayerPosition}
                    player={player || null}
                    onAssign={(player) =>
                      assignPlayerToPosition(player, pos as PlayerPosition)
                    }
                    onRemove={() =>
                      removePlayerFromPosition(pos as PlayerPosition)
                    }
                    onCaptain={() => player && setCaptain(player.id)}
                    isCaptain={!!player?.isCaptain}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Lineup Builder
              </h1>
              <p className="text-sm text-gray-600">
                {matchInfo.date} • vs {matchInfo.opponent}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Progress</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{
                        width: `${
                          ((startingPlayers.length + benchPlayers.length) /
                            (positionSlots.length + 5)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {startingPlayers.length}/{positionSlots.length} starters
                  </span>
                </div>
              </div>
              <Button
                size="lg"
                onClick={submitLineup}
                disabled={isSubmitting || !!validateLineup()}
                className="min-w-32"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Lineup"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
            <div className="flex items-center">
              <div className="shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Debug info - remove in production */}
        <div className="mb-4 text-xs text-gray-500">
          Captain: {captain ? `#${captain.number} ${captain.name}` : "None"} |
          Starting players: {startingPlayers.length} | Total players:{" "}
          {players.length}
        </div>

        {/* Formation Section */}
        {renderFormationLayout()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Players */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="border-b px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users2 className="h-5 w-5 text-gray-400" />
                    <h3 className="font-semibold">Available Players</h3>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                      {availablePlayers.length} available
                    </span>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={showUnavailable}
                      onChange={(e) => setShowUnavailable(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Show unavailable
                  </label>
                </div>
              </div>

              <div className="p-4">
                {fetchError ? (
                  <div className="py-8 text-center">
                    <p className="text-red-600 mb-2">Failed to load players</p>
                    <Button onClick={() => mutate()}>Retry</Button>
                  </div>
                ) : availablePlayers.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">All players assigned</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Click on positions to reassign players
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availablePlayers.map((player) => (
                      <div
                        key={player.id}
                        className="group flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-blue-500 font-bold text-white">
                            {player.number}
                          </div>
                          <div>
                            <div className="font-semibold">{player.name}</div>
                            <div className="text-xs text-gray-500">
                              {player.position}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToBench(player)}
                          >
                            Bench
                          </Button>
                          <select
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                            defaultValue=""
                            onChange={(e) => {
                              const pos = e.target.value as PlayerPosition;
                              if (pos) assignPlayerToPosition(player, pos);
                            }}
                          >
                            <option value="">Assign...</option>
                            {positionSlots
                              .filter((slot) => {
                                const playerInSlot = players.find(
                                  (p) =>
                                    p.assignedPosition === slot.position &&
                                    p.role === LineupRole.STARTING
                                );
                                return !playerInSlot;
                              })
                              .map((slot, idx) => (
                                <option
                                  key={`${slot}-${idx}`}
                                  value={slot.position}
                                >
                                  {slot.position}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    ))}

                    {showUnavailable && unavailablePlayers.length > 0 && (
                      <>
                        <div className="col-span-full mt-4 mb-2 text-sm font-medium text-gray-500">
                          Unavailable Players
                        </div>
                        {unavailablePlayers.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 opacity-60"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 font-bold text-gray-600">
                              {player.number}
                            </div>
                            <div>
                              <div className="font-semibold">{player.name}</div>
                              <div className="text-xs text-gray-500">
                                {player.position} • Unavailable
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bench & Summary */}
          <div className="space-y-6">
            {/* Bench */}
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-gray-400" />
                  <h3 className="font-semibold">Bench</h3>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    {benchPlayers.length} players
                  </span>
                </div>
              </div>
              <div className="p-4">
                {benchPlayers.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-gray-500">No bench players</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Click "Bench" on available players
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {benchPlayers.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between rounded-lg bg-green-50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 font-bold text-white">
                            {player.number}
                          </div>
                          <div>
                            <div className="font-semibold">{player.name}</div>
                            <div className="text-xs text-gray-600">
                              {player.position}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromBench(player.id)}
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="border-b px-4 py-3">
                <h3 className="font-semibold">Lineup Summary</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Formation</div>
                    <div className="font-medium">{selectedFormation}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Starting XI</div>
                    <div className="font-medium">
                      {startingPlayers.length}/{positionSlots.length}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Bench</div>
                    <div className="font-medium">{benchPlayers.length}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Captain</div>
                    <div className="font-medium">
                      {captain
                        ? `#${captain.number} ${captain.name}`
                        : "Not set"}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="mb-2 text-sm font-medium">Validation</div>
                  <div className="space-y-2">
                    {[
                      {
                        check: startingPlayers.length === positionSlots.length,
                        label: "All positions filled",
                      },
                      {
                        check: benchPlayers.length > 0,
                        label: "At least 1 bench player",
                      },
                      { check: !!captain, label: "Captain selected" },
                      {
                        check: startingPlayers.some(
                          (p) => p.assignedPosition === "GK"
                        ),
                        label: "Goalkeeper assigned",
                      },
                    ].map((item, idx) => (
                      <div
                        key={`${item}-${idx}`}
                        className="flex items-center gap-2"
                      >
                        <div
                          className={`h-3 w-3 rounded-full ${
                            item.check ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-sm ${
                            item.check ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function PositionSlot({
  position,
  player,
  onAssign,
  onRemove,
  onCaptain,
  isCaptain,
}: {
  position: PlayerPosition;
  player: Player | null;
  onAssign: (player: Player) => void;
  onRemove: () => void;
  onCaptain: () => void;
  isCaptain: boolean;
}) {
  return (
    <div className="relative">
      <div
        className={cn(
          "relative flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 transition-all cursor-pointer",
          player
            ? "border-blue-500 bg-blue-50"
            : "border-dashed border-gray-400 bg-white/10 hover:border-blue-400 hover:bg-white/20"
        )}
      >
        {player ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-blue-500 font-bold text-white">
                {player.number}
              </div>
              <div className="mt-1 text-xs font-semibold text-black truncate max-w-full px-1">
                {player.name.split(" ")[0]}
              </div>
            </div>
            {isCaptain && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm"></div>
                  <Crown className="h-6 w-6 text-yellow-500 relative" />
                </div>
              </div>
            )}
            {/* Captain button inside the slot for easier clicking */}
            {!isCaptain && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCaptain();
                }}
                className="absolute top-1 left-1 -translate-x-1/2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded-full transition-colors"
                title="Make captain"
              >
                Cap
              </button>
            )}
          </>
        ) : (
          <>
            <div className="text-lg font-bold text-white">{position}</div>
            <div className="mt-1 text-xs text-white/70">Click to assign</div>
          </>
        )}
      </div>
    </div>
  );
}
