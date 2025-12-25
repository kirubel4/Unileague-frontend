"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AdminTournamentsCreate() {
  const userName = "Admin";
  const navigate = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    year: new Date().getFullYear().toString(),
    startDate: "",
    endDate: "",
    location: "",
    maxTeams: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert(`Tournament "${formData.name}" created successfully!`);
      navigate.push("/admin/tournaments");
    }, 800);
  };

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/tournaments">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
          Create Tournament
        </h1>
        <p className="text-muted-foreground mt-2">
          Set up a new football tournament
        </p>
      </div>

      {/* Form */}
      <div className="lg:max-w-6xl">
        <div className="bg-white rounded-lg border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tournament Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium">
                Tournament Name *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., City League Championship"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-10 rounded-lg"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder="Tournament details and rules..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="font-medium">
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="font-medium">
                  End Date *
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="h-10 rounded-lg"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="font-medium">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="Tournament venue or city"
                value={formData.location}
                onChange={handleChange}
                className="h-10 rounded-lg"
              />
            </div>

            {/* Max Teams */}
            <div className="space-y-2">
              <Label htmlFor="maxTeams" className="font-medium">
                Maximum Teams
              </Label>
              <Input
                id="maxTeams"
                name="maxTeams"
                type="number"
                min="2"
                placeholder="e.g., 16"
                value={formData.maxTeams}
                onChange={handleChange}
                className="h-10 rounded-lg"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-blue-600 text-white rounded-lg h-10"
              >
                {isSubmitting ? "Creating..." : "Create Tournament"}
              </Button>
              <Link href="/admin/tournaments">
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
