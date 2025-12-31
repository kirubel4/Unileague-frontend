"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiResponse, fetcher, getCookie } from "@/lib/utils";
import {
  Trash2,
  Edit,
  Plus,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { mapBroadcastToNewsArticles, NewsArticle } from "./util";

export default function ManagerNews() {
  const userName = getCookie("uName") || "Manager";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data,
    error,
    isLoading,
    mutate: newMutate,
  } = useSWR("/api/public/news/tournament", fetcher, {
    revalidateOnFocus: false,
  });

  const articles: NewsArticle[] = mapBroadcastToNewsArticles(data);
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function deleteArticle(id: string) {
    setDeleteLoading(id);
    setDeleteError(null);

    try {
      const res = await fetch("/api/protected/manager/news/delete?id=" + id, {
        method: "DELETE",
      });

      const response: ApiResponse = await res.json();

      if (!response.success) {
        setDeleteError(
          response.message || "Failed to delete article. Please try again."
        );
        console.error("Delete failed:", response.message);
        return;
      }

      // Show success feedback
      const successMessage = "Article deleted successfully";
      console.log(successMessage);

      // Refresh the data
      await newMutate();
    } catch (error) {
      setDeleteError(
        "Network error occurred. Please check your connection and try again."
      );
      console.error("Delete error:", error);
    } finally {
      setDeleteLoading(null);
    }
  }

  // Clear delete error after 5 seconds
  if (deleteError) {
    setTimeout(() => setDeleteError(null), 5000);
  }

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              News & Updates
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage tournament news, announcements, and updates
            </p>
          </div>
          <Link href="/manager/news/create">
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md">
              <Plus className="w-4 h-4" />
              Create Article
            </Button>
          </Link>
        </div>
      </div>

      {/* Delete Error Banner */}
      {deleteError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800">Delete Failed</p>
              <p className="text-sm text-red-700 mt-1">{deleteError}</p>
            </div>
            <button
              onClick={() => setDeleteError(null)}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search articles by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg h-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Articles</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-700">Loading News Articles</p>
              <p className="text-sm text-gray-500 mt-2">
                Fetching tournament news and updates...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-white rounded-xl border border-red-200 p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to Load Articles
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We couldn't fetch the news articles. This might be due to
                network issues or server problems.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => newMutate()}
                className="gap-2"
              >
                <Loader2 className="w-4 h-4" />
                Retry Loading
              </Button>
              <Button variant="ghost" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredArticles.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Articles Found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all"
                  ? "No articles match your search criteria. Try adjusting your filters."
                  : "No news articles have been created yet. Create your first article to share updates with tournament participants."}
              </p>
            </div>
            {!searchTerm && statusFilter === "all" && (
              <Link href="/manager/news/create">
                <Button className="gap-2 mt-4">
                  <Plus className="w-4 h-4" />
                  Create First Article
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {!isLoading && !error && filteredArticles.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-gray-500 mb-2">
            Showing {filteredArticles.length} of {articles.length} articles
            {searchTerm && ` matching "${searchTerm}"`}
            {statusFilter !== "all" && ` (${statusFilter})`}
          </div>

          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {article.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        article.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {article.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {article.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {article.publishedDate}
                    </span>
                    {article.status === "published" && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.views || 0} views
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Link href={`/manager/news/${article.id}/edit`}>
                    <Button variant="outline" className="gap-2 h-9">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className={`gap-2 h-9 ${
                      deleteLoading === article.id
                        ? "bg-gray-50 cursor-not-allowed"
                        : "text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
                    }`}
                    onClick={() => deleteArticle(article.id)}
                    disabled={deleteLoading === article.id}
                  >
                    {deleteLoading === article.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Delete warning */}
              <div
                className={`mt-4 pt-4 border-t border-gray-100 ${
                  deleteLoading === article.id ? "block" : "hidden"
                }`}
              >
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting article... Please wait</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
