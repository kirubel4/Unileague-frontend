"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRef, useState } from "react";
import { ChevronLeft, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ManagerPlayersCreate() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const userName = localStorage.getItem("userName") || "Manager";
  const navigate = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    playerName: "",
    age: "",
    position: "Midfielder",
    team: "",
    jerseyNumber: "",
    nationality: "",
  });

  const teams = [
    { id: "1", name: "Tigers United" },
    { id: "2", name: "Phoenix FC" },
    { id: "3", name: "Eagles Sports" },
  ];

  const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert(`Player "${formData.playerName}" added successfully!`);
      navigate.push("/manager/players");
    }, 800);
  };

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Add Player</h1>
        <p className="text-muted-foreground mt-2">
          Register a new player to the tournament
        </p>
      </div>

      {/* Form */}
      <div className="max-w-7xl">
        <div className="bg-white rounded-lg border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Player Name */}
            <div className="space-y-2">
              <Label htmlFor="playerName" className="font-medium">
                Player Name *
              </Label>
              <Input
                id="playerName"
                name="playerName"
                placeholder="Full name"
                value={formData.playerName}
                onChange={handleChange}
                required
                className="h-10 rounded-lg"
              />
            </div>

            {/* Age */}
            <div className="space-y-4">
              <Label>Player Image</Label>
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

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position" className="font-medium">
                Position *
              </Label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
              >
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>

            {/* Team */}
            <div className="space-y-2">
              <Label htmlFor="team" className="font-medium">
                Team *
              </Label>
              <select
                id="team"
                name="team"
                value={formData.team}
                onChange={handleChange}
                required
                className="w-full h-10 px-3 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">Select a team...</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Jersey Number */}
            <div className="space-y-2">
              <Label htmlFor="jerseyNumber" className="font-medium">
                Jersey Number *
              </Label>
              <Input
                id="jerseyNumber"
                name="jerseyNumber"
                type="number"
                min="1"
                max="99"
                placeholder="7"
                value={formData.jerseyNumber}
                onChange={handleChange}
                required
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
                {isSubmitting ? "Adding..." : "Add Player"}
              </Button>
              <Link href="/manager/players">
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
