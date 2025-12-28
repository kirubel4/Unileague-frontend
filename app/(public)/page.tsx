import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-300 via-slate-200 to-slate-50">
      {/* Navigation Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1240px]">
        <nav className="bg-white/95 backdrop-blur-lg rounded-full shadow-2xl border border-white px-7 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/d021fb0ec30af6b2fc0a06de605a5078494a9094?width=118"
                  alt="ASTU Logo"
                  width={59}
                  height={35}
                  className="object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-black">ASTU</div>
                <div className="text-xs text-black">Football Management</div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="hidden lg:flex items-center gap-1">
              <a
                href="#"
                className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium transition-colors"
              >
                Home
              </a>
              <a
                href="tournaments"
                className="px-5 py-2 rounded-full text-black text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Tournaments
              </a>
              <a
                href="teams"
                className="px-5 py-2 rounded-full text-black text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Matches
              </a>
              <a
                href="matches"
                className="px-5 py-2 rounded-full text-black text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Teams
              </a>
              <a
                href="news"
                className="px-5 py-2 rounded-full text-black text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                News
              </a>
              <a
                href="about"
                className="px-5 py-2 rounded-full text-black text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                About
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 rounded-full hover:bg-gray-100">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/0 to-black/40" />

        {/* Decorative Blobs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500 rounded-full opacity-30 blur-3xl mix-blend-multiply" />
        <div className="absolute top-40 right-32 w-72 h-72 bg-emerald-500 rounded-full opacity-30 blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-red-500 rounded-full opacity-30 blur-3xl mix-blend-multiply" />

        <div className="relative max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 px-4">
              Adama Science and Technology University Football Management
              System
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8 px-4">
              Experience the future of university football management. Track
              tournaments, follow your favorite teams, and stay updated with
              live matches.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <button className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-2xl hover:shadow-3xl transition-all hover:scale-105 w-full sm:w-auto">
                View Tournaments
              </button>
              <button className="px-8 py-4 rounded-full bg-white border border-white text-black font-semibold shadow-2xl backdrop-blur-sm hover:bg-gray-50 transition-all hover:scale-105 w-full sm:w-auto">
                Live Matches
              </button>
            </div>
          </div>

          {/* Live Match Card */}
          <div className="max-w-md mx-auto">
            <Card className="bg-white border-white shadow-2xl backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg animate-pulse" />
                  <span className="text-emerald-500 font-semibold text-sm">
                    LIVE NOW
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                  Software FC vs CSE
                </h3>
                <div className="text-2xl font-bold text-gray-900 text-center">
                  2 - 1
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 mb-4">
              Latest News & Updates
            </h2>
            <p className="text-lg text-black max-w-2xl mx-auto">
              Stay informed with the latest happenings in university football
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg">
              Breaking News
            </button>
            <button className="px-8 py-3 rounded-full text-black font-semibold hover:bg-gray-100 transition-colors">
              Announcements
            </button>
          </div>

          {/* News Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* News Card 1 */}
            <Card className="border border-black shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/b90d5aac6d823eedd008c49158e1a2744e052179?width=1188"
                  alt="Championship Final"
                  
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/0 to-black/60" />
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold shadow-lg border-0">
                  BREAKING
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">
                  Championship Final Set for December 15th
                </h3>
                <p className="text-base text-black mb-4">
                  The most anticipated match of the season approaches.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black">2 hours ago</span>
                  <a
                    href="#"
                    className="text-indigo-600 font-semibold hover:text-indigo-700"
                  >
                    Read More →
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* News Card 2 */}
            <Card className="border border-black shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/8dd567e0e77ae120f1c13d83a738b00493c57f1a?width=1188"
                  alt="Star Player Joins"
                  
                  className="object-cover opacity-60"
                />
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold shadow-lg border-0">
                  TRANSFER
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">
                  Star Player Joins Software FC
                </h3>
                <p className="text-base text-black mb-4">
                  Major signing strengthens the squad.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black">5 hours ago</span>
                  <a
                    href="#"
                    className="text-indigo-600 font-semibold hover:text-indigo-700"
                  >
                    Read More →
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-200 to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Quick Access
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Current Tournament Card */}
            <Card className="border border-white bg-white shadow-xl backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 16L14.6667 18.6667L20 13.3333M28 16C28 17.5759 27.6896 19.1363 27.0866 20.5922C26.4835 22.0481 25.5996 23.371 24.4853 24.4853C23.371 25.5996 22.0481 26.4835 20.5922 27.0866C19.1363 27.6896 17.5759 28 16 28C14.4241 28 12.8637 27.6896 11.4078 27.0866C9.95189 26.4835 8.62902 25.5996 7.51472 24.4853C6.40042 23.371 5.5165 22.0481 4.91345 20.5922C4.31039 19.1363 4 17.5759 4 16C4 12.8174 5.26428 9.76516 7.51472 7.51472C9.76516 5.26428 12.8174 4 16 4C19.1826 4 22.2348 5.26428 24.4853 7.51472C26.7357 9.76516 28 12.8174 28 16Z"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl">Current Tournament</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-bold text-black">
                  4th Year Championship 2024
                </h3>

                <div className="flex items-center justify-between py-3 rounded-lg">
                  <span className="text-base font-medium text-black">
                    Status:
                  </span>
                  <Badge className="bg-emerald-500 text-gray-900 font-bold px-4 py-1">
                    ONGOING
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-3 rounded-lg">
                  <span className="text-base font-medium text-black">
                    Teams:
                  </span>
                  <span className="text-base font-bold text-black">16</span>
                </div>

                <div className="flex items-center justify-between py-3 rounded-lg">
                  <span className="text-base font-medium text-black">
                    Matches:
                  </span>
                  <span className="text-base font-bold text-black">32</span>
                </div>

                <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  View Details
                </button>
              </CardContent>
            </Card>

            {/* Upcoming Matches Card */}
            <Card className="border border-white bg-white shadow-xl backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 shadow-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 10.6667V16L20 20M28 16C28 17.5759 27.6896 19.1363 27.0866 20.5922C26.4835 22.0481 25.5996 23.371 24.4853 24.4853C23.371 25.5996 22.0481 26.4835 20.5922 27.0866C19.1363 27.6896 17.5759 28 16 28C14.4241 28 12.8637 27.6896 11.4078 27.0866C9.95189 26.4835 8.62902 25.5996 7.51472 24.4853C6.40042 23.371 5.5165 22.0481 4.91345 20.5922C4.31039 19.1363 4 17.5759 4 16C4 12.8174 5.26428 9.76516 7.51472 7.51472C9.76516 5.26428 12.8174 4 16 4C19.1826 4 22.2348 5.26428 24.4853 7.51472C26.7357 9.76516 28 12.8174 28 16Z"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl">Upcoming Matches</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-r-lg p-4">
                  <h3 className="text-base font-bold text-black mb-1">
                    WAR vs MECH
                  </h3>
                  <p className="text-sm text-black">Dec 10, 2024 • 15:00</p>
                </div>

                <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  View All Matches
                </button>
              </CardContent>
            </Card>

            {/* Top Teams Card */}
            <Card className="border border-white bg-white shadow-xl backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.3333 9.33337H28M28 9.33337V20M28 9.33337L17.3333 20L12 14.6667L4 22.6667"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl">Top Teams</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Team 1 */}
                <div className="border border-black rounded-xl p-4 bg-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-black">
                        Software FC
                      </h3>
                      <p className="text-xs text-black">18 matches played</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                        45
                      </div>
                      <p className="text-xs text-black">points</p>
                    </div>
                  </div>
                </div>

                {/* Team 2 */}
                <div className="border border-black rounded-xl p-4 bg-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-black">ECE</h3>
                      <p className="text-xs text-black">18 matches played</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                        42
                      </div>
                      <p className="text-xs text-black">points</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  View Standings
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
