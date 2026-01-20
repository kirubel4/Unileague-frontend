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
import { useMemo, useState } from "react";
import {
  Clock,
  MapPin,
  RotateCw,
  Trash2,
  Plus,
  StopCircle,
  TrendingUp,
  Calendar,
  User,
  AlertCircle,
  PlayCircle,
  ChevronUp,
  ChevronDown,
  Users,
  Check,
  X,
  Shield,
} from "lucide-react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { ApiResponse, fetcher, getCookie } from "@/lib/utils";
import {
  lineUpMapperBench,
  lineUpMapperRequests,
  lineUpMapperStarting,
  mapMatchDetail,
} from "./util";
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
  const [showLineups, setShowLineups] = useState(false);
  const [eventPlayer, setEventPlayer] = useState("");
  const [min, setMin] = useState(0);
  const [eventTeam, setEventTeam] = useState("");
  const [eventTeamSide, setEventTeamSide] = useState<"home" | "away">("home");
  const [eventType, setEventType] = useState<"Goal" | "Yellow" | "Red">("Goal");
  const [loading, setLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);

  const {
    data,
    isLoading,
    error,
    mutate: mutateMatch,
  } = useSWR(
    matchId ? `/api/public/match/detail?id=${matchId}` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const matches = useMemo(() => mapMatchDetail(data?.data), [data]);
  const homeTeamId = matches?.homeTeam?.id;
  const awayTeamId = matches?.awayTeam?.id;
  const mid = matches?.id;

  const { data: homeReq, mutate: mutateHome } = useSWR(
    homeTeamId && mid
      ? `/api/protected/manager/match/line-up/requests?id=${homeTeamId}&mid=${mid}`
      : null,
    fetcher,
  );

  const { data: awayReq, mutate: mutateAway } = useSWR(
    awayTeamId && mid
      ? `/api/protected/manager/match/line-up/requests?id=${awayTeamId}&mid=${mid}`
      : null,
    fetcher,
  );

  const { data: homeLineup } = useSWR(
    homeTeamId && mid
      ? `/api/public/match/line-up?mid=${mid}&id=${homeTeamId}`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  );
  const homePlayers = useMemo(
    () => lineUpMapperStarting(homeLineup?.data),
    [homeLineup],
  );

  const homeBench = useMemo(
    () => lineUpMapperBench(homeLineup?.data),
    [homeLineup],
  );

  const { data: awayLineup } = useSWR(
    awayTeamId && mid
      ? `/api/public/match/line-up?mid=${mid}&id=${awayTeamId}`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const awayPlayers = useMemo(
    () => lineUpMapperStarting(awayLineup?.data),
    [awayLineup],
  );

  const awayBench = useMemo(
    () => lineUpMapperBench(awayLineup?.data),
    [awayLineup],
  );
  const homeLineupRequest = useMemo(
    () => lineUpMapperRequests(homeReq?.data),
    [homeReq],
  );

  const awayLineupRequest = useMemo(
    () => lineUpMapperRequests(awayReq?.data),
    [awayReq],
  );

  const lineupRequests = useMemo(() => {
    const requests = [];
    if (homeLineupRequest.players.length > 0) {
      requests.push({
        teamId: homeTeamId,
        teamName: matches?.homeTeam?.name,
        players: homeLineupRequest.players,
        lineUpStatus: homeLineupRequest.status,
        lineupId: homeLineupRequest.players[0].lineupId,
      });
    }

    if (awayLineupRequest.players.length > 0) {
      requests.push({
        teamId: awayTeamId,
        teamName: matches?.awayTeam?.name,
        players: awayLineupRequest.players,
        lineUpStatus: awayLineupRequest.status,
        lineupId: awayLineupRequest.players[0].lineupId,
      });
    }

    return requests;
  }, [homeLineupRequest, awayLineupRequest, homeTeamId, awayTeamId, matches]);

  const approveLineUp = async (lineUpId: string) => {
    toast.loading("approving Line-Up", { id: "44" });
    const res = await fetch("/api/protected/manager/match/line-up/approve", {
      method: "PUT",
      body: JSON.stringify({
        lineUpId,
      }),
    });
    const response: ApiResponse = await res.json();
    if (!response.success) {
      toast.error(response.message, { id: "44" });
      return;
    }
    toast.success(response.message, { id: "44" });
    await mutateHome();
    await mutateAway();
  };
  const rejectLineUp = async (lineUpId: string) => {
    toast.loading("approving Line-Up", { id: "44" });
    const res = await fetch("/api/protected/manager/match/line-up/reject", {
      method: "PUT",
      body: JSON.stringify({
        lineUpId,
      }),
    });
    const response: ApiResponse = await res.json();
    if (!response.success) {
      toast.error(response.message, { id: "44" });
      return;
    }
    toast.success(response.message, { id: "44" });
    await mutateHome();
    await mutateAway();
  };
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
      },
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
      },
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
    toast.loading("ending match", { id: "99" });
    setEndLoading(true);
    const res = await fetch("/api/protected/manager/match/end/?id=" + matchId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    if (!res) {
      toast.error("no network", { id: "99" });
      return;
    }
    const data: ApiResponse = await res.json();
    if (!data.success) {
      toast.error(data.message, { id: "99" });
      return;
    }
    toast.success("match ended successfully", { id: "99" });
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
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Venue & Time */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-100/80">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            Venue
                          </p>
                          <p className="font-semibold text-foreground">
                            {matches?.venue || "TBD"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-100/80">
                        <Clock className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            Start Time
                          </p>
                          <p className="font-semibold text-foreground">
                            {matches?.scheduledDate || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Referee & Status */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-100/80">
                        <div className="w-5 h-5 flex items-center justify-center text-muted-foreground mt-0.5 shrink-0">
                          ⚽
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            Referee
                          </p>
                          <p className="font-semibold text-foreground">
                            Referee Name
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-100/80">
                        <TrendingUp className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">
                            Status
                          </p>
                          <p className="font-semibold text-primary capitalize">
                            {matches?.status || "Upcoming"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-2 col-span-full" />

                    {/* Lineup Request Section */}
                    <div className="col-span-full">
                      <Button
                        variant="outline"
                        className="w-full justify-between hover:bg-muted/50"
                        onClick={() => setShowLineups(!showLineups)}
                      >
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Lineup Requests (
                          {lineupRequests[0]?.players?.length > 0 &&
                          lineupRequests[1]?.players?.length > 0
                            ? 2
                            : lineupRequests[0]?.players?.length > 0 ||
                                lineupRequests[1]?.players?.length
                              ? 1
                              : 0}
                          )
                        </span>
                        {showLineups ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>

                      {showLineups && (
                        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                          {lineupRequests &&
                          lineupRequests?.length &&
                          (lineupRequests[0]?.players?.length > 0 ||
                            lineupRequests[1]?.players?.length > 0) ? (
                            lineupRequests.map((teamReq) => (
                              <div
                                key={teamReq.teamId}
                                className="border rounded-lg p-4 bg-white shadow-sm"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-bold text-sm text-primary">
                                    {teamReq.teamName}
                                  </h4>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() =>
                                        approveLineUp(
                                          teamReq.players[0].lineupId,
                                        )
                                      }
                                      size="sm"
                                      className="h-8 bg-green-600 hover:bg-green-700 text-white gap-1 px-3"
                                    >
                                      <Check className="w-3 h-3" /> Approve
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        rejectLineUp(
                                          teamReq.players[0].lineupId,
                                        )
                                      }
                                      size="sm"
                                      variant="destructive"
                                      className="h-8 gap-1 px-3"
                                    >
                                      <X className="w-3 h-3" /> Reject
                                    </Button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-1">
                                  {teamReq?.players?.map((player: any) => (
                                    <div
                                      key={player.id}
                                      className="text-xs flex justify-between py-1 border-b border-gray-50 last:border-0"
                                    >
                                      <span>
                                        <span className="font-mono text-muted-foreground mr-2">
                                          {player.number}
                                        </span>{" "}
                                        {player.name}
                                      </span>
                                      <span className="text-[10px] bg-gray-100 px-1.5 rounded text-gray-600 uppercase font-bold">
                                        {player.position}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-sm text-muted-foreground py-4">
                              No pending lineup requests.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Match Control Section */}
                    <div className="col-span-full flex items-center justify-between rounded-xl border bg-muted/30 p-4 mt-2">
                      <p className="text-sm font-semibold">Match Control</p>
                      {matches?.status === "LIVE" ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={endMatch}
                          disabled={endLoading || refreshing}
                          className="gap-2 shadow-lg shadow-red-100"
                        >
                          <StopCircle className="w-4 h-4" /> End Match
                        </Button>
                      ) : matches.status !== "FINISHED" ? (
                        <Button
                          size="sm"
                          onClick={statMatch}
                          disabled={startLoading || refreshing}
                          className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-blue-100"
                        >
                          <PlayCircle className="w-4 h-4" /> Start Match
                        </Button>
                      ) : (
                        <div></div>
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
                          event.type,
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
                            ? homePlayers.map((player: any) => (
                                <SelectItem key={player.id} value={player.id}>
                                  {player.name}
                                </SelectItem>
                              ))
                            : awayPlayers.map((player: any) => (
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
