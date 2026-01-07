"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  jerseyNumber: string;
  position: string;
}

interface RegisteredPlayer {
  playerName: string;
  position: string;
  jerseyNumber: number;
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

// Mock team data
const mockTeamData: TeamData = {
  teamId: "team_123",
  teamName: "Thunder Strikers",
  tournamentName: "Summer Soccer Cup 2024",
  tournamentId: "tournament_456",
  maxPlayers: 15,
  currentPlayers: 7,
  validUntil: "2024-12-31T23:59:59Z",
};

// Mock registered players
const mockPlayers: RegisteredPlayer[] = [
  {
    id: "1",
    playerName: "John",

    jerseyNumber: 7,
  },
  {
    id: "2",
    playerName: "John",

    jerseyNumber: 7,
  },
  {
    id: "3",
    playerName: "John",

    jerseyNumber: 7,
  },
  {
    id: "5",
    playerName: "John",

    jerseyNumber: 7,
  },
];

export default function PlayerRegistrationPage() {
  const router = useRouter();
  const [teamData, setTeamData] = useState<TeamData>(mockTeamData);
  const [registeredPlayers, setRegisteredPlayers] =
    useState<RegisteredPlayer[]>(mockPlayers);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<PlayerFormData>({
    playerName: "",
    jerseyNumber: "",
    position: "",
  });

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
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create new player
      const newPlayer: RegisteredPlayer = {
        playerName: formData.playerName,

        jerseyNumber: parseInt(formData.jerseyNumber),
        position: formData.position,
      };

      // Update state
      setRegisteredPlayers((prev) => [newPlayer, ...prev]);
      setTeamData((prev) => ({
        ...prev,
        currentPlayers: prev.currentPlayers + 1,
      }));

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
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      toast.error("Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-6">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/register/team")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Team Login</span>
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Player Registration
              </h1>
              <p className="text-gray-600 mt-1">
                Register new players for{" "}
                <span className="font-semibold text-blue-600">
                  {teamData.teamName}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border shadow-sm">
              <div className="text-right">
                <p className="text-sm text-gray-500">Available Slots</p>
                <p className="text-xl font-bold text-blue-600">
                  {teamData.currentPlayers}/{teamData.maxPlayers}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Team Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  Tournament Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 font-medium">
                    Tournament
                  </p>
                  <p className="font-semibold text-gray-900">
                    {teamData.tournamentName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 font-medium">Team</p>
                  <p className="font-semibold text-gray-900">
                    {teamData.teamName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 font-medium">Team Code</p>
                  <div className="font-mono bg-gray-100 px-3 py-2 rounded-lg border text-sm">
                    {teamData.teamId.toUpperCase()}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Registration Progress
                    </span>
                    <span className="font-semibold text-blue-600 text-sm">
                      {Math.round(
                        (teamData.currentPlayers / teamData.maxPlayers) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (teamData.currentPlayers / teamData.maxPlayers) * 100
                        }%`,
                      }}
                      transition={{ duration: 1 }}
                      className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-900 text-lg">
                  Registration Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      Use real names
                    </p>
                    <p className="text-xs text-gray-500">
                      Enter legal names as per ID
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Hash className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      Unique jersey numbers
                    </p>
                    <p className="text-xs text-gray-500">
                      No duplicate numbers per team
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      Correct positions
                    </p>
                    <p className="text-xs text-gray-500">
                      Select primary playing position
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Registration Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      Register New Player
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Fill in the player's information below
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium"
                      >
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="h-11"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="h-11"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="jerseyNumber"
                        className="text-sm font-medium"
                      >
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
                        className="h-11"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-sm font-medium">
                        Position *
                      </Label>
                      <Select
                        value={formData.position}
                        onValueChange={handlePositionChange}
                        disabled={submitting}
                      >
                        <SelectTrigger className="h-11">
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="player@example.com"
                        className="h-11"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        className="h-11"
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
                          className="h-11 px-6"
                        >
                          Clear Form
                        </Button>

                        <Button
                          type="submit"
                          className="h-11 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Registering...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
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

            {/* Team Roster */}
            <Card className="border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-900">
                      Team Roster
                    </CardTitle>
                    <CardDescription>
                      Currently registered players ({registeredPlayers.length}{" "}
                      of {teamData.maxPlayers})
                    </CardDescription>
                  </div>
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {registeredPlayers.length} Players
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {registeredPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          #{player.jerseyNumber}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {player.firstName} {player.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {player.email || "No email provided"}
                          </p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {player.position}
                      </div>
                    </div>
                  ))}
                </div>
                {teamData.currentPlayers < teamData.maxPlayers && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    {teamData.maxPlayers - teamData.currentPlayers} slots
                    remaining
                  </div>
                )}
                {teamData.currentPlayers >= teamData.maxPlayers && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-sm text-yellow-800 font-medium">
                      Team roster is full!
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
