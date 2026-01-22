"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiResponse } from "@/lib/utils";

export default function Login() {
  const navigate = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [isCoach, setIsCoach] = useState(false);
  const [role, setRole] = useState<"admin" | "coach">("admin");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!username || !password) {
        setError("Please fill in all fields");
        return;
      }

      if (role === "coach") {
        const res = await fetch("/api/auth/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamName: username,
            password: password,
          }),
        });

        const response: ApiResponse = await res.json();

        if (!response.success) {
          setError(response.message);
        } else {
          navigate.replace("/coach/");
        }

        return;
      }

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const response: ApiResponse = await res.json();

      if (!response.success) {
        setError(response.message);
        return;
      }

      const userRole = response.data.role;

      if (userRole === "superAdmin") navigate.replace("/admin/");
      else if (userRole === "tournamentManager") navigate.replace("/manager/");
      else
        navigate.replace(
          "/unauthorized?message=u don't have an access to the private pages buddy i don't know how u pass the firs security",
        );
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          {/* Role Switcher */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex space-x-2">
              {" "}
              {/* Added space between buttons */}
              <Button
                type="button"
                variant={role === "admin" ? "default" : "outline"}
                onClick={() => setRole("admin")}
                className={`px-4 py-2 rounded-lg text-sm transition duration-200 ${
                  role === "admin"
                    ? "bg-primary text-white "
                    : "bg-white text-primary  hover:bg-blue-100 "
                }`}
              >
                Admin
              </Button>
              <Button
                type="button"
                variant={role === "coach" ? "default" : "outline"}
                onClick={() => setRole("coach")}
                className={`px-4 py-2 rounded-lg text-sm transition duration-200 ${
                  role === "coach"
                    ? "bg-primary text-white border-none"
                    : "bg-white text-primary hover:bg-blue-100 hover:text-blue-600"
                }`}
              >
                Coach
              </Button>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">
              UniLeague Hub
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {role === "coach"
                ? "Coach login"
                : role === "admin"
                  ? "Manager login"
                  : "Admin login"}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-700">
                {role === "coach" ? "Team Name" : "Username"}
              </Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={
                  role === "coach" ? "Enter team name" : "Enter your username"
                }
                className="h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-700">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Button */}
            <Button
              disabled={isLoading}
              className="w-full h-11 rounded-lg text-sm font-medium"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} UniLeague
          </p>
        </div>
      </div>
    </div>
  );
}
