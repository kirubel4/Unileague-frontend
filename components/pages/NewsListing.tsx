// components/news/NewsListing.tsx
"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { mapApiToNewsArticle } from "@/app/(private)/admin/news/util";
import { mapBroadcastToNewsArticles } from "@/app/(private)/manager/news/util";
import NewsLoadingState from "./NewsLoadingState";
import NewsErrorState from "./NewsErrorState";
import NewsEmptyState from "./NewsEmptyState";
import NewsCard from "./newCard";
import NewsPagination from "./newsPagation";
import { NewsArticle } from "@/app/(private)/admin/news/page";

interface NewsListingProps {
  apiEndpoint: string;
  page: number;
  setPage: (page: number) => void;
  searchTerm: string;
  mapper: "global" | "manager";
}

export default function NewsListing({
  apiEndpoint,
  page,
  setPage,
  searchTerm,
  mapper,
}: NewsListingProps) {
  const { data, isLoading, error } = useSWR(
    `${apiEndpoint}${mapper === "manager" ? "&" : "?"}page=${page}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );
  console.log(data?.data);
  // Map API data to news articles
  const articles = useMemo(() => {
    if (!data?.data) return [];

    return mapApiToNewsArticle(data.data);
  }, [data, mapper]);

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

  // Loading state
  if (isLoading) {
    return <NewsLoadingState />;
  }

  // Error state
  if (error) {
    return <NewsErrorState error={error} />;
  }

  // Empty state
  if (filteredArticles.length === 0) {
    return <NewsEmptyState searchTerm={searchTerm} clearSearch={() => {}} />;
  }

  return (
    <>
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Latest News
            <span className="text-gray-600 text-lg ml-2">
              ({filteredArticles.length} articles)
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article as NewsArticle}
              scope={mapper === "global" ? "global" : "tournament"}
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <NewsPagination pagination={pagination} onPageChange={setPage} />
    </>
  );
}
