"use client";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown, Settings, Bell } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { useState } from "react";

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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100 shadow-sm">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left - Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group transition-all duration-200"
        >
          <div className="relative w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
            <span className="text-white font-bold text-lg">⚽</span>
            <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              FootballHub
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
            className="relative rounded-full w-9 h-9 hover:bg-gray-50 transition-colors"
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
            className="rounded-full w-9 h-9 hover:bg-gray-50 transition-colors"
            onClick={() => console.log("Settings")}
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
                  {userName}
                </p>
                <p className="text-xs text-gray-500 font-medium">{userRole}</p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
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
                      {userName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{userRole}</p>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleLogout}
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
      </div>
    </header>
  );
}
