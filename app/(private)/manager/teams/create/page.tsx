"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRef, useState } from "react";
import { ChevronLeft, Copy, Check, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ApiResponse, getCookie } from "@/lib/utils";

export default function ManagerTeamsCreate() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const userName = getCookie("uName") || "Manager";
  const navigate = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    teamName: "",
    coachName: "",
    coachEmail: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please upload a team logo");
      return;
    }
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("teamName", formData.teamName);
    fd.append("coachName", formData.coachName);
    fd.append("coachEmail", formData.coachEmail);
    fd.append("logo", imageFile);

    const res = await fetch("/api/protected/manager/team/create", {
      method: "POST",
      body: fd,
    });
    const response: ApiResponse = await res.json();
    if (!response.success) {
      console.log(response.message);
      return;
    }
    console.log("team created and registered");
    navigate.push("/manager/teams");
  };
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
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
          // Auto-generate title from filename
          const fileName = file.name.replace(/\.[^/.]+$/, "");
        }
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Register Team</h1>
        <p className="text-muted-foreground mt-2">
          Create a new team for the tournament
        </p>
      </div>

      {/* Form */}
      <div className="max-w-7xl">
        <div className="bg-white rounded-lg border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Name */}
            <div className="space-y-2">
              <Label htmlFor="teamName" className="font-medium">
                Team Name *
              </Label>
              <Input
                id="teamName"
                name="teamName"
                placeholder="e.g., Tigers United"
                value={formData.teamName}
                onChange={handleChange}
                required
                className="h-10 rounded-lg"
              />
            </div>

            {/* Coach Name */}
            <div className="space-y-2">
              <Label htmlFor="coachName" className="font-medium">
                Coach Name *
              </Label>
              <Input
                id="coachName"
                name="coachName"
                placeholder="Coach full name"
                value={formData.coachName}
                onChange={handleChange}
                required
                className="h-10 rounded-lg"
              />
            </div>

            {/* Coach Email */}
            <div className="space-y-2">
              <Label htmlFor="coachEmail" className="font-medium">
                Coach Email *
              </Label>
              <Input
                id="coachEmail"
                name="coachEmail"
                type="email"
                placeholder="coach@example.com"
                value={formData.coachEmail}
                onChange={handleChange}
                required
                className="h-10 rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <Label>Team Logo</Label>
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

            <div className="space-y-2">
              <Label htmlFor="registrationKey" className="font-medium">
                Team Registration Key
              </Label>

              <p className="text-xs text-muted-foreground">
                It will be sent to the coachEmail automatically notify them
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-blue-600 text-white rounded-lg h-10"
              >
                {isSubmitting ? "Registering..." : "Register Team"}
              </Button>
              <Link href="/manager/teams">
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
