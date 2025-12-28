"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/utils";

import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { mapBroadcastToNewsArticles, NewsArticle } from "./util";

export default function ManagerNews() {
  const userName = "Manager";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const {
    data,
    error,
    isLoading,
    mutate: newMutate,
  } = useSWR("/api/public/news/tournament", fetcher, {
    revalidateOnFocus: false,
  });

  const articles: NewsArticle[] = mapBroadcastToNewsArticles(data);
  console.log(data?.data);
  console.log(articles);
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // const togglePublish = (id: number) => {
  //   setArticles((prevArticles) =>
  //     prevArticles.map((article) =>
  //       article.id === id
  //         ? {
  //             ...article,
  //             status: article.status === "published" ? "draft" : "published",
  //             publishedDate:
  //               article.status === "draft"
  //                 ? new Date().toLocaleDateString()
  //                 : article.publishedDate,
  //           }
  //         : article
  //     )
  //   );
  // };

  // const deleteArticle = (id: number) => {
  //   setArticles((prevArticles) =>
  //     prevArticles.filter((article) => article.id !== id)
  //   );
  // };

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">News & Updates</h1>
          <p className="text-muted-foreground mt-1">
            Manage tournament news and announcements
          </p>
        </div>
        <Link href="/manager/news/create">
          <Button className="bg-primary hover:bg-blue-600 text-white rounded-lg gap-2 h-10">
            <Plus className="w-4 h-4" />
            Create Article
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-border p-4 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg h-9 flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      article.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {article.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                <span>By {article.author}</span>
                <span>•</span>
                <span>{article.publishedDate}</span>
                {article.status === "published" && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.views} views
                    </span>
                  </>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  // onClick={() => togglePublish(article.id)}
                  variant="outline"
                  size="sm"
                  className={`gap-2 h-8 rounded ${
                    article.status === "published"
                      ? "text-orange-600 hover:bg-orange-50"
                      : "text-green-600 hover:bg-green-50"
                  }`}
                >
                  {article.status === "published" ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Publish
                    </>
                  )}
                </Button>
                <Link href={`/manager/news/${article.id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 h-8 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 h-8 rounded text-destructive hover:bg-red-50"
                  // onClick={() => deleteArticle(article.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">No articles found</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
