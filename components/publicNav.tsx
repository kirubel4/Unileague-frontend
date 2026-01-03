"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Trophy,
  Menu,
  X,
  Home,
  Calendar,
  Users,
  Newspaper,
  Info,
  Shield,
  ChevronDown,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Tournaments", href: "/tournaments", icon: Trophy },
    { label: "Matches", href: "/matches", icon: Calendar },
    { label: "Teams", href: "/teams", icon: Users },
    { label: "News", href: "/news", icon: Newspaper },
    { label: "About", href: "/about", icon: Info },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "shadow-2xl" : "shadow-lg"
      }`}
    >
      <nav
        className={`relative overflow-hidden transition-all duration-300 ${
          isScrolled
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
        }`}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-r from-green-500/5 to-blue-500/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl flex items-center justify-center overflow-hidden border-2 border-white/20">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white">ASTU</span>
                  <div className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                  <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    FOOTBALL
                  </span>
                </div>
                <div className="text-xs text-gray-300/80 tracking-wider">
                  SPORTS MANAGEMENT
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      active
                        ? "text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`w-4 h-4 transition-transform ${
                          active ? "scale-110" : ""
                        }`}
                      />
                      <span>{link.label}</span>
                    </div>

                    {/* Active indicator */}
                    {active && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                    )}

                    {/* Hover effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="relative w-6 h-6">
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-white transform rotate-180 transition-transform duration-300" />
                ) : (
                  <Menu className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                )}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-6 border-t border-white/10">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        active
                          ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white backdrop-blur-sm border border-white/10"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon
                        className={`w-4 h-4 ${active ? "text-blue-400" : ""}`}
                      />
                      <span>{link.label}</span>
                      {active && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </nav>
    </header>
  );
}
