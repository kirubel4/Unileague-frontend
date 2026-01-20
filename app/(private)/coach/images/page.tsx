// app/images/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Eye, Download, Tag, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { mockTeamImages } from "../mockData";
import { Separator } from "@radix-ui/react-select";
import { Badge } from "@/components/ui/badge";
import { GalleryImg, mapGalleryResponse } from "../../manager/gallery/util";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

const ImagesPage = () => {
  // const [images, setImages] = useState(mockTeamImages);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      // setImages((prev) => prev.filter((img) => img.id !== id));
      setSelectedImages((prev) => prev.filter((imgId) => imgId !== id));
    }
  };
  const {
    data: image,
    error: err,
    isLoading: loadImage,
    mutate: mutateImage,
  } = useSWR(`/api/public/gallery`, fetcher, {
    revalidateOnFocus: false,
  });
  const images: GalleryImg[] = mapGalleryResponse(image?.data || { data: [] });
  const handleBulkDelete = () => {
    if (selectedImages.length === 0) return;

    if (confirm(`Delete ${selectedImages.length} selected image(s)?`)) {
      // setImages((prev) =>
      //   prev.filter((img) => !selectedImages.includes(img.id))
      // );
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

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">
                  Gallery ({images?.length} images)
                </h3>
                <Badge variant="outline" className="font-normal">
                  {images?.length} of {images.length} showing
                </Badge>
              </div>

              {images?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images?.map((image) => (
                    <Card
                      key={image.id}
                      className="overflow-hidden group hover:shadow-lg transition-shadow"
                    >
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <img
                          src={image.url}
                          alt={"image.title"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />

                        <Badge className="absolute top-3 left-3 capitalize">
                          {image.category}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                              {image.teamName}
                            </h3>
                          </div>

                          <Separator />

                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Team
                              </span>
                              <span className="font-medium text-foreground">
                                {image.teamName ? (
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full" />
                                    {image.teamName}
                                  </div>
                                ) : (
                                  "Tournament"
                                )}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Usage
                              </span>
                              <span className="font-medium text-foreground">
                                {image.usage}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                images.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                      <img
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
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImagesPage;
