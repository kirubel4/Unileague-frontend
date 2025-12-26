"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Tournament {
  id: number;
  name: string;
  year: number;
  status: "upcoming" | "ongoing" | "finished";
  teams: number;
  managers: number;
  startDate: string;
  endDate: string;
}

export default function AdminTournaments() {
  const userName = localStorage.getItem("userName") || "Admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "upcoming" | "ongoing" | "finished"
  >("all");
  const [yearFilter, setYearFilter] = useState<string>("all");

  const tournaments: Tournament[] = [
    {
      id: 1,
      name: "City League Championship",
      year: 2024,
      status: "ongoing",
      teams: 16,
      managers: 2,
      startDate: "Jan 2024",
      endDate: "May 2024",
    },
    {
      id: 2,
      name: "Regional Cup",
      year: 2024,
      status: "upcoming",
      teams: 12,
      managers: 1,
      startDate: "Jun 2024",
      endDate: "Aug 2024",
    },
    {
      id: 3,
      name: "Summer Tournament",
      year: 2024,
      status: "finished",
      teams: 20,
      managers: 3,
      startDate: "Jul 2023",
      endDate: "Sep 2023",
    },
    {
      id: 4,
      name: "Youth Championship",
      year: 2024,
      status: "ongoing",
      teams: 8,
      managers: 1,
      startDate: "Mar 2024",
      endDate: "Jun 2024",
    },
  ];

  const filteredTournaments = tournaments.filter((t) => {
    const matchesSearch = t.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesYear =
      yearFilter === "all" || t.year.toString() === yearFilter;
    return matchesSearch && matchesStatus && matchesYear;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ongoing":
        return "status-ongoing";
      case "upcoming":
        return "status-scheduled";
      case "finished":
        return "status-finished";
      default:
        return "status-pending";
    }
  };

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Tournaments
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage all tournaments in the system
          </p>
        </div>
        <Link href="/admin/tournaments/create" className="w-full sm:w-auto">
          <Button className="bg-primary hover:bg-blue-600 text-white rounded-lg gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Create Tournament
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-border p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground block mb-2">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg h-9 w-full"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground block mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full h-9 px-3 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground block mb-2">
              Year
            </label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full h-9 px-3 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] md:min-w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                {[
                  "Name",
                  "Year",
                  "Status",
                  "Teams",
                  "Managers",
                  "Period",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-2 sm:px-4 font-semibold text-sm sm:text-sm text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTournaments.length > 0 ? (
                filteredTournaments.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border hover:bg-muted transition-colors"
                  >
                    <td className="py-2 px-2 sm:px-4 text-sm font-medium text-foreground">
                      {t.name}
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-sm text-muted-foreground">
                      {t.year}
                    </td>
                    <td className="py-2 px-2 sm:px-4">
                      <span
                        className={`text-xs font-semibold ${getStatusBadgeClass(
                          t.status
                        )}`}
                      >
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-sm text-muted-foreground">
                      {t.teams}
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-sm text-muted-foreground">
                      {t.managers}
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-sm text-muted-foreground">
                      {t.startDate} - {t.endDate}
                    </td>
                    <td className="py-2 px-2 sm:px-4">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/tournaments/${t.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 h-8 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/tournaments/${t.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 h-8 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 h-8 rounded text-destructive hover:bg-red-50"
                          onClick={() => alert("Delete tournament: " + t.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 px-4 text-center text-muted-foreground"
                  >
                    No tournaments found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
