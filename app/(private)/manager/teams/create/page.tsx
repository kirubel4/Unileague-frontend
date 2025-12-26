"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { ChevronLeft, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ManagerTeamsCreate() {
  const userName = localStorage.getItem("userName") || "Manager";
  const navigate = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    teamName: "",
    coachName: "",
    coachEmail: "",
    registrationKey: "",
  });

  const generateRegistrationKey = () => {
    const key =
      "TEAM" + Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData((prev) => ({ ...prev, registrationKey: key }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formData.registrationKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert(`Team "${formData.teamName}" registered successfully!`);
      navigate.push("/manager/teams");
    }, 800);
  };

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Link href="/manager/teams">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Register Team</h1>
        <p className="text-muted-foreground mt-2">
          Create a new team for the tournament
        </p>
      </div>

      {/* Form */}
      <div className="max-w-7xl">
        <div className="bg-white rounded-lg border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Name */}
            <div className="space-y-2">
              <Label htmlFor="teamName" className="font-medium">
                Team Name *
              </Label>
              <Input
                id="teamName"
                name="teamName"
                placeholder="e.g., Tigers United"
                value={formData.teamName}
                onChange={handleChange}
                required
                className="h-10 rounded-lg"
              />
            </div>

            {/* Coach Name */}
            <div className="space-y-2">
              <Label htmlFor="coachName" className="font-medium">
                Coach Name *
              </Label>
              <Input
                id="coachName"
                name="coachName"
                placeholder="Coach full name"
                value={formData.coachName}
                onChange={handleChange}
                required
                className="h-10 rounded-lg"
              />
            </div>

            {/* Coach Email */}
            <div className="space-y-2">
              <Label htmlFor="coachEmail" className="font-medium">
                Coach Email *
              </Label>
              <Input
                id="coachEmail"
                name="coachEmail"
                type="email"
                placeholder="coach@example.com"
                value={formData.coachEmail}
                onChange={handleChange}
                required
                className="h-10 rounded-lg"
              />
            </div>

            {/* Registration Key */}
            <div className="space-y-2">
              <Label htmlFor="registrationKey" className="font-medium">
                Team Registration Key
              </Label>
              <div className="flex gap-2">
                <Input
                  id="registrationKey"
                  name="registrationKey"
                  value={formData.registrationKey}
                  readOnly
                  placeholder="Auto-generated"
                  className="h-10 rounded-lg flex-1"
                />
                <Button
                  type="button"
                  onClick={generateRegistrationKey}
                  variant="outline"
                  className="rounded-lg h-10"
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this key with team members for registration
              </p>
            </div>

            {/* Copy Key Button */}
            {formData.registrationKey && (
              <Button
                type="button"
                onClick={copyToClipboard}
                variant="outline"
                className="w-full rounded-lg h-10 gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Registration Key
                  </>
                )}
              </Button>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-blue-600 text-white rounded-lg h-10"
              >
                {isSubmitting ? "Registering..." : "Register Team"}
              </Button>
              <Link href="/manager/teams">
                <Button variant="outline" className="rounded-lg h-10">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
