"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AdminNewsCreate() {
  const userName = localStorage.getItem("userName") || "Admin";
  const navigate = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    scope: "global",
    tournamentId: "",
    tags: "",
  });

  const tournaments = [
    { id: "1", name: "City League Championship" },
    { id: "2", name: "Regional Cup" },
    { id: "3", name: "Summer Tournament" },
  ];

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
      alert(`Article "${formData.title}" published successfully!`);
      navigate.push("/admin/news");
    }, 800);
  };

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/news">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Publish News</h1>
        <p className="text-muted-foreground mt-2">
          Create and publish a new news article
        </p>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium">
                Title *
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Article title"
                value={formData.title}
                onChange={handleChange}
                required
                className="h-10 rounded-lg"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt" className="font-medium">
                Excerpt *
              </Label>
              <textarea
                id="excerpt"
                name="excerpt"
                placeholder="Brief summary of the article..."
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                required
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="font-medium">
                Content *
              </Label>
              <textarea
                id="content"
                name="content"
                placeholder="Article content..."
                value={formData.content}
                onChange={handleChange}
                rows={8}
                required
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none resize-vertical font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Markdown formatting supported
              </p>
            </div>

            {/* Scope */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scope" className="font-medium">
                  Scope *
                </Label>
                <select
                  id="scope"
                  name="scope"
                  value={formData.scope}
                  onChange={handleChange}
                  className="w-full h-10 px-3 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="global">Global</option>
                  <option value="tournament">Tournament Specific</option>
                </select>
              </div>

              {/* Tournament Selection */}
              {formData.scope === "tournament" && (
                <div className="space-y-2">
                  <Label htmlFor="tournamentId" className="font-medium">
                    Tournament *
                  </Label>
                  <select
                    id="tournamentId"
                    name="tournamentId"
                    value={formData.tournamentId}
                    onChange={handleChange}
                    required={formData.scope === "tournament"}
                    className="w-full h-10 px-3 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="">Select a tournament...</option>
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="font-medium">
                Tags
              </Label>
              <Input
                id="tags"
                name="tags"
                placeholder="Separate tags with commas"
                value={formData.tags}
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
                {isSubmitting ? "Publishing..." : "Publish Article"}
              </Button>
              <Link href="/admin/news">
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
