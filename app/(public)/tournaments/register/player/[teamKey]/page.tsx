"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Users,
  Trophy,
  UserPlus,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Upload,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { ApiResponse, fetcher } from "@/lib/utils";
import useSWR from "swr";
import { Player } from "@/components/pages/teamDetail";
import { mapApiPlayersToPlayers } from "@/app/(private)/manager/teams/[id]/util";

const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

export default function PlayerRegistrationPage() {
  const params = useParams();
  const id = params.teamKey as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    data,
    error: err,
    isLoading,
  } = useSWR("/api/public/team/detail?id=" + id, fetcher, {
    revalidateOnFocus: false,
  });
  const {
    data: players,
    error: erro,
    isLoading: loadin,
    mutate: mutatePlayer,
  } = useSWR("/api/public/player/team?id=" + id, fetcher, {
    revalidateOnFocus: false,
  });
  const playerz: Player[] = mapApiPlayersToPlayers(players?.data);
  const teamDetail = data?.data ?? {};
  const [form, setForm] = useState({
    playerName: "",
    jerseyNumber: "",
    position: "",
  });
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (
      !form.playerName ||
      !form.jerseyNumber ||
      !form.position ||
      !imageFile
    ) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append("name", form.playerName);
    fd.append("position", form.position);
    fd.append("teamId", id);
    fd.append("number", form.jerseyNumber);
    fd.append("playerPhoto", imageFile);

    const res = await fetch("/api/public/player/register", {
      method: "POST",
      body: fd,
    });
    const result: ApiResponse = await res.json();
    if (!result || !res) {
      setError("Check Your Internet Connection");
      setLoading(false);
      return;
    }
    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }
    toast.success("Player registered successfully!");
    setForm({ playerName: "", jerseyNumber: "", position: "" });
    await mutatePlayer();
    setImageFile(null);
    setLoading(false);
  };

  const progress = (10 / 20) * 100;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading team information...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-4 md:p-6">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {teamDetail?.tournaments?.[0]?.tournament?.tournamentName ??
                    ""}
                </h2>
                <p className="text-sm text-gray-600">Active Tournament</p>
              </div>
            </div>
          </div>

          {/* Team Name and Stats */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border shadow-sm rounded-xl p-4 md:p-5">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {teamDetail?.teamName ?? ""}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Registration Open</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  Team Code:{" "}
                  <span className="font-mono font-medium">
                    {teamDetail.registrationKey ?? ""}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Players Count */}
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-lg border">
                <div className="text-center md:text-right">
                  <p className="text-xs text-gray-500">Players Registered</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {10}
                    <span className="text-gray-400 text-lg font-normal">
                      /{20}
                    </span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="hidden md:block w-32">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-2 rounded-full bg-linear-to-r from-green-400 to-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* LEFT - Form Section */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-white">
                      Register New Player
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Fill in the player details below
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="playerName">Player Name</Label>
                    <Input
                      id="playerName"
                      value={form.playerName}
                      onChange={(e) =>
                        setForm({ ...form, playerName: e.target.value })
                      }
                      disabled={loading}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jerseyNumber">Jersey Number</Label>
                      <Input
                        id="jerseyNumber"
                        type="number"
                        min={1}
                        max={99}
                        value={form.jerseyNumber}
                        onChange={(e) =>
                          setForm({ ...form, jerseyNumber: e.target.value })
                        }
                        disabled={loading}
                        placeholder="1-99"
                      />
                    </div>

                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Select
                        value={form.position}
                        onValueChange={(v) => setForm({ ...form, position: v })}
                        disabled={loading}
                      >
                        <SelectTrigger id="position">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label>Image Preview</Label>
                    {previewImage ? (
                      <div className="relative rounded-lg overflow-hidden border border-border">
                        <div className="aspect-video bg-muted relative">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-primary/10 rounded-full">
                            <Upload className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              Click to select image
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Register
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT - Roster Section */}
          <div className="space-y-6">
            {/* Team Details Card */}

            {/* Registered Players Roster */}
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Registered Players</CardTitle>
                    <CardDescription>
                      {playerz?.length} players · {20 - playerz?.length} spots
                      available
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    <Users className="w-4 h-4" />
                    <span>Roster</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {playerz?.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-4 p-4 rounded-xl border bg-white hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center font-bold text-lg">
                        #{p.number}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            {p.position}
                          </span>
                          <span className="text-xs text-gray-500">
                            Player ID: {p.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {playerz?.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No players registered yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Register the first player using the form
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
