"use client";

import Link from "next/link";
import {
  Trophy,
  Calendar,
  Users,
  Newspaper,
  Target,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[20px_20px]" />

        <div className="relative px-6 py-24 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl text-center mx-auto">
              {/* Logo/Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Trophy className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  ASTU Football Management
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                ASTU Football Platform
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                A comprehensive platform for managing university football
                tournaments, tracking teams, and following matches. Everything
                you need in one place.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/tournaments"
                  className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  <Trophy className="w-5 h-5" />
                  Browse Tournaments
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  href="/matches"
                  className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                >
                  View Matches
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-gray-50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Quick Navigation */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Explore Our Platform
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tournaments Card */}
            <Link
              href="/tournaments"
              className="group bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-linear-to-r from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Tournaments
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse all university football tournaments and competitions
                </p>
                <div className="text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Matches Card */}
            <Link
              href="/matches"
              className="group bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-linear-to-r from-green-100 to-green-50 border border-green-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Matches
                </h3>
                <p className="text-gray-600 mb-4">
                  View match schedules, results, and live scores
                </p>
                <div className="text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  <span>View Schedule</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Teams Card */}
            <Link
              href="/teams"
              className="group bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-linear-to-r from-purple-100 to-purple-50 border border-purple-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Teams</h3>
                <p className="text-gray-600 mb-4">
                  Explore all teams, players, and performance statistics
                </p>
                <div className="text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  <span>Browse Teams</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* News Card */}
            <Link
              href="/news"
              className="group bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-linear-to-r from-orange-100 to-orange-50 border border-orange-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Newspaper className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">News</h3>
                <p className="text-gray-600 mb-4">
                  Stay updated with the latest football news and announcements
                </p>
                <div className="text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  <span>Read News</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Platform Description */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              About This Platform
            </h2>

            <div className="space-y-6 text-gray-700 text-lg">
              <p>
                The ASTU Football Management System is designed to streamline
                and enhance the university football experience for everyone
                involved - from players and coaches to students and fans.
              </p>

              <p>
                Our platform provides real-time updates, comprehensive
                statistics, and easy access to all football-related information
                across Adama Science and Technology University.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Live Updates
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Real-time match scores and tournament updates
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Complete Schedule
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Full tournament and match schedule available
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Team Management
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Detailed team profiles and player statistics
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Trophy className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Tournament Hub
                    </h4>
                    <p className="text-gray-600 text-sm">
                      All university tournaments in one place
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Access
          </h3>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/tournaments"
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:shadow-lg transition-all"
            >
              View Tournaments
            </Link>

            <Link
              href="/matches"
              className="px-6 py-3 bg-linear-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:shadow-lg transition-all"
            >
              Check Matches
            </Link>

            <Link
              href="/teams"
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:shadow-lg transition-all"
            >
              Browse Teams
            </Link>

            <Link
              href="/news"
              className="px-6 py-3 bg-linear-to-r from-orange-600 to-orange-700 text-white font-medium rounded-xl hover:shadow-lg transition-all"
            >
              Read News
            </Link>

            <Link
              href="/about"
              className="px-6 py-3 bg-linear-to-r from-gray-600 to-gray-700 text-white font-medium rounded-xl hover:shadow-lg transition-all"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
