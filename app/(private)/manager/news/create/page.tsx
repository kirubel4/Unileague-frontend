"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Upload } from "lucide-react";
import Link from "next/link";
import { GalleryImage } from "../../gallery/page";

export default function ManagerNewsCreate() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const userName = localStorage.getItem("userName") || "Manager";
  const navigate = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
  });
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImage: GalleryImage = {
            id: Math.max(...images.map((img) => img.id), 0) + 1,
            title: file.name.replace(/\.[^/.]+$/, ""),
            url: event.target.result as string,
            uploadedDate: new Date().toLocaleDateString(),
            uploadedBy: userName,
            category: "Events",
          };
          setImages([newImage, ...images]);
        }
      };
      reader.readAsDataURL(file);
    }
  };
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

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-dashed border-blue-300 p-8 mb-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Upload News Banner
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop images here or click to select files
                  </p>
                </div>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="image-upload">
                  <Button
                    asChild
                    className="bg-primary hover:bg-blue-600 text-white rounded-lg gap-2 cursor-pointer"
                  >
                    <span>
                      <Upload className="w-4 h-4" />
                      Choose Image
                    </span>
                  </Button>
                </label>
              </div>
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
