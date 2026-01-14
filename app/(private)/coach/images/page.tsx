// app/images/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Eye, Download, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { mockTeamImages } from "../mockData";

const ImagesPage = () => {
  const [images, setImages] = useState(mockTeamImages);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      setImages((prev) => prev.filter((img) => img.id !== id));
      setSelectedImages((prev) => prev.filter((imgId) => imgId !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedImages.length === 0) return;

    if (confirm(`Delete ${selectedImages.length} selected image(s)?`)) {
      setImages((prev) =>
        prev.filter((img) => !selectedImages.includes(img.id))
      );
      setSelectedImages([]);
    }
  };

  const toggleSelectImage = (id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-1">
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Images</h1>
              <p className="text-gray-600 mt-2">
                Share and manage team photos and memories
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {selectedImages.length > 0 && (
                <Button onClick={handleBulkDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedImages.length})
                </Button>
              )}

              <Link href="/coach/images/upload">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card
                key={image.id}
                className={`group hover:shadow-lg transition-all ${
                  selectedImages.includes(image.id)
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              >
                <div className="relative">
                  {/* Image */}
                  <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Selection overlay */}
                    <div
                      className={`absolute top-4 left-4 w-6 h-6 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                        selectedImages.includes(image.id)
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white/80 border-gray-300 hover:bg-white"
                      }`}
                      onClick={() => toggleSelectImage(image.id)}
                    >
                      {selectedImages.includes(image.id) && (
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      )}
                    </div>

                    {/* Actions overlay */}
                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white/90 rounded-lg hover:bg-white">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/90 rounded-lg hover:bg-white">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {image.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {image.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>By {image.uploadedBy}</span>
                      <span>{image.date}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {image.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>

                      <Button variant="outline" size="sm">
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&auto=format&fit=crop"
                  alt="No images"
                  width={200}
                  height={200}
                  className="mx-auto opacity-50"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No images yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by uploading your first team image
              </p>
              <Link href="/images/upload">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload First Image
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ImagesPage;
