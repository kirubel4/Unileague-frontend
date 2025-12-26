"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState, useRef } from "react";
import {
  Upload,
  Trash2,
  Search,
  Image as ImageIcon,
  X,
  Eye,
  Filter,
  Users,
  Trophy,
  Camera,
  Globe,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export interface GalleryImage {
  id: number;
  title: string;
  url: string;
  uploadedDate: string;
  uploadedBy: string;
  category: "tournament" | "team";
  teamId?: string;
  teamName?: string;
  description?: string;
}

export default function ManagerGallery() {
  const userName = localStorage.getItem("userName") || "Manager";
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Teams data (would come from API)
  const teams = [
    { id: "team1", name: "Tigers United", color: "#3B82F6" },
    { id: "team2", name: "Phoenix FC", color: "#EF4444" },
    { id: "team3", name: "Dragons FC", color: "#10B981" },
    { id: "team4", name: "Eagles United", color: "#F59E0B" },
  ];

  // Initial images
  const [images, setImages] = useState<GalleryImage[]>([
    {
      id: 1,
      title: "Opening Ceremony Crowd",
      url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop",
      uploadedDate: "Dec 18, 2024",
      uploadedBy: "Admin",
      category: "tournament",
      description: "Tournament opening ceremony with all teams",
    },
    {
      id: 2,
      title: "Tigers Training Session",
      url: "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=600&h=400&fit=crop",
      uploadedDate: "Dec 15, 2024",
      uploadedBy: "Coach Ali",
      category: "tournament",
      teamId: "team1",
      teamName: "Tigers United",
      description: "Morning training session at main stadium",
    },
    {
      id: 3,
      title: "Phoenix Team Photo",
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
      uploadedDate: "Dec 12, 2024",
      uploadedBy: "Manager",
      category: "team",
      teamId: "team2",
      teamName: "Phoenix FC",
      description: "Official team photo before match",
    },
    {
      id: 4,
      title: "Championship Trophy Display",
      url: "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=600&h=400&fit=crop",
      uploadedDate: "Dec 10, 2024",
      uploadedBy: "Manager",
      category: "tournament",
      description: "Tournament trophy display",
    },
    {
      id: 5,
      title: "Dragons FC Practice",
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
      uploadedDate: "Dec 8, 2024",
      uploadedBy: "Coach Maria",
      category: "team",
      teamId: "team3",
      teamName: "Dragons FC",
      description: "Evening practice session",
    },
    {
      id: 6,
      title: "Eagles Team Huddle",
      url: "https://images.unsplash.com/photo-1501447586807-f894fbb1dc4d?w=600&h=400&fit=crop",
      uploadedDate: "Dec 5, 2024",
      uploadedBy: "Manager",
      category: "team",
      teamId: "team4",
      teamName: "Eagles United",
      description: "Team huddle before the game",
    },
  ]);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "tournament" as "tournament" | "team",
    teamId: "",
  });

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");

  // Filter images
  const filteredImages = images.filter((img) => {
    const matchesSearch =
      searchTerm === "" ||
      img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || img.category === categoryFilter;

    const matchesTeam = teamFilter === "all" || img.teamId === teamFilter;

    return matchesSearch && matchesCategory && matchesTeam;
  });

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
          // Auto-generate title from filename
          const fileName = file.name.replace(/\.[^/.]+$/, "");
          setUploadForm((prev) => ({
            ...prev,
            title: prev.title || fileName,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!previewImage) {
      alert("Please select an image first");
      return;
    }

    if (uploadForm.category === "team" && !uploadForm.teamId) {
      alert("Please select a team for team images");
      return;
    }

    if (!uploadForm.title.trim()) {
      alert("Please enter a title");
      return;
    }

    setUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const selectedTeam = teams.find((t) => t.id === uploadForm.teamId);

    const newImage: GalleryImage = {
      id: Math.max(...images.map((img) => img.id), 0) + 1,
      title: uploadForm.title,
      url: previewImage,
      uploadedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      uploadedBy: userName,
      category: uploadForm.category,
      teamId: uploadForm.teamId || undefined,
      teamName: selectedTeam?.name,
      description: uploadForm.description,
    };

    setImages([newImage, ...images]);

    // Reset form
    setPreviewImage(null);
    setUploadForm({
      title: "",
      description: "",
      category: "tournament",
      teamId: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setUploading(false);
  };

  // Delete image
  const deleteImage = (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setTeamFilter("all");
  };

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Gallery Manager
        </h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage tournament photos, training sessions, and team
          images
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Browse
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Upload New Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Preview Section */}
              <div className="space-y-4">
                <Label>Image Preview</Label>
                {previewImage ? (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <div className="aspect-video bg-muted relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Click to select image
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Upload Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Image Title *</Label>
                  <Input
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter a descriptive title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={uploadForm.category}
                      onValueChange={(value: "tournament" | "team") =>
                        setUploadForm((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tournament">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Tournament
                          </div>
                        </SelectItem>
                        <SelectItem value="team">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Team
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {uploadForm.category === "team" && (
                    <div className="space-y-2">
                      <Label htmlFor="team">Select Team *</Label>
                      <Select
                        value={uploadForm.teamId}
                        onValueChange={(value) =>
                          setUploadForm((prev) => ({ ...prev, teamId: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose team" />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: team.color }}
                                />
                                {team.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !previewImage}
                    className="flex-1 gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Filter Images</h3>
                  {(searchTerm ||
                    categoryFilter !== "all" ||
                    teamFilter !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs gap-2"
                    >
                      <X className="w-3 h-3" />
                      Clear filters
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search" className="text-sm">
                      Search
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search images..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm">
                      Category
                    </Label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="tournament">Tournament</SelectItem>
                        <SelectItem value="team">Team</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team" className="text-sm">
                      Team
                    </Label>
                    <Select value={teamFilter} onValueChange={setTeamFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All teams" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Teams</SelectItem>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: team.color }}
                              />
                              {team.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gallery Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                Gallery ({filteredImages.length} images)
              </h3>
              <Badge variant="outline" className="font-normal">
                {filteredImages.length} of {images.length} showing
              </Badge>
            </div>

            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image) => (
                  <Card
                    key={image.id}
                    className="overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                          onClick={() => deleteImage(image.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                      <Badge className="absolute top-3 left-3 capitalize">
                        {image.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                            {image.title}
                          </h3>
                          {image.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {image.description}
                            </p>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Team</span>
                            <span className="font-medium text-foreground">
                              {image.teamName ? (
                                <div className="flex items-center gap-1">
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                      backgroundColor: teams.find(
                                        (t) => t.id === image.teamId
                                      )?.color,
                                    }}
                                  />
                                  {image.teamName}
                                </div>
                              ) : (
                                "Tournament"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Uploaded
                            </span>
                            <span className="font-medium text-foreground">
                              {image.uploadedDate}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">By</span>
                            <span className="font-medium text-foreground">
                              {image.uploadedBy}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No images found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try changing your filters or upload new images
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{images.length}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Images
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Globe className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {
                        images.filter((img) => img.category === "tournament")
                          .length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tournament Images
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {images.filter((img) => img.category === "team").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Team Images</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team-wise breakdown */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Images by Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teams.map((team) => {
                  const teamImages = images.filter(
                    (img) => img.teamId === team.id
                  );
                  return (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: team.color }}
                        />
                        <span className="font-medium">{team.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">
                          {teamImages.length} images
                        </Badge>
                        {teamImages.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTeamFilter(team.id);
                              setCategoryFilter("all");
                              // Switch to browse tab programmatically would need more logic
                            }}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
