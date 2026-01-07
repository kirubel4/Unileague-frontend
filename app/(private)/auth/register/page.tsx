"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Shield, Users, Trophy } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster, toast } from "sonner";

export default function TeamRegistrationAuth() {
  const router = useRouter();
  const [teamKey, setTeamKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      //   const response = await fetch("/api/teams/verify-key", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ teamKey }),
      //   });

      //   const data = await response.json();

      //   if (!response.ok || !data.success) {
      //     throw new Error(data.message || "Invalid team key");
      //   }

      //   // Store team data and redirect
      //   localStorage.setItem("teamData", JSON.stringify(data.data));
      //   toast.success("Team key verified! Redirecting...");

      // Redirect to player registration page
      setTimeout(() => {
        router.push(`/auth/register/player/${teamKey}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Invalid team key. Please check and try again.");
      toast.error("Invalid team key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center border-4 border-white">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Player Registration Portal
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Welcome to the tournament registration system. Enter your team key
            to continue.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Enter Team Key
              </CardTitle>
              <CardDescription>
                Enter the unique team key provided by your tournament manager
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="teamKey" className="text-base">
                    Team Registration Key
                  </Label>
                  <Input
                    id="teamKey"
                    type="text"
                    placeholder="e.g., TEAM-ABC-123-XYZ"
                    value={teamKey}
                    onChange={(e) => setTeamKey(e.target.value.toUpperCase())}
                    className="h-12 text-lg font-mono tracking-wide border-2"
                    required
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500">
                    The key is case-insensitive. Enter exactly as provided by
                    your manager.
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  disabled={loading || !teamKey.trim()}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Verifying Key...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Verify & Continue
                    </>
                  )}
                </Button>
              </form>

              {/* Instructions */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Don't have a team key?
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    Contact your tournament manager
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    Request the unique team registration key
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    Enter the key above to start player registration
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Right side - Info */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Get Team Key</h4>
                      <p className="text-blue-100 text-sm">
                        Your manager creates a team and shares the key
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Enter Key</h4>
                      <p className="text-blue-100 text-sm">
                        Use the key to access your team's registration
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Register Players</h4>
                      <p className="text-blue-100 text-sm">
                        Add players to your team with their details
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-700">
                  <Users className="w-5 h-5" />
                  Why Use This System?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">
                    Secure and controlled player registration
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">
                    No need to collect physical forms
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">
                    Real-time roster updates for managers
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">
                    Automatic validation of player data
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
