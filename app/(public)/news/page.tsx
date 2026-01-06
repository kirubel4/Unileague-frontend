"use client";

import { useState } from "react";
import {
  Calendar,
  Newspaper,
  TrendingUp,
  Zap,
  Clock,
  ChevronRight,
  ExternalLink,
  Bookmark,
  Share2,
  Tag,
} from "lucide-react";
import useSWR from "swr";
import {
  mapBroadcastToNewsArticles,
  NewsArticle,
} from "@/app/(private)/manager/news/util";
import { fetcher } from "@/lib/utils";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  fullContent: string;
  category: "BREAKING" | "TRANSFER" | "UPDATE" | "ANNOUNCEMENT";
  timestamp: string;
  image?: string;
  author?: string;
  readTime?: string;
  views?: number;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Championship Final Set for December 15th at New ASTU Stadium",
    description:
      "The most anticipated match of the season approaches as Software FC prepares to face CSE in the grand finale.",
    fullContent:
      "The championship final is officially scheduled for December 15th at the newly inaugurated ASTU Main Stadium. After months of intense competition, Software FC and CSE have emerged as the top contenders. Both teams have shown exceptional performance throughout the tournament, with Software FC maintaining an unbeaten streak and CSE showcasing remarkable defensive prowess. The match will feature state-of-the-art broadcasting with 4K resolution and multi-angle replays. Security has been heightened with advanced screening systems to ensure a safe environment for all spectators. Pre-match entertainment includes performances by the university band and special appearances by alumni football stars.",
    category: "BREAKING",
    timestamp: "2 days ago",
    image:
      "https://images.unsplash.com/photo-1511204579483-e5c2b1d69acd?w=800&h=400&fit=crop",
    author: "Sports Desk",
    readTime: "5 min read",
    views: 2450,
  },
  {
    id: 2,
    title: "Star Player Alex Morgan Joins Software FC in Record Transfer Deal",
    description:
      "Major signing strengthens the squad with international experience and exceptional skills.",
    fullContent:
      "Software FC has secured the signature of Alex Morgan in a groundbreaking transfer deal worth $2.5 million. The 24-year-old striker, known for his lightning speed and clinical finishing, joins from Manchester United's youth academy. Morgan has signed a three-year contract with the option to extend for two additional years. The transfer marks a significant investment in Software FC's offensive capabilities and signals their ambition to dominate university football. Team coach Michael Chen stated, 'Alex brings a level of professionalism and skill that will elevate our entire squad. His experience in top-tier competitions will be invaluable.' Morgan will wear the number 7 jersey and is expected to make his debut in the upcoming derby.",
    category: "TRANSFER",
    timestamp: "5 hours ago",
    image:
      "https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=800&h=400&fit=crop",
    author: "Transfer Team",
    readTime: "4 min read",
    views: 1870,
  },
  {
    id: 3,
    title: "New ASTU Stadium Opening Ceremony with Special Guest Appearances",
    description:
      "State-of-the-art facility ready for tournaments with capacity of 15,000 spectators.",
    fullContent:
      "The $50 million ASTU Stadium will officially open next month with a spectacular ceremony featuring former university football stars and local celebrities. The 15,000-seat facility boasts advanced features including: Under-soil heating system for year-round play, FIFA-certified hybrid grass pitch, 4K LED screens for enhanced viewing, Solar-powered energy system with battery storage, Premium hospitality suites with private balconies, and Advanced player recovery facilities. The stadium's design incorporates sustainable materials and smart technology for energy efficiency. President Dr. Samuel Johnson will inaugurate the stadium, stating 'This facility represents our commitment to sports excellence and student development.' Opening week includes exhibition matches, community events, and facility tours.",
    category: "UPDATE",
    timestamp: "1 day ago",
    image:
      "https://images.unsplash.com/photo-1543321269-9d86d3680e1c?w=800&h=400&fit=crop",
    author: "Campus News",
    readTime: "6 min read",
    views: 3200,
  },
  {
    id: 4,
    title: "New Scholarship Program Announced for Student Athletes",
    description:
      "ASTU introduces comprehensive scholarship packages for football talent.",
    fullContent:
      "The university has launched a new scholarship program targeting exceptional football talent among incoming students. The program offers: Full tuition coverage for four years, Monthly stipend for training expenses, Access to professional coaching and nutritionists, Internship opportunities with partner football clubs, and Academic support with flexible scheduling. Applications open next month for the 2024 academic year. Selection will be based on football skills, academic performance, and leadership potential. The program aims to develop well-rounded athletes who can excel both on the field and in the classroom.",
    category: "ANNOUNCEMENT",
    timestamp: "3 days ago",
    image:
      "https://images.unsplash.com/photo-1519861158985-92a5d5f8b486?w=800&h=400&fit=crop",
    author: "Admissions Office",
    readTime: "3 min read",
    views: 1560,
  },
  {
    id: 5,
    title: "Football Coaching Staff Expanded with International Experts",
    description:
      "New coaching team brings European training methodologies to ASTU.",
    fullContent:
      "ASTU has recruited three international coaches to enhance the football program's technical development. The new team includes: Coach Marco Rossi (Italy) - Specializing in tactical analysis, Coach Kim Ji-hoon (South Korea) - Strength and conditioning expert, and Coach Maria Gonzalez (Spain) - Youth development specialist. They will implement advanced training programs focusing on technical skills, tactical awareness, and sports psychology. The coaching team will also conduct regular workshops for local coaches and organize international friendly matches to expose players to different playing styles.",
    category: "UPDATE",
    timestamp: "6 hours ago",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=400&fit=crop",
    author: "Sports Department",
    readTime: "4 min read",
    views: 980,
  },
  {
    id: 6,
    title: "Inter-Department League Kicks Off with Record Participation",
    description:
      "32 teams from across campus compete in the annual football tournament.",
    fullContent:
      "The Inter-Department Football League has begun with unprecedented participation from 32 teams representing all faculties. The tournament features: Group stage with round-robin format, Knockout phase starting next month, Newly introduced fair play award, and Live streaming of all matches. Engineering FC leads Group A with three consecutive wins, while Medical Warriors showcase impressive defensive organization. The tournament serves as a scouting ground for the university's main team, with several standout players expected to receive call-ups. Special awards include top scorer, best goalkeeper, and most valuable player.",
    category: "BREAKING",
    timestamp: "Today",
    image:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=400&fit=crop",
    author: "Tournament Desk",
    readTime: "5 min read",
    views: 4100,
  },
];

