"use client";

import Link from "next/link";
import {
  Trophy,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Heart,
} from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribed:", email);
    setEmail("");
    alert("Thank you for subscribing to our newsletter!");
  };

  const quickLinks = [
    { label: "Tournaments", href: "/tournaments", icon: Trophy },
    { label: "Teams", href: "/teams", icon: Users },
    { label: "Matches", href: "/matches", icon: Calendar },
    { label: "News", href: "/news", icon: Globe },
    { label: "About", href: "/about", icon: Shield },
  ];

  const socialLinks = [
    {
      platform: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/astufootball",
      color: "hover:text-blue-400",
    },
    {
      platform: "Facebook",
      icon: Facebook,
      href: "https://facebook.com/astufootball",
      color: "hover:text-blue-600",
    },
    {
      platform: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/astufootball",
      color: "hover:text-pink-500",
    },
    {
      platform: "YouTube",
      icon: Youtube,
      href: "https://youtube.com/astufootball",
      color: "hover:text-red-500",
    },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      text: "Adama Science and Technology University, Adama, Ethiopia",
      label: "Location",
    },
    { icon: Phone, text: "+251 11 234 5678", label: "Phone" },
    { icon: Mail, text: "football@astu.edu.et", label: "Email" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-800">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl flex items-center justify-center overflow-hidden border-2 border-white/20">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  ASTU Football
                </div>
                <div className="text-sm text-gray-400">
                  Sports Management System
                </div>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed">
              The official football management platform of Adama Science and
              Technology University. Bringing together players, teams, and fans
              through technology.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 ${social.color} transition-all hover:scale-110 hover:border-white/20`}
                  aria-label={social.platform}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <li key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-300">
                        {info.label}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {info.text}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates, match
              schedules, and tournament announcements.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Secure & Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 lg:my-12 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ASTU Football Management System. All
              rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2 flex items-center justify-center md:justify-start gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-current" />{" "}
              for the university community
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/faq"
              className="text-gray-400 hover:text-white transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Back to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-50"
          aria-label="Back to top"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>

      {/* Decorative Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
    </footer>
  );
}
