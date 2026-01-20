"use client";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown, Settings, Bell } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import ConfirmModal from "../comfirm";

interface TopBarProps {
  userRole?: string;
  userName?: string;
}

export function TopBar({
  userRole = "Super Admin",
  userName = "Admin User",
}: TopBarProps) {
  const navigate = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openModalId, setOpenModalId] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentUserName, setCurrentUserName] = useState(userName);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update username from cookie after mount
  useEffect(() => {
    setMounted(true);

    // Function to get cookie client-side
    const getCookie = (name: string): string | null => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(";").shift() || null;
      }
      return null;
    };

    const cookieUserName = getCookie("uName");
    if (cookieUserName) {
      setCurrentUserName(cookieUserName);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      navigate.replace("/auth");
    }
  };

  const route = userRole === "Manager" ? "/manager" : "/admin";

  // Don't render user-specific content until mounted (hydration safe)
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between w-full">
          {/* Left - Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 md:gap-3 group transition-all duration-200 min-w-0"
          >
            <div className="relative w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg md:rounded-xl flex items-center justify-center shadow-sm md:shadow-md group-hover:shadow transition-shadow duration-200 shrink-0">
              <span className="text-white font-bold text-base md:text-lg">
                ⚽
              </span>
              <div className="absolute -inset-1 bg-primary/20 rounded-lg md:rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                UniLeague-Hub
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wide hidden sm:block">
                ADMIN PANEL
              </span>
            </div>
          </Link>

          {/* Skeleton for user profile while loading */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 pr-1 md:pr-2 py-1">
              <div className="text-right hidden sm:block">
                <div className="h-4 w-16 md:w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-12 md:w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Format username for mobile
  const getDisplayName = () => {
    if (typeof window === "undefined") return currentUserName;
    if (window.innerWidth < 640) {
      // On mobile, show initials or first name
      const parts = currentUserName.split(" ");
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
      }
      return currentUserName.substring(0, 2);
    }
    return currentUserName;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between w-full">
        {/* Left - Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 group transition-all duration-200 min-w-0"
        >
          <div className="relative w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg md:rounded-xl flex items-center justify-center shadow-sm md:shadow-md group-hover:shadow transition-shadow duration-200 shrink-0">
            <span className="text-white font-bold text-base md:text-lg">
              ⚽
            </span>
            <div className="absolute -inset-1 bg-primary/20 rounded-lg md:rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
              UniLeague-Hub
            </span>
            <span className="text-xs text-gray-500 font-medium tracking-wide hidden sm:block">
              ADMIN PANEL
            </span>
          </div>
        </Link>

        {/* Right - User Info & Actions */}
        <div className="flex items-center gap-2 md:gap-3" ref={userMenuRef}>
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full w-8 h-8 md:w-9 md:h-9 hover:bg-gray-100 transition-colors"
            onClick={() => console.log("Notifications")}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border border-white">
              3
            </span>
          </Button>

          {/* Settings - Mobile only in dropdown, desktop as separate button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hidden md:flex w-9 h-9 hover:bg-gray-100 transition-colors"
            onClick={() => navigate.push(`${route}/settings`)}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>

          {/* User Profile with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 pr-1 md:pr-2 py-1 rounded-lg md:rounded-xl hover:bg-gray-50 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px] md:max-w-none">
                  {currentUserName}
                </p>
                <p className="text-xs text-gray-500 font-medium truncate">
                  {userRole}
                </p>
              </div>

              {/* Mobile - Show initials badge */}
              <div className="sm:hidden relative">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-semibold">
                    {getDisplayName()}
                  </span>
                </div>
              </div>

              {/* Desktop - Show user icon */}
              <div className="relative hidden sm:block">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="absolute inset-0 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <ChevronDown
                className={`w-3 h-3 md:w-4 md:h-4 text-gray-500 transition-transform duration-200 ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 md:px-4 py-2 md:py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {currentUserName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {userRole}
                    </p>
                  </div>

                  <div className="py-1 md:py-2">
                    {/* Settings for mobile */}
                    <button
                      className="flex items-center gap-3 w-full px-3 md:px-4 py-2 md:py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors md:hidden"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate.push(`${route}/settings`);
                      }}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>

                    {/* Profile link if needed */}
                    <button
                      className="flex items-center gap-3 w-full px-3 md:px-4 py-2 md:py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setShowUserMenu(false);
                        // Add profile navigation if needed
                      }}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-1 md:pt-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setOpenModalId(true);
                      }}
                      className="flex items-center gap-3 w-full px-3 md:px-4 py-2 md:py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-1 md:mx-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={openModalId}
        onConfirm={handleLogout}
        onCancel={() => setOpenModalId(false)}
        message="Are you sure you want to logout?"
      />
    </header>
  );
}
