// app/images/upload/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  Image as ImageIcon,
  Tag,
  User,
  Sidebar,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UploadImage = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title.trim()) {
      alert("Please select an image and provide a title");
      return;
    }

    setUploading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Uploading:", {
        file,
        title,
        description,
        tags,
      });

      setUploading(false);
      alert("Image uploaded successfully!");
      router.push("/images");
    }, 1500);
  };

  return (
    <div className="flex flex-1">
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Upload Team Image
            </h1>
            <p className="text-gray-600 mt-2">
              Share a memorable moment with the team
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Upload */}
              <div>
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Image</h2>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        preview
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {preview ? (
                        <div className="space-y-4">
                          <div className="relative aspect-video rounded-lg overflow-hidden">
                            <img
                              src={preview}
                              alt="Preview"
                              className="object-cover w-full h-full"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFile(null);
                                setPreview(null);
                              }}
                              className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600">{file?.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Drop your image here, or click to browse
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Supports JPG, PNG up to 10MB
                            </p>
                          </div>
                          <div>
                            <label className="inline-block">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <Button type="button" variant="outline">
                                <Upload className="w-4 h-4 mr-2" />
                                Select Image
                              </Button>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Details Form */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Details</h2>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="e.g., Championship Celebration"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Describe this moment..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addTag())
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="Add a tag..."
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          variant="outline"
                        >
                          <Tag className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 hover:text-blue-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Uploaded By
                      </label>
                      <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <span>Coach Johnson</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/images")}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading || !file}>
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      "Upload Image"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UploadImage;
