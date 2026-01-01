"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layout } from "@/components/Layout";
import { ApiResponse, fetcher } from "@/lib/utils";
import { ChevronLeft, Save, X, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { mapManagersToTableRows } from "../../../managers/util";

type TournamentManager = {
  id: string;
  name: string;
  email: string;
};

type Tournament = {
  id: string;
  tournamentName: string;
  startingDate: string;
  endingDate: string;
  description: string;
  venue: string;
  sponsor?: string;
  status: string;
  teamCount: number;
  playerCount: number;
  managers: TournamentManager[];
};

type ChangeLog = {
  field: string;
  oldValue: string;
  newValue: string;
};

export default function AdminTournamentEdit() {
  const userName = "Admin";
  const params = useParams();
  const router = useRouter();
  const id = params?.id ?? "";

  const [originalData, setOriginalData] = useState<Tournament | null>(null);
  const [formData, setFormData] = useState<Tournament | null>(null);
  const [changes, setChanges] = useState<ChangeLog[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showAddManager, setShowAddManager] = useState(false);

  const { data: tournamentRes, isLoading } = useSWR(
    id ? `/api/public/tournament/detail?id=${id}` : null,
    fetcher
  );

  const {
    data,
    error,
    mutate: mutateManager,
  } = useSWR("/api/protected/admin/manager", fetcher, {
    revalidateOnFocus: false,
  });
  const managers = mapManagersToTableRows(data?.data);
  const freeManagers = managers.filter(
    (manger) => manger.assignedTournament === "None"
  );
  console.log(managers);
  const assignedManager = managers.filter(
    (manager) => manager.assignedTournament === formData?.tournamentName
  );

  useEffect(() => {
    if (tournamentRes?.data?.data) {
      const tournament = tournamentRes.data.data;
      setOriginalData(tournament);
      setFormData(tournament);
      const assignedManagerIds = new Set(
        tournament.managers?.map((m: any) => m.id) || []
      );
    }
  }, [tournamentRes]);

  const trackChanges = useCallback(() => {
    if (!originalData || !formData) return [];

    const changesList: ChangeLog[] = [];
    const fieldsToCheck: (keyof Tournament)[] = [
      "tournamentName",
      "startingDate",
      "endingDate",
      "description",
      "venue",
      "sponsor",
      "status",
    ];

    fieldsToCheck.forEach((field) => {
      const oldVal = String(originalData[field] || "");
      const newVal = String(formData[field] || "");

      if (oldVal !== newVal) {
        changesList.push({
          field,
          oldValue: oldVal,
          newValue: newVal,
        });
      }
    });
    const oldManagers = assignedManager || [];
    const newManagers = assignedManager || [];
    oldManagers.forEach((oldManager) => {
      const stillExists = newManagers.some((m) => m.id === oldManager.id);
      if (!stillExists) {
        changesList.push({
          field: "managers",
          oldValue: oldManager.name,
          newValue: "(removed)",
        });
      }
    });
    newManagers.forEach((newManager) => {
      const wasAlready = oldManagers.some((m) => m.id === newManager.id);
      if (!wasAlready) {
        changesList.push({
          field: "managers",
          oldValue: "(not assigned)",
          newValue: newManager.name,
        });
      }
    });

    return changesList;
  }, [originalData, formData]);

  useEffect(() => {
    const newChanges = trackChanges();
    setChanges(newChanges);
  }, [formData, trackChanges]);

  const handleInputChange = (field: keyof Tournament, value: string) => {
    if (!formData) return;

    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleAddManager = async () => {
    if (!selectedManagerId) return;
    console.log({ managerId: selectedManagerId, tournamentId: id });
    const res = await fetch("/api/protected/admin/manager/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ managerId: selectedManagerId, id }),
    });

    setSelectedManagerId("");
    await mutateManager();
    setShowAddManager(false);
  };

  // Remove a manager
  const handleRemoveManager = async (managerId: string) => {
    const res = await fetch("/api/protected/admin/manager/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ managerId: managerId, id }),
    });
    const response: ApiResponse = await res.json();
    if (!response.success) {
      console.log(response.message);
      return;
    }
    await mutateManager();
  };

  // Save changes
  const handleSave = async () => {
    if (!formData || changes.length === 0) return;

    setIsSaving(true);
    try {
      // This is where you'd make your API call
      console.log("Saving changes:", changes);
      console.log("Updated data:", formData);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // After successful save, redirect back
      router.push(`/admin/tournaments/${id}`);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    router.push(`/admin/tournaments/${id}`);
  };

  // Format field names for display
  const formatFieldName = (field: string): string => {
    const fieldMap: Record<string, string> = {
      tournamentName: "Tournament Name",
      startingDate: "Start Date",
      endingDate: "End Date",
      description: "Description",
      venue: "Venue",
      sponsor: "Sponsor",
      status: "Status",
      managers: "Manager",
    };

    return fieldMap[field] || field;
  };

  if (isLoading) {
    return (
      <Layout role="super_admin" userName={userName}>
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!formData) {
    return (
      <Layout role="super_admin" userName={userName}>
        <div className="flex items-center justify-center h-64">
          <p>Tournament not found</p>
        </div>
      </Layout>
    );
  }

  const isSaveDisabled = changes.length === 0 || isSaving;

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Link href={`/admin/tournaments/${id}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Tournament
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Edit Tournament
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Update tournament details
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="rounded-lg gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className={`rounded-lg gap-2 ${
                isSaveDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Tournament Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Tournament Name
                </label>
                <Input
                  value={formData.tournamentName || ""}
                  onChange={(e) =>
                    handleInputChange("tournamentName", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.startingDate || ""}
                    onChange={(e) =>
                      handleInputChange("startingDate", e.target.value)
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={formData.endingDate || ""}
                    onChange={(e) =>
                      handleInputChange("endingDate", e.target.value)
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Venue
                </label>
                <Input
                  value={formData.venue || ""}
                  onChange={(e) => handleInputChange("venue", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Sponsor (Optional)
                </label>
                <Input
                  value={formData.sponsor || ""}
                  onChange={(e) => handleInputChange("sponsor", e.target.value)}
                  className="w-full"
                  placeholder="Enter sponsor name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPCOMING">Upcoming</SelectItem>
                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                    <SelectItem value="FINISHED">Finished</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full min-h-[100px]"
                  placeholder="Enter tournament description"
                />
              </div>
            </div>
          </div>

          {/* Managers Section */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Assigned Managers
            </h2>

            {/* Current Managers */}
            <div className="space-y-3 mb-4">
              {(assignedManager || []).map((manager) => (
                <div
                  key={manager.id}
                  className="border border-border rounded-lg p-4 flex-col items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {manager.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {manager.email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded hover:bg-red-300 transition-all "
                    onClick={() => handleRemoveManager(manager.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Manager Section */}
            {!showAddManager ? (
              <Button
                variant="outline"
                className="w-full rounded-lg"
                onClick={() => setShowAddManager(true)}
              >
                Add Manager
              </Button>
            ) : (
              <div className="border border-border rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
                    Select Manager
                  </label>
                  <Select
                    value={selectedManagerId}
                    onValueChange={setSelectedManagerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {freeManagers?.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name} ({manager.email})
                        </SelectItem>
                      ))}
                      {freeManagers?.length === 0 && (
                        <SelectItem value="none" disabled>
                          No Free managers available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-col gap-2">
                  <Button
                    onClick={handleAddManager}
                    disabled={!selectedManagerId}
                    className="flex-1 mb-2"
                  >
                    Add Selected Manager
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddManager(false);
                      setSelectedManagerId("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    No Free Manger?
                    <Link
                      href="/admin/managers/create"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Create new manager
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Changes Preview */}
        <div className="space-y-6">
          {/* Changes Preview */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Changes Preview
            </h2>

            {changes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No changes made yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Make changes to enable save button
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">
                  {changes.length} change{changes.length !== 1 ? "s" : ""} to
                  save:
                </p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {changes.map((change, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg p-3 bg-muted/20"
                    >
                      <p className="font-medium text-sm text-foreground mb-1">
                        {formatFieldName(change.field)}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Old:</p>
                          <p className="line-through text-foreground truncate">
                            {change.oldValue}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">New:</p>
                          <p className="text-foreground font-medium truncate">
                            {change.newValue}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Save Button for mobile view */}
          <div className="lg:hidden bg-white rounded-lg border border-border p-4">
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaveDisabled}
                className={`w-full ${
                  isSaveDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
