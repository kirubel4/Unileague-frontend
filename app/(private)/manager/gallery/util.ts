// types/api.ts
export interface GalleryApiItem {
  id: string;
  url: string;
  ownerType?: "TEAM" | "TOURNAMENT";
  teamName: string;
  category: string;
}
export interface GalleryImg {
  id: string;
  title: string;
  url: string;
  uploadedDate: string;
  usage: string;
  category: "tournament" | "team";
  teamId?: string;
  teamName: string;
  description?: string;
}

export function mapGalleryResponse(data: unknown): GalleryImg[] {
  if (!Array.isArray(data)) return [];

  return data
    .filter((item): item is GalleryApiItem => {
      return typeof item === "object" && item !== null;
    })
    .map(
      (item): GalleryImg => ({
        id: item.id, // UI-safe fallback (don’t use backend id as number)
        title: item.teamName ?? "Unknown Team",
        url: item.url ?? "",
        uploadedDate: "", // backend doesn't provide it (yet)
        usage: item.category,
        category: item.ownerType === "TEAM" ? "team" : "tournament",
        teamName: item.teamName,
        description: undefined,
      })
    )
    .filter((img) => img.url); // remove broken images
}
