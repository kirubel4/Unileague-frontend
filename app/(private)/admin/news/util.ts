import { NewsArticle } from "./page";

export const mapApiToNewsArticle = (apiData: any[]): NewsArticle[] => {
  return apiData?.map((item) => {
    // Extract content from meta field
    const content = item.meta?.contetn || item.meta?.content || "";
    const excerpt =
      content.length > 100 ? content.substring(0, 100) + "..." : content;

    return {
      id: item.id,
      title: item.meta?.title || "Untitled",
      excerpt: excerpt,
      content: item.meta?.contetn,
      image: item.Image,
      author: item.sender?.username || "Unknown",
      scope: "global", // Assuming all are global from this endpoint
      published: true, // Assuming all fetched are published
      publishDate: new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  });
};
