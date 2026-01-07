"use client";

import { useState } from "react";
import { Newspaper, Clock, Eye, Zap, Search } from "lucide-react";
import { fetcher } from "@/lib/utils";
import NewsListing from "@/components/pages/NewsListing";

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
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
