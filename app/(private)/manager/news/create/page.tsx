"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ManagerNewsCreate() {
  const userName = localStorage.getItem("userName") || "Manager";
  const navigate = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.excerpt.trim() ||
      !formData.content.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    alert(`Article "${formData.title}" created successfully!`);
    navigate.push("/manager/news");
  };

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Link href="/manager/news">
          <Button
            variant="ghost"
            className="gap-2 px-0 h-8 text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Articles
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Create Article</h1>
        <p className="text-muted-foreground mt-2">
          Write and publish a new article for your tournament
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-border p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <Label
                htmlFor="title"
                className="text-foreground font-semibold mb-2 block"
              >
                Article Title *
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter article title"
                value={formData.title}
                onChange={handleChange}
                className="rounded-lg h-10"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The main heading of your article
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <Label
                htmlFor="excerpt"
                className="text-foreground font-semibold mb-2 block"
              >
                Excerpt *
              </Label>
              <textarea
                id="excerpt"
                name="excerpt"
                placeholder="Enter a brief summary of the article (will appear in article list)"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Brief summary that appears in the article list
              </p>
            </div>

            {/* Content */}
            <div>
              <Label
                htmlFor="content"
                className="text-foreground font-semibold mb-2 block"
              >
                Article Content *
              </Label>
              <textarea
                id="content"
                name="content"
                placeholder="Write your full article content here..."
                value={formData.content}
                onChange={handleChange}
                rows={10}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The main content of your article
              </p>
            </div>

            {/* Tags */}
            <div>
              <Label
                htmlFor="tags"
                className="text-foreground font-semibold mb-2 block"
              >
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                name="tags"
                type="text"
                placeholder="e.g., tournament, schedule, important"
                value={formData.tags}
                onChange={handleChange}
                className="rounded-lg h-10"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Help categorize your article with relevant tags
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Tip:</span> You can save this as a
            draft and publish it later. Articles will be visible to all
            tournament participants once published.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Link href="/manager/news">
            <Button variant="outline" className="rounded-lg h-10">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-blue-600 text-white rounded-lg h-10"
          >
            {isSubmitting ? "Publishing..." : "Create Article"}
          </Button>
        </div>
      </form>
    </Layout>
  );
}
