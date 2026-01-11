"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiResponse, fetcher, getCookie } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Users,
  User,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { mapTeams } from "../../players/transfer/util";
import { toast, Toaster } from "sonner";
export type Team = {
  id: string;
  name: string;
};

export interface Match {
  scheduledDate: string;
  homeTeamId: string;
  awayTeamId: string;
  venue: string;
  referee: string;
}

export default function CreateMatchPage() {
  const router = useRouter();
  const userName = getCookie("uName") || "Manager";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const { data, error, isLoading } = useSWR(
    "/api/public/team/tournament",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const teams: Team[] = mapTeams(data || { data: [] });
  const [formData, setFormData] = useState<Match>({
    scheduledDate: new Date().toISOString().slice(0, 16),
    homeTeamId: "",
    awayTeamId: "",
    venue: "",
    referee: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof Match | "_form", string>>
  >({});

  const handleInputChange = (field: keyof Match, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Match, string>> = {};
    if (!formData.homeTeamId) {
      newErrors.homeTeamId = "Please select a home team";
    }
    if (!formData.awayTeamId) {
      newErrors.awayTeamId = "Please select an away team";
    }
    if (formData.homeTeamId === formData.awayTeamId && formData.homeTeamId) {
      newErrors.awayTeamId = "Home and away teams cannot be the same";
    }
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = "Please select a date and time";
    }
    if (!formData.venue) {
      newErrors.venue = "Please enter a venue";
    }
    if (!formData.referee?.trim()) {
      newErrors.referee = "Please enter referee name";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const scheduledDate = new Date(
        formData.scheduledDate + ":00Z"
      ).toISOString();
      const body = { ...formData, scheduledDate };
      const res = await fetch("/api/protected/manager/match/create/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const response: ApiResponse = await res.json();
      if (!response.success) {
        setSubmitStatus("error");
        setErrors({ _form: response.message as string });
        console.log(response.message);
        return;
      }
      setSubmitStatus("success");
      setTimeout(() => {
        router.push("/manager/matches");
      }, 800);
    } catch (error) {
      console.error("Failed to create match:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      scheduledDate: new Date().toISOString().slice(0, 16),
      homeTeamId: "",
      awayTeamId: "",
      venue: "",
      referee: "",
    });
    setErrors({});
    setSubmitStatus(null);
  };

  // Get selected teams for display
  const selectedHomeTeam = teams?.find(
    (team) => team.id === formData.homeTeamId
  );
  const selectedAwayTeam = teams?.find(
    (team) => team.id === formData.awayTeamId
  );

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Toaster />
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Create New Match
            </h1>
            <p className="text-muted-foreground mt-1">
              Schedule a match between two teams with all necessary details
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => router.push("/manager/matches")}
            className="hover:text-foreground transition-colors"
          >
            Matches
          </button>
          <ArrowRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Create Match</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            {/* Submission Status */}
            {submitStatus === "success" && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      Match created successfully!
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Redirecting to matches page...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">
                      Failed to create match
                    </p>
                    <p className="text-sm text-red-600 mt-1">{errors._form}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateMatch}>
              {/* Teams Selection */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-lg font-bold text-foreground">
                    Team Selection
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Home Team */}
                  <div>
                    <Label htmlFor="homeTeam" className="mb-2 block">
                      Home Team <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="homeTeam"
                      value={formData.homeTeamId}
                      onChange={(e) =>
                        handleInputChange("homeTeamId", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                        errors.homeTeamId
                          ? "border-destructive"
                          : "border-input"
                      }`}
                    >
                      <option value="">Select home team</option>
                      {teams?.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                    {errors.homeTeamId && (
                      <p className="text-destructive text-sm mt-2 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.homeTeamId}
                      </p>
                    )}
                  </div>

                  {/* Away Team */}
                  <div>
                    <Label htmlFor="awayTeam" className="mb-2 block">
                      Away Team <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="awayTeam"
                      value={formData.awayTeamId}
                      onChange={(e) =>
                        handleInputChange("awayTeamId", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                        errors.awayTeamId
                          ? "border-destructive"
                          : "border-input"
                      }`}
                    >
                      <option value="">Select away team</option>
                      {teams
                        .filter((team) => team.id !== formData.homeTeamId)
                        .map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                    </select>
                    {errors.awayTeamId && (
                      <p className="text-destructive text-sm mt-2 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.awayTeamId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Match Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-lg font-bold text-foreground">
                    Match Details
                  </h2>
                </div>

                {/* Date & Time */}
                <div>
                  <Label htmlFor="scheduledDate" className="mb-2 block">
                    Date & Time <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="scheduledDate"
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) =>
                        handleInputChange("scheduledDate", e.target.value)
                      }
                      className={`pr-10 ${
                        errors.scheduledDate ? "border-destructive" : ""
                      }`}
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  </div>
                  {errors.scheduledDate && (
                    <p className="text-destructive text-sm mt-2 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.scheduledDate}
                    </p>
                  )}
                </div>

                {/* Venue */}
                <div>
                  <Label htmlFor="referee" className="mb-2 block">
                    Venue <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id=""
                      type="venue"
                      value={formData.venue}
                      onChange={(e) =>
                        handleInputChange("venue", e.target.value)
                      }
                      placeholder="Enter Location"
                      className={`pl-10 ${
                        errors.venue ? "border-destructive" : ""
                      }`}
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  </div>
                  {errors.referee && (
                    <p className="text-destructive text-sm mt-2 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.referee}
                    </p>
                  )}
                </div>

                {/* Referee */}
                <div>
                  <Label htmlFor="referee" className="mb-2 block">
                    Referee <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="referee"
                      type="text"
                      value={formData.referee}
                      onChange={(e) =>
                        handleInputChange("referee", e.target.value)
                      }
                      placeholder="Enter referee name"
                      className={`pl-10 ${
                        errors.referee ? "border-destructive" : ""
                      }`}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  </div>
                  {errors.referee && (
                    <p className="text-destructive text-sm mt-2 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.referee}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-8 border-t border-border">
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Creating Match...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Create Match
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleResetForm}
                  disabled={isSubmitting}
                >
                  Reset Form
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => router.push("/manager/matches")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {/* Match Preview Card */}
            <div className="bg-linear-to-br from-gray-50 to-white rounded-xl border border-border shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Match Preview
              </h3>

              {!selectedHomeTeam || !selectedAwayTeam ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Select teams to preview match details
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Teams */}
                  <div className="bg-white rounded-lg border border-border p-4">
                    <div className="text-center space-y-3">
                      <div>
                        <p className="font-bold text-lg text-foreground">
                          {selectedHomeTeam.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Home Team
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <div className="h-px w-8 bg-border"></div>
                        <span className="text-sm font-medium text-muted-foreground">
                          VS
                        </span>
                        <div className="h-px w-8 bg-border"></div>
                      </div>

                      <div>
                        <p className="font-bold text-lg text-foreground">
                          {selectedAwayTeam.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Away Team
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    {formData.scheduledDate && (
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">
                            Scheduled Date
                          </p>
                          <p className="text-muted-foreground">
                            {new Date(
                              formData.scheduledDate
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {formData.venue && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Venue</p>
                          <p className="text-muted-foreground">
                            {formData.venue}
                          </p>
                        </div>
                      </div>
                    )}

                    {formData.referee && (
                      <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Referee</p>
                          <p className="text-muted-foreground">
                            {formData.referee}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-linear-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Quick Tips
              </h3>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select teams carefully - matches cannot be edited after
                    creation
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All fields marked with * are required
                  </p>
                </div>

                <Link
                  href={"/manager/messages"}
                  className="pt-3 mt-3 border-t border-blue-100"
                >
                  <p className="text-xs text-blue-600">
                    Need help? Contact Admin in the message panel
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
