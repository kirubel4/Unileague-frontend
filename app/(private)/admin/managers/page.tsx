"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Trash2, Edit, Plus, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Manager {
  id: number;
  name: string;
  email: string;
  assignedTournament: string;
  status: "active" | "inactive";
  joinDate: string;
}

export default function AdminManagers() {
  const userName = localStorage.getItem("userName") || "Admin";
  const [searchTerm, setSearchTerm] = useState("");

  const managers: Manager[] = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      assignedTournament: "City League Championship",
      status: "active",
      joinDate: "Jan 10, 2024",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      assignedTournament: "City League Championship",
      status: "active",
      joinDate: "Jan 12, 2024",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      assignedTournament: "Regional Cup",
      status: "active",
      joinDate: "Feb 5, 2024",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      assignedTournament: "None",
      status: "inactive",
      joinDate: "Dec 20, 2023",
    },
  ];

  const filteredManagers = managers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Managers</h1>
          <p className="text-muted-foreground mt-1">
            Manage tournament managers
          </p>
        </div>
        <Link href="/admin/managers/create">
          <Button className="bg-primary hover:bg-blue-600 text-white rounded-lg gap-2 h-10">
            <Plus className="w-4 h-4" />
            Add Manager
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-border p-4 mb-6">
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg h-9"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Assigned Tournament
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Join Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredManagers.length > 0 ? (
                filteredManagers.map((manager) => (
                  <tr
                    key={manager.id}
                    className="border-b border-border hover:bg-muted transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-foreground">
                      {manager.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {manager.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {manager.assignedTournament}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          manager.status === "active"
                            ? "status-active"
                            : "status-finished"
                        }`}
                      >
                        {manager.status.charAt(0).toUpperCase() +
                          manager.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {manager.joinDate}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/managers/${manager.id}/edit`}>
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
                          className="gap-1 h-8 rounded"
                          onClick={() =>
                            alert(
                              "Password reset email sent to " + manager.email
                            )
                          }
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 h-8 rounded text-destructive hover:bg-red-50"
                          onClick={() =>
                            alert("Delete manager: " + manager.name)
                          }
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
                    colSpan={6}
                    className="py-8 px-4 text-center text-muted-foreground"
                  >
                    No managers found
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
