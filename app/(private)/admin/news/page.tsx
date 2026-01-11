"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetcher, getCookie } from "@/lib/utils";
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import useSWR from "swr";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { mapApiToNewsArticle } from "./util";

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  scope: "global" | "tournament";
  tournament?: string;
  published: boolean;
  publishDate: string;
  image: string;
  content: string;
}

export default function AdminNews() {
  const userName = getCookie("uName") || "Admin";
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useSWR(
    `/api/public/news/global?page=${page}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const articles = useMemo(() => {
    return data?.data ? mapApiToNewsArticle(data.data) : [];
  }, [data]);

  // Extract pagination info from API response
  const pagination = data?.meta || {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  };

  // Filter articles based on search term
  const filteredArticles = useMemo(() => {
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  const deleteArticle = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        // TODO: Implement actual delete API call
        alert(`Article "${title}" deleted! (API integration needed)`);
      } catch (error) {
        console.error("Failed to delete article:", error);
        alert("Failed to delete article. Please try again.");
      }
    }
  };

  // Pagination logic
  const getVisiblePages = () => {
    const current = pagination.page;
    const total = pagination.totalPages;
    const delta = 2; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    let prev = 0;
    for (const i of range) {
      if (i - prev > 1) {
        rangeWithDots.push("ellipsis");
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  // Calculate published count
  const publishedCount = useMemo(() => {
    return articles.filter((a) => a.published).length;
  }, [articles]);

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">News</h1>
          <p className="text-muted-foreground mt-1">
            Manage news articles and announcements
          </p>
        </div>
        <Link href="/admin/news/create">
          <Button className="bg-primary hover:bg-blue-600 text-white rounded-lg gap-2 h-10 shadow-sm hover:shadow transition-shadow">
            <Plus className="w-4 h-4" />
            Publish News
          </Button>
        </Link>
      </div>

      {/* Stats and Search Card */}
      <div className="bg-white rounded-lg border border-border p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by title, content, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg h-10 shadow-sm pl-10"
              />
              <svg
                className="absolute left-3 top-3 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm mb-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-foreground mb-2">
              Failed to load articles
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error.message || "Please try again later"}
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="rounded-lg"
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-sm text-muted-foreground">
                      Title
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-sm text-muted-foreground">
                      Scope
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-sm text-muted-foreground">
                      Author
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-sm text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-sm text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-sm text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                      <tr
                        key={article.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {article.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {article.excerpt}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {article.scope === "global"
                                ? "Global"
                                : "Tournament"}
                            </span>
                            {article.tournament && (
                              <span className="text-xs text-muted-foreground truncate max-w-37.5">
                                {article.tournament}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                              {article.author.charAt(0).toUpperCase()}
                            </div>
                            <span>{article.author}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              article.published
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {article.published ? (
                              <>
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                Published
                              </>
                            ) : (
                              <>
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                                Draft
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground">
                          <div className="flex flex-col">
                            <span>{article.publishDate}</span>
                            <span className="text-xs text-muted-foreground/70">
                              {/* Could add time here if needed */}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <Link href={`/admin/news/${article.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 h-8 rounded hover:bg-blue-50"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 h-8 rounded hover:bg-red-50 text-destructive hover:text-destructive"
                              onClick={() =>
                                deleteArticle(article.id, article.title)
                              }
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 px-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                              />
                            </svg>
                          </div>
                          <h3 className="font-medium text-foreground">
                            No articles found
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {searchTerm
                              ? `No articles match "${searchTerm}"`
                              : "No articles have been published yet"}
                          </p>
                          {searchTerm && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSearchTerm("")}
                              className="mt-2 rounded-lg"
                            >
                              Clear search
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalItems > 0 && (
              <div className="border-t border-border/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.totalItems
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{pagination.totalItems}</span>{" "}
                  articles
                </div>

                {pagination.totalPages > 1 && (
                  <Pagination className="justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setPage((prev) => Math.max(prev - 1, 1))
                          }
                          className={
                            pagination.page <= 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer hover:bg-accent"
                          }
                        />
                      </PaginationItem>

                      {getVisiblePages().map((pageNum, index) => (
                        <PaginationItem key={index}>
                          {pageNum === "ellipsis" ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              isActive={pagination.page === pageNum}
                              onClick={() =>
                                typeof pageNum === "number" && setPage(pageNum)
                              }
                              className="cursor-pointer hover:bg-accent"
                            >
                              {pageNum}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setPage((prev) =>
                              Math.min(prev + 1, pagination.totalPages)
                            )
                          }
                          className={
                            pagination.page >= pagination.totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer hover:bg-accent"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
