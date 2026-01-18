// app/coach/lineup-requests/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download } from "lucide-react";
import { LineupReq, LineupRequest } from "./type";
import { RequestFilters } from "@/components/pages/RequestFilters";
import { RequestCard } from "@/components/pages/RequestCard";

// Mock data function
const generateMockLineupRequests = (): LineupRequest[] => {
  const teams = [
    { id: "1", name: "Manchester United", short: "MUN" },
    { id: "2", name: "Liverpool FC", short: "LIV" },
    { id: "3", name: "Chelsea FC", short: "CHE" },
    { id: "4", name: "Arsenal FC", short: "ARS" },
    { id: "5", name: "Manchester City", short: "MCI" },
    { id: "6", name: "Tottenham Hotspur", short: "TOT" },
    { id: "7", name: "Leicester City", short: "LEI" },
    { id: "8", name: "West Ham United", short: "WHU" },
  ];

  const venues = [
    "Old Trafford",
    "Anfield",
    "Stamford Bridge",
    "Emirates Stadium",
    "Etihad Stadium",
    "Tottenham Hotspur Stadium",
    "King Power Stadium",
    "London Stadium",
  ];

  const approvers = [
    { username: "admin.john" },
    { username: "referee.mike" },
    { username: "manager.sarah" },
    { username: "director.tom" },
    { username: "coordinator.lisa" },
  ];

  const statuses = [
    LineupReq.WAITING,
    LineupReq.REQUESTED,
    LineupReq.APPROVED,
    LineupReq.REJECTED,
  ];

  const requests: LineupRequest[] = [];

  for (let i = 1; i <= 15; i++) {
    const homeTeam = teams[Math.floor(Math.random() * teams.length)];
    let awayTeam;
    do {
      awayTeam = teams[Math.floor(Math.random() * teams.length)];
    } while (awayTeam.id === homeTeam.id);

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const submittedDate = new Date();
    submittedDate.setDate(
      submittedDate.getDate() - Math.floor(Math.random() * 30),
    );

    const approvedDate =
      status === LineupReq.APPROVED || status === LineupReq.REJECTED
        ? new Date(submittedDate.getTime() + Math.random() * 86400000 * 2) // Within 2 days
        : null;

    requests.push({
      id: `req-${i}`,
      state: status,
      submittedAt: submittedDate,
      approvedAt: approvedDate,
      approvedBy:
        status === LineupReq.APPROVED || status === LineupReq.REJECTED
          ? approvers[Math.floor(Math.random() * approvers.length)]
          : null,
      match: {
        id: `match-${i}`,
        date: new Date(Date.now() + Math.random() * 86400000 * 14), // Within 14 days
        venue: venues[Math.floor(Math.random() * venues.length)],
        homeTeam: {
          id: homeTeam.id,
          teamName: homeTeam.name,
          logo: `/teams/${homeTeam.id}/logo.png`,
        },
        awayTeam: {
          id: awayTeam.id,
          teamName: awayTeam.name,
          logo: `/teams/${awayTeam.id}/logo.png`,
        },
      },
    });
  }

  // Sort by date (most recent first)
  return requests.sort(
    (a, b) => b.submittedAt!.getTime() - a.submittedAt!.getTime(),
  );
};

export default function LineupRequestsPage() {
  const [requests, setRequests] = useState<LineupRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LineupRequest[]>([]);
  const [activeFilter, setActiveFilter] = useState<LineupReq | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load mock data on component mount
  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      const mockData = generateMockLineupRequests();
      setRequests(mockData);
      setFilteredRequests(mockData); // Initially show all
      setIsLoading(false);
    }, 800); // 800ms delay to simulate network request

    return () => clearTimeout(timer);
  }, []);

  // Filter requests whenever filter criteria or search query changes
  useEffect(() => {
    const filterRequests = () => {
      let filtered = [...requests];

      // Apply status filter
      if (activeFilter !== "ALL") {
        filtered = filtered.filter((request) => request.state === activeFilter);
      }

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (request) =>
            request.match.homeTeam.teamName.toLowerCase().includes(query) ||
            request.match.awayTeam.teamName.toLowerCase().includes(query) ||
            request.match.venue.toLowerCase().includes(query) ||
            request.approvedBy?.username.toLowerCase().includes(query),
        );
      }

      return filtered;
    };

    setFilteredRequests(filterRequests());
  }, [activeFilter, searchQuery, requests]);

  const getStats = () => {
    return {
      total: requests.length,
      waiting: requests.filter((r) => r.state === LineupReq.WAITING).length,
      requested: requests.filter((r) => r.state === LineupReq.REQUESTED).length,
      approved: requests.filter((r) => r.state === LineupReq.APPROVED).length,
      rejected: requests.filter((r) => r.state === LineupReq.REJECTED).length,
    };
  };

  const stats = getStats();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lineup requests...</p>
        </div>
      </div>
    );
  }

  const handleRefreshData = () => {
    setIsLoading(true);
    const mockData = generateMockLineupRequests();
    setRequests(mockData);
    setFilteredRequests(mockData);
    setIsLoading(false);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(filteredRequests, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `lineup-requests-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by team name, venue, or approver..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  // Sort functionality
                  const sorted = [...filteredRequests].sort(
                    (a, b) => a.match.date.getTime() - b.match.date.getTime(),
                  );
                  setFilteredRequests(sorted);
                }}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Sort by Date
              </button>
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4">
            <RequestFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border">
              <div className="text-gray-400 mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {requests.length === 0
                    ? "No lineup requests found"
                    : "No matching requests found"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || activeFilter !== "ALL"
                    ? "Try adjusting your search or filter"
                    : "No lineup requests have been created yet"}
                </p>
                {searchQuery || activeFilter !== "ALL" ? (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter("ALL");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={handleRefreshData}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    Generate New Mock Data
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">
                  Showing {filteredRequests.length} of {requests.length}{" "}
                  requests
                </p>
                <p className="text-sm text-gray-500">
                  {activeFilter === "ALL"
                    ? "All statuses"
                    : `Filtered by: ${activeFilter.toLowerCase()}`}
                </p>
              </div>
              {filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
