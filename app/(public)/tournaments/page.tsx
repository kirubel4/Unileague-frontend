"use client";

import { useState, useMemo, useEffect } from "react";
import TournamentCardComponent from "@/components/tournament/cardComponent";
import {
  Calendar,
  Users,
  Trophy,
  ChevronRight,
  Filter,
  CalendarDays,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Tournament } from "@/app/(private)/admin/tournaments/page";
import { mapTournaments } from "@/app/(private)/admin/tournaments/util";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

// Mock data based on your Tournament interface

// Extract years from tournament dates
const getTournamentYear = (date: string) => new Date(date).getFullYear();

const STATUS_FILTERS = ["ALL", "UPCOMING", "ONGOING", "COMPLETED"] as const;

export default function TournamentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, error, isLoading } = useSWR("/api/public/tournament", fetcher, {
    revalidateOnFocus: false,
  });
  const tournaments: Tournament[] = mapTournaments(data);
  // Calculate statistics
  const ALL_YEARS = Array.from(
    new Set(tournaments.map((t) => getTournamentYear(t.startingDate)))
  ).sort((a, b) => b - a);
  const router = useRouter();
  const [activeYear, setActiveYear] = useState<number | null>();
  useEffect(() => {
    if (ALL_YEARS.length && activeYear === null) {
      // Pick the most recent tournament year
      setActiveYear(ALL_YEARS[0]);
    }
  }, [ALL_YEARS, activeYear]);
  const filteredTournaments = useMemo(() => {
    let filtered;

    filtered = tournaments.filter(
      (t) => getTournamentYear(t.startingDate) === activeYear
    );
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter((t) =>
        t.tournamentName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (!activeYear) filtered = tournaments;
    return filtered;
  }, [tournaments, activeYear, statusFilter, searchQuery]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status: Tournament["status"]) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "ONGOING":
        return "bg-green-100 text-green-700 border-green-200";
      case "COMPLETED":
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Handle card click
  const handleCardClick = (tournamentId: string) => {
    router.push(`/tournaments/${tournamentId}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="relative px-6 py-24 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Trophy className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  ASTU Football League
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                University{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Tournaments
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
                Discover, compete, and celebrate in ASTU&apos;s premier football
                tournaments. From freshmen cups to championship leagues.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="w-5 h-5" />
                  <span>{ALL_YEARS.length} Years of Competition</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="w-5 h-5" />
                  <span>
                    {tournaments?.reduce((sum, t) => sum + (t.teams || 0), 0)}{" "}
                    Teams
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating cards background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t  from-gray-50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Stats Cards */}

        {/* Filters Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Tournament Calendar
              </h2>
              <p className="text-gray-600 mt-2">
                Browse through ASTU&apos;s football tournaments by year and
                status
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-64"
                />
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Year Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Select Year
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_YEARS.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border
        ${
          activeYear === year
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-transparent"
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Filter by Status
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                    ${
                      statusFilter === status
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tournament Grid */}
        {filteredTournaments?.length > 0 ? (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Showing {filteredTournaments?.length} tournament
                {filteredTournaments?.length !== 1 ? "s" : ""}
              </h3>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments?.map((tournament) => (
                <div
                  key={tournament?.id}
                  onClick={() => handleCardClick(tournament.id)}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  {/* Tournament Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: tournament?.logurl
                          ? `url(${tournament.logurl})`
                          : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {!tournament?.logurl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Trophy className="w-16 h-16 text-gray-700" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          tournament?.status
                        )}`}
                      >
                        {tournament?.status}
                      </span>
                    </div>

                    {/* Year Badge */}
                    <div className="absolute top-4 right-4 bg-primary/50 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-white">
                        {getTournamentYear(tournament.startingDate)}
                      </span>
                    </div>
                  </div>

                  {/* Tournament Info */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {tournament?.tournamentName}
                    </h4>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(tournament?.startingDate)} -{" "}
                          {formatDate(tournament?.endingDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {tournament?.teams} Teams
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                        <span className="text-sm">View Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
              <Trophy className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No tournaments found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchQuery
                ? `No tournaments matching "${searchQuery}" found for ${activeYear}.`
                : `No ${
                    statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""
                  } tournaments found for ${activeYear}.`}
            </p>
            {(searchQuery || statusFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Show all tournaments
              </button>
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Want to host a tournament?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Get in touch with the ASTU Sports Committee to organize your own
              football tournament.
            </p>
            <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95">
              Contact Sports Committee
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
