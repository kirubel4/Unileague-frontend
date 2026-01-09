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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Toaster, toast } from "sonner";
import { ApiResponse } from "@/lib/utils";

export default function TeamRegistrationAuth() {
  const router = useRouter();
  const [teamKey, setTeamKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!teamKey) {
      setError("Fill the Team Key please");
    }
    try {
      const res = await fetch("/api/auth/player", {
        method: "POST",
        body: JSON.stringify({ key: teamKey }),
      });
      const response: ApiResponse = await res.json();
      if (!res || !response) {
        toast.error("Verification failed Check Your Internat");
        return;
      }
      if (!response.success) {
        setError(response.message);
        return;
      }

      toast.success("Team key verified");
      router.push(`/tournaments/register/player/${response.data.id}`);
    } catch (err: any) {
      setError("Invalid team key. Please check and try again.");
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <Toaster position="top-center" />

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">
            Team Registration
          </CardTitle>
          <CardDescription>
            Enter the team key provided by your manager
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="teamKey">Team Key</Label>
              <Input
                id="teamKey"
                placeholder="ABCD-1234"
                value={teamKey}
                onChange={(e) => setTeamKey(e.target.value)}
                className="h-11 font-mono tracking-wider"
                disabled={loading}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={loading || !teamKey.trim()}
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Continue
                </>
              )}
            </Button>
          </form>

          {/* Help text */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don’t have a team key? <br />
            Contact your tournament manager to get one.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
