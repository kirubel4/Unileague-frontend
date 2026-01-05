"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  Filter,
  Calendar,
  Shield,
  MapPin,
  Search,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Tournament } from "@/app/(private)/admin/tournaments/page";
import { mapTournaments } from "@/app/(private)/admin/tournaments/util";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

// Mock tournaments data for filtering
// const TOURNAMENTS = [
//   { id: "1", name: "Winter Championship 2024", year: 2024 },
//   { id: "2", name: "Summer League 2024", year: 2024 },
//   { id: "3", name: "3rd Year Cup 2023", year: 2023 },
//   { id: "4", name: "4th Year Cup 2024", year: 2024 },
//   { id: "5", name: "5th Year Cup 2024", year: 2024 },
//   { id: "6", name: "CSE Major Tournament 2023", year: 2023 },
//   { id: "7", name: "ECE Major Tournament 2024", year: 2024 },
//   { id: "8", name: "All Departments Cup 2024", year: 2024 },
// ];

// Mock teams data with tournament association
const TEAMS = [
  {
    id: "1",
    name: "Software FC (CSE 3rd Year)",

    tournamentId: "3",
    tournamentName: "3rd Year Cup 2023",
    year: 2023,
    logo: "💻",
    coach: "Dr. Michael Chen",
    location: "Computer Science Dept",
  },
  {
    id: "2",
    name: "ECE Voltage",

    tournamentName: "Summer League 2024",
    year: 2024,
    logo: "⚡",
    coach: "Prof. Sarah Johnson",
    location: "ECE Department",
  },
  {
    id: "3",
    name: "Mechanical Mavericks",

    tournamentId: "1",
    tournamentName: "Winter Championship 2024",
    year: 2024,
    logo: "⚙️",
    coach: "Dr. Robert Kim",
    location: "Mechanical Engineering",
  },
  {
    id: "4",
    name: "Civil Constructors",
    tournamentId: "8",
    tournamentName: "All Departments Cup 2024",
    year: 2024,
    logo: "🏗️",
    coach: "Prof. David Miller",
    location: "Civil Engineering",
  },
  {
    id: "5",
    name: "BioTech United (5th Year)",
    tournamentId: "5",
    tournamentName: "5th Year Cup 2024",
    year: 2024,
    logo: "🧬",
    coach: "Dr. Lisa Wang",
    location: "Biotechnology Dept",
  },
  {
    id: "6",
    name: "Architecture FC",
    tournamentId: "4",
    tournamentName: "4th Year Cup 2024",
    year: 2024,
    logo: "🏛️",
    coach: "Prof. Alex Turner",
    location: "Architecture Dept",
  },
  {
    id: "7",
    name: "Chemical Engineers",

    tournamentId: "6",
    tournamentName: "CSE Major Tournament 2023",
    year: 2023,
    logo: "🧪",
    coach: "Dr. James Wilson",
    location: "Chemical Engineering",
  },
  {
    id: "8",
    name: "Physics Phantoms",
    tournamentId: "7",
    tournamentName: "ECE Major Tournament 2024",
    year: 2024,
    logo: "⚛️",
    coach: "Prof. Emma Davis",
    location: "Physics Department",
  },
];

// Extract unique years
const ALL_YEARS = Array.from(new Set(TEAMS.map((t) => t.year))).sort(
  (a, b) => b - a
);
const ALL_TOURNAMENTS = Array.from(
  new Set(TEAMS.map((t) => t.tournamentName))
).sort();

