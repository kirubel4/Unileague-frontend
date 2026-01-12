"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, Plus, RotateCcw, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { ManagerTableRow, mapManagersToTableRows } from "./util";
import { ApiResponse, fetcher } from "@/lib/utils";
import { toast, Toaster } from "sonner";
import ConfirmModal from "@/components/comfirm";

export default function AdminManagers() {
  const userName = "Admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [managers, setManagers] = useState<ManagerTableRow[]>([]);
  const [openModalId, setOpenModalId] = useState(false);
  const [selected, setSelected] = useState({
    id: "",
    name: "",
  });
  const {
    data,
    error,
    mutate: mutateManager,
  } = useSWR("/api/protected/admin/manager", fetcher, {
    revalidateOnFocus: false,
  });
  const resendCredentail = async (id: string, name: string) => {
    setOpenModalId(false);
    toast.loading("resting.....");
    const res = await fetch("/api/protected/admin/manager/credential/resend", {
      method: "POST",
      body: JSON.stringify({
        adminId: id,
        tournamentName: name,
      }),
    });
    const respon: ApiResponse = await res.json();
    if (respon.success) {
      toast.error(respon.message);
      return;
    }
    toast.success("resent");
  };
  useEffect(() => {
    if (data?.data) {
      setManagers(mapManagersToTableRows(data.data));
    }
  }, [data]);

  const filteredManagers = managers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDeleteAdmin(adminId: string, adminName: string) {
    if (!confirm(`Are you sure you want to delete admin: ${adminName}?`))
      return;

    try {
      const res = await fetch(
        `/api/protected/admin/manager/delete?id=${adminId}`,
        {
          method: "DELETE",
        }
      );
      const result: ApiResponse = await res.json();
      if (!result.success) {
        alert(result.data.message);
      }

      if (result.success) {
        alert(result.data.message || "Admin deleted successfully!");
        setManagers((prev) => prev.filter((admin) => admin.id !== adminId));
        await mutateManager();
      } else {
        alert(
          "Failed to delete: " +
            (result.data?.message || result.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting admin");
    }
  }

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <Toaster />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Managers</h1>
          <p className="text-muted-foreground mt-1">
            Manage tournament managers
          </p>
        </div>
        <Link href="/admin/managers/create">
          <Button className="bg-primary hover:bg-blue-600 text-white rounded-lg gap-2 h-10">
            <Plus className="w-4 h-4" /> Add Manager
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 h-8 rounded"
                          onClick={() => {
                            setOpenModalId(true);
                            setSelected({
                              id: manager.id,
                              name: manager.assignedTournament,
                            });
                          }}
                        >
                          <Send className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 h-8 rounded text-destructive hover:bg-red-50"
                          onClick={() =>
                            handleDeleteAdmin(manager.id, manager.name)
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
      <ConfirmModal
        isOpen={openModalId}
        onConfirm={() => resendCredentail(selected.id, selected.name)}
        onCancel={() => setOpenModalId(false)}
        message="Do you want reset credential And send it to their email?"
      />
    </Layout>
  );
}
