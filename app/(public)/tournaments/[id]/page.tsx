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
    { revalidateOnFocus: true }
  );
  const tournament = mapTournamentApiToUI(tournamentRes ?? []);
  console.log(tournament);
  const { data: image } = useSWR(
    id ? `/api/public/gallery?id=${id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  const { data } = useSWR(
    id ? `/api/public/team/tournament?tid=${id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  const teams: Team[] = mapTeams(data || { data: [] });

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
  const liveMatch = false;
  if (!tournament) {
    return <div>Loading tournament...</div>;
  }

  return (
    <div
      key={id}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
    >
      {/* Back Navigation */}

      {/* Tournament Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800"
          style={{
            backgroundImage: tournament?.logurl
              ? `url(${tournament?.logurl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  tournament?.status
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
      {liveMatch && (
        <div className="bg-gradient-to-r from-red-600 to-orange-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="font-semibold">LIVE NOW</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="font-bold text-xl">
                    {/* {tournament?.liveMatch.homeTeam} */}
                  </div>
                  <div className="text-sm opacity-90">Home</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-3xl">
                    {/* {tournament?.liveMatch.score} */}
                  </div>
                  <div className="text-sm opacity-90">
                    {/* {tournament?.liveMatch.minute} */}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">
                    {/* {tournament?.liveMatch.awayTeam} */}
                  </div>
                  <div className="text-sm opacity-90">Away</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Watch Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Overview</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="teams"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Teams</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="matches"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5"
            >
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>Matches</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="standings"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>Standings</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="News"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5"
            >
              <div className="flex items-center gap-2">
                <NewspaperIcon className="w-4 h-4" />
                <span>News</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="memories"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-6 py-2.5"
            >
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Memories</span>
              </div>
            </TabsTrigger>
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

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Next Match</h3>
                <div className="flex items-center gap-2 text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Starts in 2 days</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">Engineering FC</div>
                  <div className="text-gray-600">Home</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Feb 22, 2024</div>
                  <div className="text-4xl font-bold text-gray-900">VS</div>
                  <div className="text-sm text-gray-500 mt-1">14:00 AST</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">Science United</div>
                  <div className="text-gray-600">Away</div>
                </div>
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
