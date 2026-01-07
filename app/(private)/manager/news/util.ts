interface ApiBroadcast {
  id: string;
  type: string;
  message: string | null;
  tournamentId: string;
  receiverAdminId: string | null;
  senderAdminId: string | null;
  isRead: boolean;
  readAt: string | null;
  meta: {
    title: string;
    content: string;
    excerpt: string;
  };
  createdAt: string;
  media: any[];
}

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ApiBroadcast[];
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  status: "published" | "draft";
  views: number;
}

export function mapBroadcastToNewsArticles(
  apiResponse: ApiResponse
): NewsArticle[] {
  if (!apiResponse?.data) return [];

  return apiResponse.data.map((item) => ({
    id: item.id || "NaN", // convert string ID to number, fallback NaN
    title: item.meta?.title ?? "No Title",
    excerpt: item.meta?.excerpt ?? "",
    content: item.meta?.content ?? "",
    author: item.senderAdminId ?? "Unknown", // no author field in API, use senderAdminId
    publishedDate: item.createdAt ?? new Date().toISOString(),
    status: "published", // default to published

    views: NaN, // no views info, safe fallback
  }));
}
