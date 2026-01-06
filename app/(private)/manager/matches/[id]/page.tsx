"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  Clock,
  MapPin,
  RotateCw,
  Trash2,
  Plus,
  ListVideoIcon,
  StopCircle,
  TrendingUp,
  Calendar,
  Shield,
  User,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { ApiResponse, fetcher, getCookie } from "@/lib/utils";
import { mapMatchDetail, mapPlayerNames } from "./util";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
interface Event {
  id: string;
  minute: number;
  type: "Goal" | "Yellow" | "Red";
  player: string;
  team: string;
}
export default function ManagerMatchesDetail() {
  const userName = getCookie("uName") || "Manager";
  const params = useParams();
  const matchId = params.id as string;

  const [refreshing, setRefreshing] = useState(false);

  const [eventPlayer, setEventPlayer] = useState("");
  const [min, setMin] = useState(0);
  const [eventTeam, setEventTeam] = useState("");
  const [eventTeamSide, setEventTeamSide] = useState<"home" | "away">("home");
  const [eventType, setEventType] = useState<"Goal" | "Yellow" | "Red">("Goal");
  const [loading, setLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  let homePlayers: { name: string; id: string }[] = [];
  let awayPlayers: { name: string; id: string }[] = [];
  const {
    data,
    isLoading,
    error,
    mutate: mutateMatch,
  } = useSWR("/api/public/match/detail?id=" + matchId, fetcher, {
    revalidateOnFocus: false,
  });

  const matches = mapMatchDetail(data?.data);

  if (matches?.homeTeam && matches?.awayTeam) {
    const {
      data: homeTeam,
      isLoading: load,
      error: er,
    } = useSWR("/api/public/player/team?id=" + matches?.homeTeam?.id, fetcher, {
      revalidateOnFocus: false,
    });
    homePlayers = mapPlayerNames(homeTeam?.data);

    const {
      data: awayTeam,
      isLoading: loading,
      error: err,
    } = useSWR("/api/public/player/team?id=" + matches?.awayTeam?.id, fetcher, {
      revalidateOnFocus: false,
    });
    awayPlayers = mapPlayerNames(awayTeam?.data);
  }

  const refreshScore = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await mutateMatch();

    setRefreshing(false);
  };

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventPlayer.trim()) return;
    toast.loading("adding event", { id: "1" });
    setLoading(true);
    const data = {
      playerId: eventPlayer,
      matchId: matches?.id,
      teamId: eventTeam,
      eventType,
      min: min,
    };

    const res = await fetch("/api/protected/manager/match/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res) {
      toast.error("no network", { id: "1" });
      setLoading(false);
      return [];
    }
    const response: ApiResponse = await res.json();
    if (!response.success) {
      toast.error(response.message, { id: "1" });
      setLoading(false);
      return;
    }
    toast.success("event created", { id: "1" });
    refreshScore();
    setEventPlayer("");
    setEventType("Goal");
    setEventTeam("home");
    setLoading(false);
  };

  const removeEvent = async (id: string) => {
    toast.loading("removing event", { id: "33" });
    const res = await fetch(
      `/api/protected/manager/match/event/remove?id=${id}`,
      {
        method: "DELETE",
      }
    );
    const resp: ApiResponse = await res.json();
    if (!resp.success) {
      toast.error(resp.message, { id: "33" });
      return;
    }
    toast.success("event removed", { id: "33" });
  };
  const statMatch = async () => {
    toast.loading("staring match");
    setStartLoading(true);
    const res = await fetch(
      "/api/protected/manager/match/start/?id=" + matchId,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!res) {
      toast.error("no network");
      return;
    }
    const data: ApiResponse = await res.json();
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    refreshScore();
    toast.success("match started");
    setStartLoading(false);
  };
  const endMatch = async () => {
    toast.loading("ending match");
    setEndLoading(true);
    const res = await fetch("/api/protected/manager/match/end/?id=" + matchId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    if (!res) {
      toast.error("no network");
      return;
    }
    const data: ApiResponse = await res.json();
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    toast.success("match ended successfully");
    refreshScore();
    setEndLoading(false);
  };
  const getEventIcon = (type: Event["type"]) => {
    switch (type) {
      case "Goal":
        return "⚽";
      case "Yellow":
        return "🟨";
      case "Red":
        return "🟥";
    }
  };

  const getEventColor = (type: Event["type"]) => {
    switch (type) {
      case "Goal":
        return "border-l-4 border-l-green-500 bg-green-50/50";
      case "Yellow":
        return "border-l-4 border-l-yellow-500 bg-yellow-50/50";
      case "Red":
        return "border-l-4 border-l-red-500 bg-red-50/50";

      default:
        return "border-l-4 border-l-gray-500 bg-gray-50/50";
    }
  };

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Toaster />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Match Details
              </h1>
              <p className="text-muted-foreground mt-1">
                Live match management and tracking
              </p>
            </div>
          </div>
          {matches?.status === "LIVE" && (
            <Badge className="px-4 py-1.5 text-sm font-semibold bg-green-500/10 text-green-600 border-green-200">
              <span className="animate-pulse mr-2">●</span>
              LIVE - {matches?.scheduledDate}'
            </Badge>
          )}
        </div>

        {/* Main Score Display */}
        <Card className="border-0 shadow-lg overflow-hidden mb-8">
          <CardContent className="p-0">
            <div className="bg-gray-400 text-white">
              <div className="container mx-auto px-8 py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Home Team */}
                  <div className="text-center flex-1">
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                        <Shield className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold">
                          {matches?.homeTeam.name}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="px-8 py-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="text-5xl md:text-7xl font-bold text-center mb-2 tracking-tighter">
                      {matches?.score.home}
                      <span className="mx-4 text-3xl md:text-5xl font-light">
                        :
                      </span>
                      {matches?.score.away}
                    </div>

                    {matches?.status === "LIVE" ? (
                      <p className="lg:mt-5 text-white/80 text-center text-sm font-medium">
                        Minute {matches?.scheduledDate}
                      </p>
                    ) : (
                      <p className="text-white/80 lg:mb-5 text-center text-sm font-medium">
                        FT
                      </p>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="text-center flex-1">
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold">
                          {matches?.awayTeam.name}
                        </h2>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                        <Shield className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList
            className={`grid w-full max-w-md ${
              matches?.status === "LIVE" ? "grid-cols-3" : "grid-cols-2"
            }`}
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Match Events</TabsTrigger>
            {matches?.status === "LIVE" && (
              <TabsTrigger value="controls">Live Controls</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Match Information */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Match Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-200">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            Venue
                          </p>
                          <p className="font-semibold text-foreground">
                            {matches?.venue}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-200">
                        <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            Start Time
                          </p>
                          <p className="font-semibold text-foreground">
                            {matches?.scheduledDate}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-200">
                        {/* <Whistle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" /> */}
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            Referee
                          </p>
                          <p className="font-semibold text-foreground">
                            {/* {matches?.} */}Referee
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-200">
                        <TrendingUp className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            Status
                          </p>
                          <p className="font-semibold text-primary capitalize">
                            {matches?.status}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-6 col-span-full" />
                    <div className="flex items-center justify-between flex-col rounded-lg gap-4 border bg-muted/40 p-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-medium">Match Control</p>
                        </div>
                      </div>

                      {matches?.status === "LIVE" ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={endMatch}
                          disabled={endLoading || refreshing}
                          className="gap-2"
                        >
                          <StopCircle className="w-4 h-4" />
                          End Match
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={statMatch}
                          disabled={startLoading || refreshing}
                          className="gap-2 bg-primary"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Start Match
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Stats */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {matches?.homeTeam.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">
                          Coach
                        </p>
                        <p className="font-semibold text-foreground text-lg">
                          {/* {matches?} */}Coach Ali
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">
                          Current Score
                        </p>
                        <p className="text-4xl font-bold text-primary mt-2">
                          {matches?.score.home}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {matches?.awayTeam.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">
                          Coach
                        </p>
                        <p className="font-semibold text-foreground text-lg">
                          {/* {matches?} */}Coach Maria
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">
                          Current Score
                        </p>
                        <p className="text-4xl font-bold text-primary mt-2">
                          {matches?.score.away}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Match Events Timeline</CardTitle>
                  <Badge variant="outline" className="font-normal">
                    {matches?.events.length} events
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {matches?.events.length > 0 ? (
                    matches?.events.map((event) => (
                      <div
                        key={event.id}
                        className={`p-4 rounded-lg flex items-center justify-between transition-all hover:shadow-sm ${getEventColor(
                          event.type
                        )}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-lg">
                            {getEventIcon(event.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground">
                                {event?.player?.name}
                              </p>
                              <Badge
                                variant="secondary"
                                className="text-xs font-normal"
                              >
                                {event?.team?.teamName}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 capitalize">
                              {event.type} • Minute {event.minute}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEvent(event.id)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No events recorded yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Use the Live Controls tab to add match events
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="controls" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <RotateCw className="w-5 h-5" />
                    Live Match Controls
                  </CardTitle>
                  <Button
                    onClick={refreshScore}
                    disabled={refreshing}
                    variant="outline"
                    size="sm"
                    className="gap-2 hover:bg-primary/40 transition-colors"
                  >
                    <RotateCw
                      className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={addEvent} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="eventTeam"
                        className="text-sm font-medium"
                      >
                        Team
                      </Label>
                      <Select
                        value={eventTeam}
                        onValueChange={(value) => {
                          setEventTeam(value);
                          if (value === matches?.homeTeam.id) {
                            setEventTeamSide("home");
                          } else if (value === matches?.awayTeam.id) {
                            setEventTeamSide("away");
                            setEventPlayer("");
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={matches?.homeTeam.id}>
                            {matches?.homeTeam.name}
                          </SelectItem>
                          <SelectItem value={matches?.awayTeam.id}>
                            {matches?.awayTeam.name}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="eventType"
                        className="text-sm font-medium"
                      >
                        Event Type
                      </Label>
                      <Select
                        value={eventType}
                        onValueChange={(value: "Goal" | "Yellow" | "Red") =>
                          setEventType(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Goal">
                            <div className="flex items-center gap-2">
                              <span>⚽</span>
                              <span>Goal</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Yellow">
                            <div className="flex items-center gap-2">
                              <span>🟨</span>
                              <span>Yellow Card</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Red">
                            <div className="flex items-center gap-2">
                              <span>🟥</span>
                              <span>Red Card</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="eventPlayer"
                        className="text-sm font-medium"
                      >
                        Player
                      </Label>
                      <Select
                        value={eventPlayer}
                        onValueChange={setEventPlayer}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select player" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTeamSide === "home"
                            ? homePlayers.map((player) => (
                                <SelectItem key={player.id} value={player.id}>
                                  {player.name}
                                </SelectItem>
                              ))
                            : awayPlayers.map((player) => (
                                <SelectItem key={player.id} value={player.id}>
                                  {player.name}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teamName" className="font-medium">
                        Min
                      </Label>
                      <Input
                        id="min"
                        name="min"
                        max={120}
                        placeholder="min "
                        value={min}
                        onChange={(e) => setMin(Number(e.target.value))}
                        required
                        className="h-10 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="flex-1 gap-2 bg-primary"
                      disabled={!eventPlayer || refreshing}
                    >
                      <Plus className="w-4 h-4" />
                      {loading ? "Adding Event Please Wait" : "Add Event"}
                    </Button>
                  </div>
                </form>

                {/* Quick Stats Update */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
