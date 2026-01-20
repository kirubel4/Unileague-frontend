"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  Trophy,
  MapPin,
  Clock,
  ChevronLeft,
  Share2,
  Bookmark,
  Award,
  Image as ImageIcon,
  CalendarDays,
  BarChart3,
  AlertCircle,
  NewspaperIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { MatchList } from "@/components/pages/MatchList";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-select";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import {
  GalleryImg,
  mapGalleryResponse,
} from "@/app/(private)/manager/gallery/util";
import { Badge } from "@/components/ui/badge";
import Standings from "@/app/(private)/manager/standings/standing";
import { mapTournamentApiToUI } from "./utility";
import { mapTeams, Team } from "@/app/(private)/manager/players/transfer/util";
import Link from "next/link";
import { MatchCard } from "@/components/pages/publicMatchListing";
import { mapLiveMatchesToUI } from "../../matches/utility";
import NewsListing from "@/components/pages/NewsListing";
export default function TournamentDetailPage() {
  const params = useParams();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: tournamentRes } = useSWR(
    id ? `/api/public/tournament/detail?id=${id}` : null,
    fetcher,
    { revalidateOnFocus: true },
  );
  const tournament = mapTournamentApiToUI(tournamentRes ?? []);
  console.log(tournament);
  const { data: image } = useSWR(
    id ? `/api/public/gallery?id=${id}` : null,
    fetcher,
    { revalidateOnFocus: false },
  );
  const { data } = useSWR(
    id ? `/api/public/team/tournament?tid=${id}` : null,
    fetcher,
    { revalidateOnFocus: false },
  );
  const teams: Team[] = mapTeams(data || { data: [] });
  const {
    data: live,
    isLoading,
    error,
  } = useSWR(`/api/public/match/live/tournament?id=${id}`, fetcher, {
    revalidateOnFocus: false,
  });
  const liveMatches = mapLiveMatchesToUI(live);
  const {
    data: upComing,
    isLoading: load,
    error: err,
  } = useSWR("/api/public/match/up-coming", fetcher, {
    revalidateOnFocus: false,
  });
  const upcomingMatches = mapLiveMatchesToUI(upComing);
  const images: GalleryImg[] = mapGalleryResponse(image?.data || { data: [] });
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "text-blue-600 bg-blue-100";
      case "ONGOING":
        return "text-green-600 bg-green-100";
      case "COMPLETED":
        return "text-gray-600 bg-gray-100";
      case "LIVE":
        return "text-red-600 bg-red-100 animate-pulse";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (!tournament) {
    return <div>Loading tournament...</div>;
  }

  return (
    <div key={id} className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Back Navigation */}

      {/* Tournament Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-linear-to-r from-gray-900 to-gray-800"
          style={{
            backgroundImage: tournament?.logurl
              ? `url(${tournament?.logurl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  tournament?.status,
                )}`}
              >
                {tournament?.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {tournament?.tournamentName}
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl">
              {formatDate(tournament?.startingDate)} -{" "}
              {formatDate(tournament?.endingDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">Championship</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5" />
                <span className="font-medium">{tournament?.teams} Teams</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{tournament?.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>
              <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Match Banner */}
      {liveMatches && liveMatches.length > 0 && (
        <div className="bg-linear-to-r from-red-600 via-red-500 to-orange-500 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <Link
              href={`/matches/${liveMatches[0].id}`}
              className="block group"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                {/* LIVE badge with animation */}
                <div className="flex items-center gap-2 sm:gap-3 self-start md:self-center">
                  <div className="relative">
                    <div className="w-3 h-3 bg-white rounded-full animate-ping absolute" />
                    <div className="w-3 h-3 bg-white rounded-full relative" />
                  </div>
                  <span className="font-bold tracking-wider text-white text-sm sm:text-base">
                    LIVE NOW
                  </span>
                </div>

                {/* Match info */}
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between gap-4 sm:gap-6 md:gap-8">
                    {/* Home team */}
                    <div className="text-right min-w-25 sm:min-w-30 md:min-w-35">
                      <div className="font-bold text-lg sm:text-xl md:text-2xl truncate text-white">
                        {liveMatches[0].teamA.name}
                      </div>
                      <div className="text-xs sm:text-sm text-white/80 mt-0.5">
                        Home
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-center px-2 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <span className="font-black text-3xl sm:text-4xl md:text-5xl text-white drop-shadow-lg">
                          {liveMatches[0].teamA.score}
                        </span>
                        <span className="text-xl sm:text-2xl text-white/80 font-semibold">
                          –
                        </span>
                        <span className="font-black text-3xl sm:text-4xl md:text-5xl text-white drop-shadow-lg">
                          {liveMatches[0].teamB.score}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-white/80 mt-1 sm:mt-2 px-2 py-1 bg-white/10 rounded-full inline-block">
                        {liveMatches[0].round}
                      </div>
                    </div>

                    {/* Away team */}
                    <div className="text-left min-w-25 sm:min-w-30 md:min-w-35">
                      <div className="font-bold text-lg sm:text-xl md:text-2xl truncate text-white">
                        {liveMatches[0].teamB.name}
                      </div>
                      <div className="text-xs sm:text-sm text-white/80 mt-0.5">
                        Away
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="self-end md:self-center">
                  <div className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 transform group-hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm sm:text-base">Watch Live</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full "
        >
          <TabsList className="mb-8 bg-gray-100 p-1 rounded-xl flex gap-1 overflow-x-auto scrollbar-hide">
            {[
              { value: "overview", label: "Overview", Icon: Calendar },
              { value: "teams", label: "Teams", Icon: Users },
              { value: "matches", label: "Matches", Icon: CalendarDays },
              { value: "standings", label: "Standings", Icon: BarChart3 },
              { value: "News", label: "News", Icon: NewspaperIcon },
              { value: "memories", label: "Memories", Icon: ImageIcon },
            ].map(({ value, label, Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 font-medium text-sm rounded-lg transition-all flex-1 justify-center"
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline text-sm font-medium">
                  {label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Overview Card */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Tournament Overview
                </h2>
                <p className="text-gray-600 mb-6">{tournament?.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="font-medium">
                          {formatDate(tournament?.startingDate)} -{" "}
                          {formatDate(tournament?.endingDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Venue</div>
                        <div className="font-medium">
                          {tournament?.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Prize</div>
                        <div className="font-medium">{tournament?.prize}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <Users className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Organizer</div>
                        <div className="font-medium">
                          {tournament?.organizer}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tournament Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Teams</span>
                    <span className="font-bold text-gray-900">
                      {tournament?.teams}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Days Remaining</span>
                    <span className="font-bold text-gray-900">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Matches Played</span>
                    <span className="font-bold text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Goals</span>
                    <span className="font-bold text-gray-900">45</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Section header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Upcoming Matches
                  </h2>
                  <p className="text-sm text-gray-600">
                    Matches scheduled for next week — don’t miss the action
                  </p>
                </div>
              </div>

              {/* Match cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Registered Teams
                </h2>
                <p className="text-gray-600 mt-2">
                  All teams participating in the tournament
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                        Team
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                        Players
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                        Coach
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                        Power
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {teams?.map((item) => (
                      <tr
                        key={item?.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Team (Clickable) */}
                        <td className="py-4 px-6">
                          <Link
                            href={`/teams/${item?.id}`}
                            className="flex items-center gap-3 font-medium text-gray-900 hover:text-blue-600"
                          >
                            <img
                              src={item?.logoUrl ?? "/notfound"}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span>{item?.name}</span>
                          </Link>
                        </td>

                        {/* Player Count */}
                        <td className="py-4 px-6">{item?.playerCount}</td>

                        {/* Coach */}
                        <td className="py-4 px-6">{item?.coachName ?? "—"}</td>

                        {/* Power */}
                        <td className="py-4 px-6 font-semibold">
                          {item?.power}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <div className="space-y-6">
              <MatchList
                mode={"public"}
                title=" Matches of tournament"
                description="View Matches"
                apiEndpoint={`/api/public/match?id=${id}`}
                className="mt-8"
              />
            </div>
          </TabsContent>

          {/* Standings Tab */}
          <TabsContent value="standings">
            <Standings id={id} />
          </TabsContent>
          <TabsContent value="News">
            <NewsListing
              apiEndpoint={`/api/public/news/tournament?tid=${id}`}
              page={page}
              setPage={setPage}
              searchTerm={searchTerm}
              mapper="manager"
            />
          </TabsContent>

          {/* Memories Tab */}
          <TabsContent value="memories">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    Gallery ({images?.length} images)
                  </h3>
                  <Badge variant="outline" className="font-normal">
                    {images?.length} of {images.length} showing
                  </Badge>
                </div>

                {images?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images?.map((image) => (
                      <Card
                        key={image.id}
                        className="overflow-hidden group hover:shadow-lg transition-shadow"
                      >
                        <div className="relative aspect-video overflow-hidden bg-muted">
                          <img
                            src={image.url}
                            alt={"image.title"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />

                          <Badge className="absolute top-3 left-3 capitalize">
                            {image.category}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                                {image.teamName}
                              </h3>
                            </div>

                            <Separator />

                            <div className="space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Team
                                </span>
                                <span className="font-medium text-foreground">
                                  {image.teamName ? (
                                    <div className="flex items-center gap-1">
                                      <div className="w-2 h-2 rounded-full" />
                                      {image.teamName}
                                    </div>
                                  ) : (
                                    "Tournament"
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Usage
                                </span>
                                <span className="font-medium text-foreground">
                                  {image.usage}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No images found</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        No Image is uploaded to this Field
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
