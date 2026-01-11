// components/MatchList.tsx
"use client";
import { fetcher } from "@/lib/utils";
import Link from "next/link";
import { useState, useMemo } from "react";
import useSWR from "swr";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Filter,
  PlayCircle,
  CheckCircle,
  CalendarClock,
  ChevronRight,
  AlertCircle,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED";

export interface ApiMatch {
  id: string;
  scheduledDate: string;
  venue: string;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  matchWeek: number | null;
  homeTeam: {
    id: string;
    teamName: string;
  };
  awayTeam: {
    id: string;
    teamName: string;
  };
}

interface MatchListProps {
  // Control the view mode
  mode?: "admin" | "public";

  // Optional title override
  title?: string;
  description?: string;

  // Optional custom API endpoint
  apiEndpoint?: string;

  // Optional initial filters
  initialTab?: "scheduled" | "live" | "completed";
  initialSearch?: string;
  initialVenue?: string;

  // Optional callback when match is clicked
  onMatchClick?: (matchId: string) => void;

  // Optional custom loading and error components
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;

  // Optional className for container
  className?: string;
}

const formatDateTime = (value: string) => {
  const [time, date] = value.split(" ");
  return { time, date };
};

export function MatchList({
  mode = "admin",
  title = "Tournament Matches",
  description = "Monitor and manage all tournament matches",
  apiEndpoint = "/api/public/match",
  initialTab = "scheduled",
  initialSearch = "",
  initialVenue = "all",
  onMatchClick,
  loadingComponent,
  errorComponent,
  className = "",
}: MatchListProps) {
  const [activeTab, setActiveTab] = useState<
    "scheduled" | "live" | "completed"
  >(initialTab);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedVenue, setSelectedVenue] = useState<string>(initialVenue);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data, isLoading, error } = useSWR(apiEndpoint, fetcher, {
    revalidateOnFocus: false,
  });

  const apiMatches: ApiMatch[] = data?.data ?? [];

  // Extract unique venues for filter
  const venues = useMemo(() => {
    const uniqueVenues = new Set(apiMatches.map((match) => match.venue));
    return ["all", ...Array.from(uniqueVenues)];
  }, [apiMatches]);

  // Filter matches based on active tab, search, and venue
  const filteredMatches = useMemo(() => {
    let filtered = apiMatches.filter((match) => {
      if (activeTab === "scheduled") return match.status === "SCHEDULED";
      if (activeTab === "live") return match.status === "LIVE";
      return match.status === "FINISHED";
    });

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (match) =>
          match.homeTeam.teamName.toLowerCase().includes(query) ||
          match.awayTeam.teamName.toLowerCase().includes(query) ||
          match.venue.toLowerCase().includes(query)
      );
    }

    // Apply venue filter
    if (selectedVenue !== "all") {
      filtered = filtered.filter((match) => match.venue === selectedVenue);
    }

    return filtered;
  }, [apiMatches, activeTab, searchQuery, selectedVenue]);

  // Group scheduled matches by date
  const matchesByDate = useMemo(() => {
    if (activeTab !== "scheduled") return {};

    return filteredMatches.reduce((groups, match) => {
      const { date } = formatDateTime(match.scheduledDate);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(match);
      return groups;
    }, {} as Record<string, ApiMatch[]>);
  }, [filteredMatches, activeTab]);

  const getTabConfig = (tab: typeof activeTab) => {
    const config = {
      scheduled: {
        icon: CalendarClock,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
      },
      live: {
        icon: PlayCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      },
      completed: {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
      },
    };
    return config[tab];
  };

  // Handle match click
  const handleMatchClick = (matchId: string) => {
    if (onMatchClick) {
      onMatchClick(matchId);
      return;
    }

    // Default behavior based on mode
    if (mode === "admin") {
      window.location.href = `/manager/matches/${matchId}`;
    } else {
      window.location.href = `/matches/${matchId}`;
    }
  };

  // Custom loading component
  if (isLoading) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading matches...</p>
          </div>
        </div>
      )
    );
  }

  // Custom error component
  if (error) {
    return (
      errorComponent || (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">Failed to load matches</p>
          </div>
          <p className="text-sm text-red-600 mt-2">
            Please try refreshing the page or check your connection.
          </p>
        </div>
      )
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header - Admin mode has extra buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>

        {mode === "admin" && (
          <Link href="/manager/matches/create">
            <Button className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Create Match</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Filters Section - Only show in admin mode or with props */}
      {(mode === "admin" || searchQuery || selectedVenue !== "all") && (
        <>
          {/* Mobile Filters */}
          <div className="lg:hidden">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(true)}
                className="gap-2"
              >
                <Filter className="w-3 h-3" />
                Filters
                {(searchQuery || selectedVenue !== "all") && (
                  <span className="bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    1
                  </span>
                )}
              </Button>

              {(searchQuery || selectedVenue !== "all") && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Search: {searchQuery}
                      <button
                        onClick={() => setSearchQuery("")}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedVenue !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Venue: {selectedVenue}
                      <button
                        onClick={() => setSelectedVenue("all")}
                        className="hover:text-green-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:block bg-white rounded-xl border border-border shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search matches by team or venue..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="all">All Venues</option>
                  {venues.slice(1).map((venue) => (
                    <option key={venue} value={venue}>
                      {venue}
                    </option>
                  ))}
                </select>
              </div>

              {(searchQuery || selectedVenue !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedVenue("all");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-xl border border-border p-2">
        {["scheduled", "live", "completed"].map((tab) => {
          const Icon = getTabConfig(tab as typeof activeTab).icon;
          const count = filteredMatches.filter((m) => {
            if (tab === "scheduled") return m.status === "SCHEDULED";
            if (tab === "live") return m.status === "LIVE";
            return m.status === "FINISHED";
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 font-medium text-sm rounded-lg transition-all flex-1 justify-center ${
                activeTab === tab
                  ? `${getTabConfig(tab as typeof activeTab).bg} ${
                      getTabConfig(tab as typeof activeTab).border
                    } border shadow-sm`
                  : "hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  activeTab === tab
                    ? getTabConfig(tab as typeof activeTab).color
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={
                  activeTab === tab
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                }
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab
                    ? "bg-white text-gray-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-6 lg:space-y-8">
        {activeTab === "scheduled" && (
          <>
            {Object.entries(matchesByDate).length === 0 ? (
              <div className="text-center py-12 bg-linear-to-br from-gray-50 to-white rounded-2xl border border-dashed border-gray-200">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No scheduled matches
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery || selectedVenue !== "all"
                    ? "Try changing your search or filter"
                    : "No matches scheduled yet"}
                </p>
              </div>
            ) : (
              Object.entries(matchesByDate).map(([date, matches]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <h3 className="text-base lg:text-lg font-bold text-foreground truncate">
                      {date}
                    </h3>
                    <span className="text-xs lg:text-sm text-muted-foreground ml-2 whitespace-nowrap">
                      • {matches.length} match{matches.length > 1 ? "es" : ""}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
                    {matches.map((match) => {
                      const { time } = formatDateTime(match.scheduledDate);

                      return (
                        <div
                          key={match.id}
                          onClick={() => handleMatchClick(match.id)}
                          className="bg-linear-to-br from-white to-blue-50 rounded-xl border border-blue-100 p-4 lg:p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group cursor-pointer"
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold text-blue-700 text-sm lg:text-base">
                                  {time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600 truncate">
                                  {match.venue}
                                </span>
                              </div>
                            </div>
                            {match.matchWeek && (
                              <span className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                Week {match.matchWeek}
                              </span>
                            )}
                          </div>

                          {/* Teams */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="text-center flex-1">
                                <p className="font-bold text-base lg:text-lg text-gray-900 truncate px-2">
                                  {match.homeTeam.teamName}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Home
                                </p>
                              </div>
                              <div className="mx-2 lg:mx-4">
                                <div className="px-3 lg:px-4 py-2 bg-gray-100 rounded-lg">
                                  <span className="text-sm font-bold text-gray-700">
                                    VS
                                  </span>
                                </div>
                              </div>
                              <div className="text-center flex-1">
                                <p className="font-bold text-base lg:text-lg text-gray-900 truncate px-2">
                                  {match.awayTeam.teamName}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Away
                                </p>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                {mode === "admin"
                                  ? "Click to manage"
                                  : "View details"}
                              </span>
                              {mode === "admin" ? (
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                              ) : (
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "live" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
            {filteredMatches.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-linear-to-br from-gray-50 to-white rounded-2xl border border-dashed border-gray-200">
                <PlayCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No live matches</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery || selectedVenue !== "all"
                    ? "Try changing your search or filter"
                    : "No matches are currently live"}
                </p>
              </div>
            ) : (
              filteredMatches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => handleMatchClick(match.id)}
                  className="bg-linear-to-br from-white to-red-50 rounded-xl border-2 border-red-500 shadow-lg p-4 lg:p-5 hover:shadow-xl transition-all duration-200 cursor-pointer"
                >
                  {/* Live Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                      <span className="font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm">
                        🔴 LIVE NOW
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {match.venue}
                      </span>
                    </div>
                  </div>

                  {/* Teams & Score */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 items-center text-center">
                      <div>
                        <p className="font-bold text-base lg:text-lg text-gray-900 truncate px-2">
                          {match.homeTeam.teamName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Home</p>
                      </div>
                      <div>
                        <div className="bg-red-100 py-3 rounded-xl">
                          <div className="text-2xl lg:text-3xl font-black text-red-700">
                            {match.homeScore} - {match.awayScore}
                          </div>
                          <div className="text-xs text-red-600 font-medium mt-1">
                            LIVE SCORE
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-base lg:text-lg text-gray-900 truncate px-2">
                          {match.awayTeam.teamName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Away</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-red-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-600">
                            Started {formatDateTime(match.scheduledDate).time}
                          </span>
                        </div>
                        {mode === "admin" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMatchClick(match.id);
                            }}
                          >
                            <PlayCircle className="w-3 h-3" />
                            Update Score
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
            {filteredMatches.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-linear-to-br from-gray-50 to-white rounded-2xl border border-dashed border-gray-200">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No completed matches
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery || selectedVenue !== "all"
                    ? "Try changing your search or filter"
                    : "No matches have been completed yet"}
                </p>
              </div>
            ) : (
              filteredMatches.map((match) => {
                const { time, date } = formatDateTime(match.scheduledDate);

                return (
                  <div
                    key={match.id}
                    onClick={() => handleMatchClick(match.id)}
                    className="bg-linear-to-br from-white to-green-50 rounded-xl border border-green-100 p-4 lg:p-5 hover:shadow-md hover:border-green-200 transition-all duration-200 group cursor-pointer"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-gray-700">
                            {date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {match.venue}
                        </span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="grid grid-cols-3 items-center text-center">
                      <div>
                        <p className="font-bold text-base lg:text-lg text-gray-900 truncate px-2">
                          {match.homeTeam.teamName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Home</p>
                      </div>
                      <div>
                        <div className="bg-green-100 py-3 rounded-xl">
                          <div className="text-2xl lg:text-3xl font-black text-green-700">
                            {match.homeScore} - {match.awayScore}
                          </div>
                          <div className="text-xs text-green-600 font-medium mt-1">
                            FINAL SCORE
                          </div>
                        </div>

                        {/* Winner indicator */}
                        {match.homeScore !== null &&
                          match.awayScore !== null && (
                            <div className="mt-2">
                              <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                                {match.homeScore > match.awayScore
                                  ? `${
                                      match.homeTeam.teamName.split(" ")[0]
                                    } Wins`
                                  : match.homeScore < match.awayScore
                                  ? `${
                                      match.awayTeam.teamName.split(" ")[0]
                                    } Wins`
                                  : "Draw"}
                              </span>
                            </div>
                          )}
                      </div>
                      <div>
                        <p className="font-bold text-base lg:text-lg text-gray-900 truncate px-2">
                          {match.awayTeam.teamName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Away</p>
                      </div>
                    </div>

                    {match.matchWeek && (
                      <div className="pt-4 mt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Match Week {match.matchWeek}
                          </span>
                          {mode === "admin" ? (
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                          ) : (
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
