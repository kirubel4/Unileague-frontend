// components/news/NewsCard.tsx
"use client";

import { useState } from "react";
import {
  Newspaper,
  Calendar,
  User,
  ChevronRight,
  Bookmark,
  Share2,
  Zap,
  Eye,
  Clock,
} from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  image?: string;
  scope: "global" | "tournament";
  tournament?: string;
  published: boolean;
}

interface NewsCardProps {
  article: NewsArticle;
  scope: "global" | "tournament";
}

export default function NewsCard({ article, scope }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const shareArticle = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  // Format date
  const formattedDate = new Date(article.publishDate).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  // Format time
  const formattedTime = new Date(article.publishDate).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* News Image */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-blue-500/20 to-purple-500/20" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />

        {/* Scope Badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg">
            <Newspaper className="w-3 h-3" />
            <span className="text-xs font-bold">
              {scope === "global" ? "Global" : "Tournament"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={toggleBookmark}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
          >
            <Bookmark
              className={`w-4 h-4 transition-all ${
                isBookmarked ? "text-yellow-300 fill-current" : "text-white"
              }`}
            />
          </button>
          <button
            onClick={shareArticle}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
            {article.title}
          </h3>
        </div>
      </div>

      {/* News Content */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <User className="w-3.5 h-3.5" />
            <span>{article.author}</span>
          </div>
          {isExpanded && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedTime}</span>
            </div>
          )}
        </div>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

        {/* Expanded Content - Accordion Style */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-500 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-4 pt-4 border-t border-gray-100">
            {/* Full Content */}
            <div className="text-gray-700 leading-relaxed space-y-3">
              {(article.content ?? "")
                .split(/\n+/)
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index} className="text-sm md:text-base">
                    {paragraph}
                  </p>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-lg font-bold text-blue-600">
                  {new Date(article.publishDate).getFullYear()}
                </div>
                <div className="text-xs text-blue-500 font-medium">Year</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="text-lg font-bold text-green-600">
                  {
                    (article.content ?? "").trim().split(/\s+/).filter(Boolean)
                      .length
                  }
                </div>

                <div className="text-xs text-green-500 font-medium">Words</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="text-lg font-bold text-purple-600">
                  {article.author.split(" ")[0]}
                </div>
                <div className="text-xs text-purple-500 font-medium">
                  Author
                </div>
              </div>
            </div>

            {/* Key Takeaways */}
            {article.excerpt && (
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-blue-800">Quick Summary</h4>
                </div>
                <ul className="space-y-2">
                  {article.excerpt
                    .split(/[.!?]/)
                    .filter((sentence) => sentence.trim().length > 0)
                    .slice(0, 3)
                    .map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                        <span className="text-sm text-blue-700">
                          {point.trim()}
                          {!point.trim().endsWith(".") && "."}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Status & Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    article.published
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {article.published ? "Published" : "Draft"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleBookmark}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all ${
                    isBookmarked
                      ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      isBookmarked ? "fill-current" : ""
                    }`}
                  />
                  {isBookmarked ? "Saved" : "Save"}
                </button>

                <button
                  onClick={shareArticle}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full group"
          >
            <span
              className={`font-medium text-sm transition-all duration-300 ${
                isExpanded
                  ? "text-blue-600"
                  : "text-gray-700 group-hover:text-blue-600"
              }`}
            >
              {isExpanded ? "Show Less" : "Read Full Story"}
            </span>
            <div
              className={`transition-all duration-300 transform ${
                isExpanded
                  ? "rotate-180 bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
              } p-2 rounded-full`}
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-300 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
