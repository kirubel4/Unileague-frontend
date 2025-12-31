"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Upload, Trash2, Search } from "lucide-react";

interface GalleryImage {
  id: number;
  title: string;
  url: string;
  uploadedDate: string;
  uploadedBy: string;
  category: string;
}

export default function ManagerGallery() {
  const userName = localStorage.getItem("userName") || "Manager";
  const [images, setImages] = useState<GalleryImage[]>([
    {
      id: 1,
      title: "Championship Opening Ceremony",
      url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
      uploadedDate: "Dec 18, 2024",
      uploadedBy: "Manager",
      category: "Events",
    },
    {
      id: 2,
      title: "Team Presentation",
      url: "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&h=300&fit=crop",
      uploadedDate: "Dec 15, 2024",
      uploadedBy: "Manager",
      category: "Teams",
    },
    {
      id: 3,
      title: "Match Highlights",
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
      uploadedDate: "Dec 12, 2024",
      uploadedBy: "Manager",
      category: "Matches",
    },
    {
      id: 4,
      title: "Victory Celebration",
      url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
      uploadedDate: "Dec 10, 2024",
      uploadedBy: "Manager",
      category: "Events",
    },
    {
      id: 5,
      title: "Player Training Session",
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
      uploadedDate: "Dec 8, 2024",
      uploadedBy: "Manager",
      category: "Training",
    },
    {
      id: 6,
      title: "Crowd Atmosphere",
      url: "https://images.unsplash.com/photo-1501447586807-f894fbb1dc4d?w=400&h=300&fit=crop",
      uploadedDate: "Dec 5, 2024",
      uploadedBy: "Manager",
      category: "Events",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = ["all", "Events", "Teams", "Matches", "Training"];

  const filteredImages = images.filter((img) => {
    const matchesSearch = img.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || img.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const deleteImage = (id: number) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
  };

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

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Gallery</h1>
        <p className="text-muted-foreground mt-2">
          Manage tournament photos and images
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-dashed border-blue-300 p-8 mb-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Upload Tournament Photos
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

      {/* Filters */}
      <div className="bg-white rounded-lg border border-border p-4 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by image title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg h-9 pl-9 flex-1"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative overflow-hidden bg-muted h-48">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2 rounded"
                    onClick={() => deleteImage(image.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                  {image.title}
                </h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Category</span>
                    <span className="font-medium text-foreground">
                      {image.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Uploaded</span>
                    <span className="font-medium text-foreground">
                      {image.uploadedDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>By</span>
                    <span className="font-medium text-foreground">
                      {image.uploadedBy}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground">No images found</p>
        </div>
      )}

      {/* Gallery Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-border p-4 text-center">
          <p className="text-2xl font-bold text-primary">{images.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Images</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {filteredImages.length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Shown</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {new Set(images.map((img) => img.category)).size}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Categories</p>
        </div>
      </div>
    </Layout>
  );
}
