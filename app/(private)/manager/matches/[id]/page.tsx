"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronLeft,
  Clock,
  MapPin,
  Users,
  RotateCw,
  Trash2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Event {
  id: number;
  minute: number;
  type: "goal" | "yellow" | "red" | "substitution";
  player: string;
  team: string;
}

export default function ManagerMatchesDetail() {
  const userName = localStorage.getItem("userName") || "Manager";
  const navigate = useRouter();
  const id = useSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [showLiveControls, setShowLiveControls] = useState(false);
  const [goalHomeTeam, setGoalHomeTeam] = useState(0);
  const [goalAwayTeam, setGoalAwayTeam] = useState(0);
  const [eventPlayer, setEventPlayer] = useState("");
  const [eventType, setEventType] = useState<
    "goal" | "yellow" | "red" | "substitution"
  >("goal");
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      minute: 12,
      type: "goal",
      player: "Alex Johnson",
      team: "Tigers United",
    },
    {
      id: 2,
      minute: 28,
      type: "yellow",
      player: "Mike Smith",
      team: "Phoenix FC",
    },
    {
      id: 3,
      minute: 45,
      type: "goal",
      player: "Carlos Rodriguez",
      team: "Tigers United",
    },
  ]);

  const match = {
    id: id || "3",
    homeTeam: "Tigers United",
    awayTeam: "Phoenix FC",
    homeScore: goalHomeTeam,
    awayScore: goalAwayTeam,
    status: "live",
    minute: 67,
    venue: "Central Stadium",
    startTime: "15:00",
    referee: "James Wilson",
    homeFormation: "4-3-3",
    awayFormation: "4-2-3-1",
    homeCoach: "Coach Ali",
    awayCoach: "Coach Maria",
  };

  const refreshScore = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventPlayer.trim()) return;

    const newEvent: Event = {
      id: Math.max(...events.map((e) => e.id), 0) + 1,
      minute: match.minute,
      type: eventType,
      player: eventPlayer,
      team: eventType === "goal" ? match.homeTeam : match.awayTeam,
    };

    setEvents([newEvent, ...events]);

    if (eventType === "goal") {
      setGoalHomeTeam(goalHomeTeam + 1);
    }

    setEventPlayer("");
    setEventType("goal");
  };

  const handleGoalButtonClick = (team: "home" | "away") => {
    if (team === "home") {
      setGoalHomeTeam(goalHomeTeam + 1);
    } else {
      setGoalAwayTeam(goalAwayTeam + 1);
    }
  };

  const getEventIcon = (type: Event["type"]) => {
    switch (type) {
      case "goal":
        return "⚽";
      case "yellow":
        return "🟨";
      case "red":
        return "🟥";
      case "substitution":
        return "🔄";
      default:
        return "•";
    }
  };

  const getEventColor = (type: Event["type"]) => {
    switch (type) {
      case "goal":
        return "text-green-600 bg-green-50";
      case "yellow":
        return "text-yellow-600 bg-yellow-50";
      case "red":
        return "text-red-600 bg-red-50";
      case "substitution":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Link href="/manager/matches">
          <Button
            variant="ghost"
            className="gap-2 px-0 h-8 text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Matches
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Match Details</h1>
        <p className="text-muted-foreground mt-2">
          {match.homeTeam} vs {match.awayTeam}
        </p>
      </div>

      {/* Match Status Badge */}
      {match.status === "live" && (
        <div className="mb-6 inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm flex items-center gap-2">
          <span className="animate-pulse">🔴</span>
          LIVE - Minute {match.minute}
        </div>
      )}

      {/* Main Score Display */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 md:p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="text-center flex-1">
            <h2 className="text-2xl md:text-4xl font-bold">{match.homeTeam}</h2>
          </div>
          <div className="px-4 md:px-8 py-4">
            <div className="text-4xl md:text-6xl font-bold text-center mb-2">
              {match.homeScore} - {match.awayScore}
            </div>
            <p className="text-blue-100 text-center text-xs md:text-sm">
              Minute {match.minute}
            </p>
          </div>
          <div className="text-center flex-1">
            <h2 className="text-2xl md:text-4xl font-bold">{match.awayTeam}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Match Information */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border border-border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Match Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Venue</p>
                  <p className="font-medium text-foreground">{match.venue}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Start Time</p>
                  <p className="font-medium text-foreground">
                    {match.startTime}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Referee</p>
                  <p className="font-medium text-foreground">{match.referee}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-medium text-foreground capitalize">
                    {match.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Control Panel */}
          {match.status === "live" && (
            <div className="bg-white rounded-lg border border-border p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Live Control Panel
                </h3>
                <Button
                  onClick={refreshScore}
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RotateCw
                    className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>

              <form onSubmit={addEvent} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="eventType"
                      className="text-xs text-muted-foreground"
                    >
                      Team
                    </Label>
                    <select
                      id="eventType"
                      value={eventType}
                      onChange={(e) =>
                        setEventType(
                          e.target.value as "goal" | "yellow" | "red"
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="homeTeam">Home</option>
                      <option value="awayTeam">Away</option>
                    </select>
                  </div>
                  <div>
                    <Label
                      htmlFor="eventType"
                      className="text-xs text-muted-foreground"
                    >
                      Event Type
                    </Label>
                    <select
                      id="eventType"
                      value={eventType}
                      onChange={(e) =>
                        setEventType(
                          e.target.value as "goal" | "yellow" | "red"
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Goal">⚽ Goal</option>
                      <option value="Yellow">🟨 Yellow Card</option>
                      <option value="Red">🟥 Red Card</option>
                    </select>
                  </div>
                  <div>
                    <Label
                      htmlFor="eventType"
                      className="text-xs text-muted-foreground"
                    >
                      Player
                    </Label>
                    <select
                      id="eventType"
                      value={eventType}
                      onChange={(e) =>
                        setEventType(
                          e.target.value as "goal" | "yellow" | "red"
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="homeTeam">abebe</option>
                      <option value="awayTeam">kebede</option>
                      <option value="awayTeam">kebede</option>
                      <option value="awayTeam">kebede</option>
                    </select>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-blue-600"
                >
                  Add Event
                </Button>
              </form>
            </div>
          )}

          {/* Events Timeline */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Match Events
            </h3>
            <div className="space-y-3">
              {events.length > 0 ? (
                events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg flex items-start gap-4 ${getEventColor(
                      event.type
                    )}`}
                  >
                    <span className="text-2xl flex-shrink-0">
                      {getEventIcon(event.type)}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{event.player}</p>
                      <p className="text-xs opacity-75">{event.team}</p>
                    </div>
                    <span className="font-bold text-sm flex-shrink-0">
                      Min {event.minute}
                    </span>
                    <button onClick={() => {}}>
                      <Trash2 color="red" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No events yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Team Information */}
        <div className="space-y-6">
          {/* Home Team */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h4 className="font-semibold mb-4 text-foreground">
              {match.homeTeam}
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Coach</p>
                <p className="font-medium text-foreground">{match.homeCoach}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Goals</p>
                <p className="text-2xl font-bold text-primary">
                  {match.homeScore}
                </p>
              </div>
            </div>
          </div>

          {/* Away Team */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h4 className="font-semibold mb-4 text-foreground">
              {match.awayTeam}
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Coach</p>
                <p className="font-medium text-foreground">{match.awayCoach}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Goals</p>
                <p className="text-2xl font-bold text-primary">
                  {match.awayScore}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
