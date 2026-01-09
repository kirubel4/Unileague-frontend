// components/TeamDetail.tsx
"use client";
import { useState } from "react";
import {
  Users,
  Trophy,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Shield,
  Flag,
  Award,
  BarChart3,
  Edit,
  Trash2,
  Download,
  Share2,
  UserPlus,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  CalendarDays,
  Target,
  Star,
  Eye,
  Search,
  Loader2,
  AlertCircle,
  ImageIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { MatchList } from "./MatchList";
import { TabsContent } from "@radix-ui/react-tabs";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@radix-ui/react-select";
import {
  GalleryImg,
  mapGalleryResponse,
} from "@/app/(private)/manager/gallery/util";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { MatchCard } from "./publicMatchListing";
import { mapLiveMatchesToUI } from "@/app/(public)/matches/utility";

// Types
export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
}

export interface TeamStats {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: string;
  points: number;
  position: number;
  form: string[];
}

export interface TeamData {
  id: string;
  name: string;
  coach: string;
  coachEmail: string;
  logo?: string;
}

interface TeamDetailProps {
  // Mode control
  mode: "admin" | "public";

  // Team data
  teamData: TeamData;
  players: Player[];
  id: string;
  stats: TeamStats;

  // Loading states
  isLoading?: boolean;
  error?: string | null;

  // Actions
  onDeleteTeam?: () => void;
  onEditTeam?: () => void;
  onAddPlayer?: () => void;
  onShareTeam?: () => void;
  onExportData?: () => void;

  // Navigation
  basePath?: string; // e.g., '/manager/teams' or '/teams'

  // Customization
  title?: string;
  showBreadcrumb?: boolean;
  className?: string;
}

