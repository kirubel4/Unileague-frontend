"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCookie } from "@/lib/utils";

import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  scope: "global" | "tournament";
  tournament?: string;
  published: boolean;
  publishDate: string;
}

export default function AdminNews() {
  const userName = getCookie("uName") || "Admin";
  const [searchTerm, setSearchTerm] = useState("");

  const articles: NewsArticle[] = [
    {
      id: 1,
      title: "City League Championship Final Confirmed",
      excerpt:
        "The final match details have been confirmed for the championship...",
      author: "Admin",
      scope: "global",
      published: true,
      publishDate: "Dec 15, 2024",
    },
    {
      id: 2,
      title: "New Registration Rules for 2024",
      excerpt: "Updated registration requirements and procedures...",
      author: "Admin",
      scope: "global",
      published: true,
      publishDate: "Dec 10, 2024",
    },
    {
      id: 3,
      title: "City League - Week 10 Results",
      excerpt: "Summary of this week's matches and standings...",
      author: "John Smith",
      scope: "tournament",
      tournament: "City League Championship",
      published: true,
      publishDate: "Dec 8, 2024",
    },
    {
      id: 4,
      title: "Upcoming Tournament Announcements",
      excerpt: "Draft announcement pending review...",
      author: "Sarah Johnson",
      scope: "tournament",
      tournament: "Regional Cup",
      published: false,
      publishDate: "Dec 18, 2024",
    },
  ];

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePublish = (id: number) => {
    const article = articles.find((a) => a.id === id);
    alert(
      `Article "${article?.title}" ${
        article?.published ? "unpublished" : "published"
      }!`
    );
  };

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
          <Button className="bg-primary hover:bg-blue-600 text-white rounded-lg gap-2 h-10">
            <Plus className="w-4 h-4" />
            Publish News
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-border p-4 mb-6">
        <Input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg h-9"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Scope
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Author
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-border hover:bg-muted transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {article.excerpt}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {article.scope === "global"
                        ? "Global"
                        : `Tournament: ${article.tournament}`}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {article.author}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          article.published ? "status-active" : "status-pending"
                        }`}
                      >
                        {article.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {article.publishDate}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 h-8 rounded"
                          onClick={() => togglePublish(article.id)}
                        >
                          {article.published ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Link href={`/admin/news/${article.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 h-8 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 h-8 rounded text-destructive hover:bg-red-50"
                          onClick={() =>
                            alert("Delete article: " + article.title)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 px-4 text-center text-muted-foreground"
                  >
                    No articles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
