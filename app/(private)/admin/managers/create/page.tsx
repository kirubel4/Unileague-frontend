"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { mapTournaments } from "../../tournaments/util";
import useSWR from "swr";
import { ApiResponse, fetcher, getCookie } from "@/lib/utils";
import { Tournament } from "../../tournaments/page";
import { toast, Toaster } from "sonner";
export default function AdminManagersCreate() {
  const userName = getCookie("uName") || "Admin";
  const navigate = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    tournamentId: "",
  });
  const { data, error, isLoading } = useSWR("/api/public/tournament", fetcher, {
    revalidateOnFocus: false,
  });
  const tournaments: Tournament[] = mapTournaments(data);
  const filterTour = tournaments.filter(
    (tour) => tour.managerId === null || tour.managerId === undefined
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("creating manager");
    setIsSubmitting(true);
    const res = await fetch("/api/protected/admin/manager/create", {
      method: "POST",
      body: JSON.stringify({
        fullName: formData.fullname,
        username: formData.username,
        email: formData.email,
        tournamentId: formData.tournamentId,
      }),
    });
    const respond: ApiResponse = await res.json();
    if (!respond.success) {
      toast.error(respond.message);
      setIsSubmitting(false);
      return;
    }
    toast.success("manager created");
    setIsSubmitting(false);
    navigate.push("/admin/managers");
  };

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Toaster />
        <Link href="/admin/managers">
          <Button variant="ghost" size="sm" className="mb-4 flex items-center">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Managers
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Add Manager
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Create a new tournament manager account
        </p>
      </div>

      {/* Form */}
      <div className="w-full lg:max-w-6xl">
        <div className="bg-white border border-border rounded-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullname" className="font-medium">
                Full Name *
              </Label>
              <Input
                id="fullname"
                name="fullname"
                placeholder="John Smith"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="h-10 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullname" className="font-medium">
                User Name *
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="John"
                value={formData.username}
                onChange={handleChange}
                required
                className="h-10 rounded-lg"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-10 rounded-lg"
              />
            </div>

            {/* Tournament Assignment */}
            <div className="space-y-2">
              <Label htmlFor="tournamentId" className="font-medium">
                Assign Tournament
              </Label>
              <select
                id="tournamentId"
                name="tournamentId"
                value={formData.tournamentId}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">Select a tournament...</option>
                {filterTour?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tournamentName}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 bg-primary hover:bg-blue-600 text-white rounded-lg h-10"
              >
                {isSubmitting ? "Creating..." : "Create Manager"}
              </Button>
              <Link href="/admin/managers" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="rounded-lg h-10 w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              Password will be automatically generated and sent to the manager's
              email.
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