export function TeamDetail({
  mode = "public",
  teamData,
  players = [],
  id,
  stats,
  isLoading = false,
  error = null,
  onDeleteTeam,
  onEditTeam,
  onAddPlayer,
  basePath = mode === "admin" ? "/manager/teams" : "/teams",
  title,
  showBreadcrumb = true,
  className = "",
}: TeamDetailProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "players" | "matches" | "stats" | "memories"
  >("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const {
    data: image,
    error: err,
    isLoading: loadImage,
    mutate: mutateImage,
  } = useSWR(`/api/public/gallery?id=${id}`, fetcher, {
    revalidateOnFocus: false,
  });
  const { data, isLoading: load } = useSWR(
    `/api/public/match/recent/team?id=${id}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const recentMatches = mapLiveMatchesToUI(data);
  const images: GalleryImg[] = mapGalleryResponse(image?.data || { data: [] });

  // Filter players by search
  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = () => {
    if (mode === "admin") {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
      if (onDeleteTeam) onDeleteTeam();
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700">Loading Team Details</p>
            <p className="text-sm text-gray-500 mt-2">
              Fetching team information, players, and statistics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        className={`bg-white rounded-xl border border-red-200 p-8 ${className}`}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to Load Team
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">{error}</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Team Info */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {mode === "admin" && (
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    {teamData.name}
                  </h1>
                </div>
              </div>
            </div>
          )}
          {/* Admin Actions */}
          {mode === "admin" && (
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" className="gap-2" onClick={onEditTeam}>
                <Edit className="w-4 h-4" />
                Edit Team
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-6 bg-white rounded-xl border border-gray-200 p-2">
        {[
          { id: "overview" as const, label: "Overview", icon: BarChart3 },
          { id: "players" as const, label: "Players", icon: Users },
          { id: "matches" as const, label: "Matches", icon: CalendarDays },
          { id: "stats" as const, label: "Statistics", icon: Trophy },
          { id: "memories" as const, label: "Memories", icon: ImageIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 font-medium text-sm rounded-lg transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? "bg-blue-50 border border-blue-200 text-primary shadow-sm"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Team Info Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Team Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Head Coach</p>
                      <p className="font-medium text-gray-900">
                        {teamData.coach}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Coach Contact
                      </p>
                      <div className="space-y-1">
                        <a
                          href={`mailto:${teamData.coachEmail}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Mail className="w-4 h-4" />
                          {teamData.coachEmail}
                        </a>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="font-medium text-gray-900 flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        NAN
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Matches */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Recent Matches
                      </h2>
                      <p className="text-sm text-gray-500">
                        Results from recently completed fixtures
                      </p>
                    </div>
                  </div>

                  {/* Optional badge */}
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    Last Week
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mb-6" />

                {/* Match cards */}
                <div className="grid grid-cols-1  ">
                  {recentMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Admin Actions & Form */}
            <div className="space-y-6">
              {/* Admin Actions */}
              {mode === "admin" && (
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-4 lg:p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start gap-2"
                      onClick={onAddPlayer}
                    >
                      <UserPlus className="w-4 h-4" />
                      Add Player
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={onEditTeam}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Team Details
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full justify-start gap-2 ${
                        deleteConfirm
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "text-red-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50"
                      }`}
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="w-4 h-4" />
                      {deleteConfirm ? "Deleting..." : "Delete Team"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Current Form */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Current Form
                </h3>
                <div className="flex gap-2">
                  {stats.form.map((result, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center font-bold text-sm lg:text-base ${
                        result === "W"
                          ? "bg-green-100 text-green-800"
                          : result === "D"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Players Tab */}
        {activeTab === "players" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-lg font-bold text-gray-900">Team Roster</h2>
                <div className="flex gap-3">
                  <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search players..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full md:w-64 text-sm"
                    />
                  </div>
                  {mode === "admin" && (
                    <Button className="gap-2" onClick={onAddPlayer}>
                      <UserPlus className="w-4 h-4" />
                      Add Player
                    </Button>
                  )}
                </div>
              </div>

              {filteredPlayers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">
                    No players found{searchTerm && ` matching "${searchTerm}"`}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-left text-xs lg:text-sm font-semibold text-gray-600">
                          Player
                        </th>
                        <th className="py-3 px-4 text-left text-xs lg:text-sm font-semibold text-gray-600">
                          Number
                        </th>
                        <th className="py-3 px-4 text-left text-xs lg:text-sm font-semibold text-gray-600">
                          Position
                        </th>

                        {mode === "admin" && (
                          <th className="py-3 px-4 text-left text-xs lg:text-sm font-semibold text-gray-600">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlayers.map((player) => (
                        <tr
                          key={player.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-900 text-sm">
                                {player.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-gray-900 text-sm">
                              #{player.number}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 lg:px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              {player.position}
                            </span>
                          </td>

                          {mode === "admin" && (
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === "matches" && (
          <MatchList
            mode={mode}
            title=" Matches Fixture"
            description="View Matches "
            apiEndpoint={`/api/public/match/team?id=${id}`}
            className="mt-8"
          />
        )}

        {/* Statistics Tab */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Statistics */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Season Statistics
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Matches Played", value: stats.matchesPlayed },
                  { label: "Wins", value: stats.wins, color: "text-green-600" },
                  {
                    label: "Draws",
                    value: stats.draws,
                    color: "text-yellow-600",
                  },
                  {
                    label: "Losses",
                    value: stats.losses,
                    color: "text-red-600",
                  },
                  {
                    label: "Goals For",
                    value: stats.goalsFor,
                    color: "text-blue-600",
                  },
                  {
                    label: "Goals Against",
                    value: stats.goalsAgainst,
                    color: "text-red-600",
                  },
                  {
                    label: "Goal Difference",
                    value: stats.goalDifference,
                    color: "text-green-600",
                  },
                  {
                    label: "Points",
                    value: stats.points,
                    color: "text-purple-600",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-600 text-sm">{stat.label}</span>
                    <span
                      className={`font-bold text-sm ${
                        stat.color || "text-gray-900"
                      }`}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Performance Metrics
              </h2>
              <div className="space-y-6">
                {/* Win Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm">Win Rate</span>
                    <span className="font-bold text-green-600 text-sm">
                      {((stats.wins / stats.matchesPlayed) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(stats.wins / stats.matchesPlayed) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Goals Per Match */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm">
                      Goals Per Match
                    </span>
                    <span className="font-bold text-blue-600 text-sm">
                      {(stats.goalsFor / stats.matchesPlayed).toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.goalsFor / stats.matchesPlayed) * 20
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Clean Sheets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm">Clean Sheets</span>
                    <span className="font-bold text-purple-600 text-sm">8</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: "40%" }}
                    />
                  </div>
                </div>

                {/* Average Possession */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm">
                      Average Possession
                    </span>
                    <span className="font-bold text-orange-600 text-sm">
                      58.4%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: "58.4%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "memories" && (
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
        )}
      </div>
    </div>
  );
}