const categoryColors = {
  BREAKING: "bg-gradient-to-r from-red-500 to-red-600 text-white",
  TRANSFER: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
  UPDATE: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
  ANNOUNCEMENT: "bg-gradient-to-r from-green-500 to-green-600 text-white",
};

const categoryIcons = {
  BREAKING: Zap,
  TRANSFER: TrendingUp,
  UPDATE: Newspaper,
  ANNOUNCEMENT: Tag,
};

export default function NewsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const {
    data,
    error,
    isLoading,
    mutate: newMutate,
  } = useSWR("/api/public/news/tournament", fetcher, {
    revalidateOnFocus: false,
  });

  const articles: NewsArticle[] = mapBroadcastToNewsArticles(data);
  const categories = ["ALL", "BREAKING", "TRANSFER", "UPDATE", "ANNOUNCEMENT"];

  const filteredNews =
    selectedCategory === "ALL"
      ? newsItems
      : newsItems.filter((item) => item.category === selectedCategory);

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
                Stay updated with the latest announcements, transfers, and
                developments in ASTU football. Never miss important updates from
                your favorite teams and players.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="w-5 h-5" />
                  <span>Updated Daily</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Zap className="w-5 h-5" />
                  <span>Breaking News Alerts</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="w-5 h-5" />
                  <span>Event Coverage</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Category Filters */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Filter News
                </h2>
                <p className="text-gray-600 mt-2">Browse news by category</p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news articles..."
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-64"
                />
                <Newspaper className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon =
                  categoryIcons[category as keyof typeof categoryIcons] ||
                  Newspaper;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border
                      ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-transparent"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category === "ALL" ? "All News" : category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === "ALL"
                ? "Latest News"
                : `${selectedCategory} News`}
              <span className="text-gray-600 text-lg ml-2">
                ({filteredNews.length} articles)
              </span>
            </h2>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              <span>View Archive</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNews.map((item) => {
              const Icon = categoryIcons[item.category];
              const isExpanded = expandedId === item.id;
              const isBookmarked = bookmarked.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? "lg:col-span-2 lg:row-span-2"
                      : "hover:shadow-xl"
                  }`}
                >
                  {/* News Image */}
                  <div className="relative h-48 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                          categoryColors[item.category]
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span className="text-xs font-semibold">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(item.id);
                        }}
                        className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            isBookmarked
                              ? "text-yellow-400 fill-current"
                              : "text-white"
                          }`}
                        />
                      </button>
                      <button className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                        <Share2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* News Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.timestamp}
                      </div>
                      {item.author && (
                        <div className="text-sm text-gray-500">
                          • By {item.author}
                        </div>
                      )}
                      {item.views && (
                        <div className="text-sm text-gray-500">
                          • {item.views.toLocaleString()} views
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>

                    <p
                      className={`text-gray-600 mb-4 ${
                        isExpanded ? "" : "line-clamp-2"
                      }`}
                    >
                      {isExpanded ? item.fullContent : item.description}
                    </p>

                    {isExpanded && (
                      <div className="space-y-4 mt-6">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <h4 className="font-semibold text-blue-800 mb-2">
                            Key Takeaways:
                          </h4>
                          <ul className="list-disc list-inside text-blue-700 space-y-1">
                            <li>
                              Event scheduled for December 15th at ASTU Stadium
                            </li>
                            <li>Advanced security measures implemented</li>
                            <li>4K live broadcast available</li>
                            <li>Pre-match entertainment planned</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-3">
                        {item.readTime && (
                          <span className="text-sm text-gray-500">
                            {item.readTime}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : item.id)
                        }
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <span>
                          {isExpanded ? "Show Less" : "Read Full Story"}
                        </span>
                        {isExpanded ? (
                          <ExternalLink className="w-4 h-4 rotate-45" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              <Newspaper className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Never Miss an Update
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest football news,
              match updates, and exclusive content delivered directly to your
              inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe at
              any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
