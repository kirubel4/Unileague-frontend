"use client";

import { useState } from "react";
import { Newspaper, Clock, Eye, Zap, Search } from "lucide-react";
import { fetcher } from "@/lib/utils";
import NewsListing from "@/components/pages/NewsListing";

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-3xl" />

        <div className="relative px-6 py-24 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Newspaper className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  ASTU Football News
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                Latest{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Football News
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
                Stay updated with the latest announcements and developments in
                ASTU football.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="w-5 h-5" />
                  <span>Updated Daily</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Eye className="w-5 h-5" />
                  <span>Latest Articles</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Zap className="w-5 h-5" />
                  <span>Breaking News</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Search Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Search News
                </h2>
                <p className="text-gray-600 mt-2">
                  Find articles by title, content, or author
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* News Listing Component */}
        <NewsListing
          apiEndpoint="/api/public/news/global"
          page={page}
          setPage={setPage}
          searchTerm={searchTerm}
          mapper="global"
        />
      </div>
    </div>
  );
}