export default function TeamsPage() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState<number | "ALL">("ALL");
  const [selectedTournament, setSelectedTournament] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, error, isLoading } = useSWR("/api/public/tournament", fetcher, {
    revalidateOnFocus: false,
  });
  const TOURNAMENTS: Tournament[] = mapTournaments(data);
  const filteredTeams = useMemo(() => {
    let filtered = TEAMS;

    if (selectedYear !== "ALL") {
      filtered = filtered.filter((team) => team.year === selectedYear);
    }

    if (selectedTournament !== "ALL") {
      filtered = filtered.filter(
        (team) => team.tournamentName === selectedTournament
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.coach.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedYear, selectedTournament, searchQuery]);

  // Reset filters
  const resetFilters = () => {
    setSelectedYear("ALL");
    setSelectedTournament("ALL");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="relative px-6 py-24 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Shield className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  ASTU Football Teams
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                University{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                  Football Teams
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
                Discover all football teams representing different departments
                and years at ASTU. Track their performance across various
                tournaments.
              </p>
            </div>
          </div>
        </div>

        {/* Floating cards background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"></div>

        {/* Filters Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Filter Teams</h2>
              <p className="text-gray-600 mt-2">
                Find teams by year, tournament, or search by name/coach
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search teams, coach, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10  pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Year Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Filter by Year
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedYear("ALL")}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border
                  ${
                    selectedYear === "ALL"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-transparent"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
              >
                All Years
              </button>
              {ALL_YEARS.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border
                    ${
                      selectedYear === year
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-transparent"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          {/* Tournament Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Filter by Tournament
              </h3>
              <span className="text-sm text-gray-500">
                (
                {
                  TEAMS.filter(
                    (t) => selectedYear === "ALL" || t.year === selectedYear
                  ).length
                }{" "}
                tournaments available)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTournament("ALL")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                  ${
                    selectedTournament === "ALL"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
              >
                All Tournaments
              </button>
              {TOURNAMENTS.filter(
                (tournament) =>
                  selectedYear === "ALL" ||
                  new Date(tournament.startingDate).getFullYear() ===
                    selectedYear
              ).map((tournament) => (
                <button
                  key={tournament.id}
                  onClick={() =>
                    setSelectedTournament(tournament.tournamentName)
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                      ${
                        selectedTournament === tournament.tournamentName
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                >
                  {tournament.tournamentName}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {(selectedYear !== "ALL" ||
            selectedTournament !== "ALL" ||
            searchQuery) && (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">
                  Active filters:{" "}
                  {selectedYear !== "ALL" && `Year: ${selectedYear}`}
                  {selectedYear !== "ALL" &&
                    selectedTournament !== "ALL" &&
                    ", "}
                  {selectedTournament !== "ALL" &&
                    `Tournament: ${selectedTournament}`}
                  {searchQuery &&
                    (selectedYear !== "ALL" || selectedTournament !== "ALL"
                      ? ", "
                      : "")}
                  {searchQuery && `Search: "${searchQuery}"`}
                </span>
              </div>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Teams Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {filteredTeams.length} Team{filteredTeams.length !== 1 ? "s" : ""}{" "}
              Found
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Sorted by:</span>
              <select className="bg-transparent border-none focus:ring-0 text-gray-900 font-medium">
                <option>Points (High to Low)</option>
                <option>Rating (High to Low)</option>
                <option>Wins (High to Low)</option>
                <option>Name (A-Z)</option>
              </select>
            </div>
          </div>

          {filteredTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTeams.map((team) => (
                <Link
                  key={team.id}
                  href={`/teams/${team.id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="relative h-40 bg-gradient-to-r from-gray-900 to-gray-800">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {team.logo ? (
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-24 h-24 object-contain"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            <Shield className="w-12 h-12 text-white/60" />
                          </div>
                        )}
                      </div>

                      {/* Tournament Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                          <Trophy className="w-3 h-3 text-white" />
                          <span className="text-xs font-medium text-white">
                            {team.tournamentName}
                          </span>
                        </div>
                      </div>

                      {/* Year Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="px-2 py-1 rounded-lg bg-white/20 backdrop-blur-sm">
                          <span className="text-xs font-semibold text-white">
                            {team.year}
                          </span>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {team.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>Coach: {team.coach}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{team.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600 font-medium group-hover:gap-2 transition-all">
                            <span>View Team</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
                <Shield className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                No teams found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                No teams match your current filters. Try adjusting your search
                criteria or clear all filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Want to register a new team?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Register your department or year team for upcoming tournaments.
              Contact the ASTU Sports Committee for registration details.
            </p>
            <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95">
              Register New Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
