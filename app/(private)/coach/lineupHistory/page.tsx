// app/coach/lineup-requests/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download } from "lucide-react";
import { LineupReq, LineupRequest } from "./type";
import { RequestFilters } from "@/components/pages/RequestFilters";
import { RequestCard } from "@/components/pages/RequestCard";
import { ApiResponse } from "@/lib/utils";

async function fetchLineUpHistory() {
  const res = await fetch("/api/protected/coach/lineUpHistory");
  const response: ApiResponse = await res.json();
  const data: LineupRequest[] = response?.data ?? [];

  return data;
}
export default function LineupRequestsPage() {
  const [requests, setRequests] = useState<LineupRequest[] | []>([]);
  const [filteredRequests, setFilteredRequests] = useState<
    LineupRequest[] | []
  >([]);
  const [activeFilter, setActiveFilter] = useState<LineupReq | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const apiData = await fetchLineUpHistory();
      setRequests(apiData);
      setFilteredRequests(apiData);
    } catch (error) {
      console.error("Failed to load lineup history", error);
    } finally {
      setIsLoading(false);
    }
  };

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
  const handleRefreshData = async () => {
    setIsLoading(true);
    await loadData();
  };

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
                    (a, b) =>
                      new Date(a.match.scheduledDate).getTime() -
                      new Date(b.match.scheduledDate).getTime(),
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
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("ALL");
                  }}
                  className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
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
