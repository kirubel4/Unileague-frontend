"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login() {
  const navigate = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Simulate authentication - in real app, call API endpoint
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      // Simulate role detection based on email
      const role = email.includes("manager") ? "manager" : "super_admin";

      // Store auth token and role
      localStorage.setItem("authToken", "mock-token-" + Date.now());
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", email.split("@")[0]);

      // Redirect based on role
      if (role === "super_admin") {
        navigate.replace("/admin/");
      } else {
        navigate.replace("/manager/");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
              <span className="text-3xl">⚽</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">FootballHub</h1>
            <p className="text-muted-foreground mt-2">
              Admin Management System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-lg border-border focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-lg border-border focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex gap-2 p-2 bg-muted rounded">
                <span className="font-medium min-w-20">Super Admin:</span>
                <code className="text-blue-600">admin@example.com</code>
              </div>
              <div className="flex gap-2 p-2 bg-muted rounded">
                <span className="font-medium min-w-20">Manager:</span>
                <code className="text-blue-600">manager@example.com</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
