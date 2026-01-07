"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  UserPlus,
  Trophy,
  Users,
  ArrowLeft,
  User,
  Hash,
  Target,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { motion } from "framer-motion";

interface TeamData {
  teamId: string;
  teamName: string;
  tournamentName: string;
  tournamentId: string;
  maxPlayers: number;
  currentPlayers: number;
  validUntil: string;
}

interface PlayerFormData {
  firstName: string;
  lastName: string;
  jerseyNumber: string;
  position: string;
  email: string;
  phoneNumber: string;
}

const positions = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
  "Striker",
  "Winger",
  "Center Back",
  "Full Back",
  "Central Midfielder",
  "Attacking Midfielder",
  "Defensive Midfielder",
  "Captain",
];

export default function PlayerRegistrationPage() {
  const router = useRouter();
  const params = useParams();
  const teamKey = params.teamKey as string;

  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<PlayerFormData>({
    firstName: "",
    lastName: "",
    jerseyNumber: "",
    position: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    // Get team data from localStorage or verify token
    const storedTeamData = localStorage.getItem("teamData");
    if (!storedTeamData) {
      router.push("/register/team");
      return;
    }

    try {
      const parsedData = JSON.parse(storedTeamData);
      setTeamData(parsedData);
      setLoading(false);
    } catch (err) {
      setError("Invalid session. Please enter your team key again.");
      setTimeout(() => router.push("/register/team"), 2000);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePositionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, position: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Validate form
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First name and last name are required");
      setSubmitting(false);
      return;
    }

    if (!formData.jerseyNumber || !formData.position) {
      setError("Jersey number and position are required");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/players/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          teamKey,
          teamId: teamData?.teamId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      // Show success message
      toast.success("Player registered successfully!");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        jerseyNumber: "",
        position: "",
        email: "",
        phoneNumber: "",
      });

      // Update local team data
      if (teamData) {
        const updatedTeamData = {
          ...teamData,
          currentPlayers: teamData.currentPlayers + 1,
        };
        setTeamData(updatedTeamData);
        localStorage.setItem("teamData", JSON.stringify(updatedTeamData));
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      toast.error("Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading team information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/register/team")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Team Login
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Player Registration
              </h1>
              <p className="text-gray-600 mt-2">
                Register new players for your team
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 shadow-lg">
              <div className="text-right">
                <p className="text-sm text-gray-500">Available Slots</p>
                <p className="text-2xl font-bold text-blue-600">
                  {teamData
                    ? `${teamData.currentPlayers}/${teamData.maxPlayers}`
                    : "0/0"}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Team Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Trophy className="w-5 h-5" />
                  Tournament Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Tournament</p>
                    <p className="font-semibold text-lg text-gray-800">
                      {teamData?.tournamentName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Team</p>
                    <p className="font-semibold text-lg text-gray-800">
                      {teamData?.teamName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Team Key</p>
                    <div className="font-mono bg-gray-100 px-3 py-2 rounded-lg border">
                      {teamKey}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Registration Progress
                      </span>
                      <span className="font-semibold text-blue-600">
                        {teamData
                          ? Math.round(
                              (teamData.currentPlayers / teamData.maxPlayers) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: teamData
                            ? `${
                                (teamData.currentPlayers /
                                  teamData.maxPlayers) *
                                100
                              }%`
                            : "0%",
                        }}
                        transition={{ duration: 1 }}
                        className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-gray-700">
                  Registration Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Use real names</p>
                    <p className="text-xs text-gray-500">
                      Enter legal names as per ID
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Unique jersey numbers</p>
                    <p className="text-xs text-gray-500">
                      No duplicate numbers per team
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Correct positions</p>
                    <p className="text-xs text-gray-500">
                      Select primary playing position
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Registration Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      Register New Player
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Fill in the player's information below
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                {error && (
                  <Alert
                    variant="destructive"
                    className="mb-6 animate-in slide-in-from-top"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="firstName" className="text-base">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="h-12 text-base border-2"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="text-base">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="h-12 text-base border-2"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="jerseyNumber" className="text-base">
                        Jersey Number *
                      </Label>
                      <Input
                        id="jerseyNumber"
                        name="jerseyNumber"
                        type="number"
                        min="1"
                        max="99"
                        value={formData.jerseyNumber}
                        onChange={handleInputChange}
                        placeholder="7"
                        className="h-12 text-base border-2"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="position" className="text-base">
                        Position *
                      </Label>
                      <Select
                        value={formData.position}
                        onValueChange={handlePositionChange}
                        disabled={submitting}
                      >
                        <SelectTrigger className="h-12 text-base border-2">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map((position) => (
                            <SelectItem key={position} value={position}>
                              {position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-base">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="player@example.com"
                        className="h-12 text-base border-2"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="phoneNumber" className="text-base">
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        className="h-12 text-base border-2"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-gray-500">
                        Fields marked with * are required
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setFormData({
                              firstName: "",
                              lastName: "",
                              jerseyNumber: "",
                              position: "",
                              email: "",
                              phoneNumber: "",
                            })
                          }
                          disabled={submitting}
                          className="h-12 px-6"
                        >
                          Clear Form
                        </Button>

                        <Button
                          type="submit"
                          className="h-12 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Registering...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Register Player
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Recently Registered Players (Mock) */}
            <Card className="mt-6 border-2">
              <CardHeader>
                <CardTitle className="text-gray-700">Team Roster</CardTitle>
                <CardDescription>
                  Currently registered players for {teamData?.teamName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamData && teamData.currentPlayers > 0 ? (
                    Array.from({
                      length: Math.min(3, teamData.currentPlayers),
                    }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-medium">Player {i + 1}</p>
                            <p className="text-sm text-gray-500">
                              Jersey #{Math.floor(Math.random() * 99) + 1}
                            </p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {
                            positions[
                              Math.floor(Math.random() * positions.length)
                            ]
                          }
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No players registered yet
                    </p>
                  )}
                  {teamData && teamData.currentPlayers > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      + {teamData.currentPlayers - 3} more players registered
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
