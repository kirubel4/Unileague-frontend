"use client";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown, Settings, Bell } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { useState, useEffect } from "react";
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

  // Update username from cookie after mount
  useEffect(() => {
    setMounted(true);

    // Function to get cookie client-side
    const getCookie = (name: string): string | null => {
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
      <header className="fixed mb-10 top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-full">
          {/* Left - Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-all duration-200"
          >
            <div className="relative w-9 h-9 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
              <span className="text-white font-bold text-lg">⚽</span>
              <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                UniLeague-Hub
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wide">
                ADMIN PANEL
              </span>
            </div>
          </Link>

          {/* Skeleton for user profile while loading */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 pl-3 pr-2 py-1">
              <div className="text-right">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-12 bg-gray-200 rounded animate-pulse mt-1"></div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed mb-10 top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-full">
        {/* Left - Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group transition-all duration-200"
        >
          <div className="relative w-9 h-9 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
            <span className="text-white font-bold text-lg">⚽</span>
            <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              UniLeague-Hub
            </span>
            <span className="text-xs text-gray-500 font-medium tracking-wide">
              ADMIN PANEL
            </span>
          </div>
        </Link>

        {/* Right - User Info & Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hidden lg:flex w-9 h-9 hover:bg-gray-200 transition-colors"
            onClick={() => console.log("Notifications")}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
              3
            </span>
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hidden lg:flex w-9 h-9 hover:bg-gray-200 transition-colors"
            onClick={() => {
              navigate.push(`${route}/settings`);
            }}
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>

          {/* User Profile with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-3 pr-2 py-1 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {currentUserName}
                </p>
                <p className="text-xs text-gray-500 font-medium">{userRole}</p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {currentUserName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{userRole}</p>
                  </div>

                  <div className="py-2">
                    <div
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate.push(`${route}/settings`);
                      }}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={() => setOpenModalId(true)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-2"
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
        <ConfirmModal
          isOpen={openModalId}
          onConfirm={() => handleLogout()}
          onCancel={() => setOpenModalId(false)}
          message="Do you want to logout"
        />
      </div>
    </header>
  );
}
