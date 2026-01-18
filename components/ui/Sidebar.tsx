"use client";

import {
  LayoutDashboard,
  Trophy,
  Users,
  Newspaper,
  Image,
  Settings,
  Menu,
  X,
  Calendar,
  BarChart3,
  Shield,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  History,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  role?: "super_admin" | "manager" | "coach";
}

const superAdminMenu = [
  { label: "Dashboard", path: "/admin/", icon: LayoutDashboard },
  { label: "Tournaments", path: "/admin/tournaments", icon: Trophy },
  { label: "Managers", path: "/admin/managers", icon: Users },
  { label: "News", path: "/admin/news", icon: Newspaper },
  { label: "System Logs", path: "/admin/system-logs", icon: AlertCircle },
  { label: "Messages", path: "/admin/messages", icon: MessageSquare },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const coachMenu = [
  {
    label: "Lineup Management",
    path: "/coach/line-up",
    icon: Users,
  },
  {
    label: "Team Images",
    path: "/coach/images",
    icon: Image,
  },
  {
    label: "Line-Up Requests",
    path: "/coach/lineupHistory",
    icon: History,
  },
  {
    label: "All Games",
    path: "/coach/fixtures",
    icon: Calendar,
  },
  {
    label: "Team Stats",
    path: "/coach/stats",
    icon: BarChart3,
  },
  {
    label: "Messages",
    path: "/coach/messages",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    path: "/coach/settings",
    icon: Settings,
  },
];

const managerMenu = [
  { label: "Dashboard", path: "/manager/", icon: LayoutDashboard },
  { label: "Teams", path: "/manager/teams", icon: Users },
  { label: "Players", path: "/manager/players", icon: Shield },
  { label: "Fixtures", path: "/manager/fixtures", icon: Calendar },
  { label: "Matches", path: "/manager/matches", icon: Trophy },
  { label: "Standings", path: "/manager/standings", icon: BarChart3 },
  { label: "News", path: "/manager/news", icon: Newspaper },
  { label: "Gallery", path: "/manager/gallery", icon: Image },
  { label: "Messages", path: "/manager/messages", icon: MessageSquare },
  { label: "Settings", path: "/manager/settings", icon: Settings },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getMenu = () => {
    switch (role) {
      case "super_admin":
        return superAdminMenu;
      case "manager":
        return managerMenu;
      case "coach":
        return coachMenu;
      default:
        return [];
    }
  };

  const menu = getMenu();

  const getSectionTitle = () => {
    switch (role) {
      case "super_admin":
        return "Administration";
      case "manager":
        return "Team Management";
      case "coach":
        return "Team Coaching";
      default:
        return "";
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "manager":
        return "Team Manager";
      case "coach":
        return "Team Coach";
      default:
        return "";
    }
  };

  const getInitials = () => {
    switch (role) {
      case "super_admin":
        return "SA";
      case "manager":
        return "TM";
      case "coach":
        return "TC";
      default:
        return "U";
    }
  };

  const getDashboardPath = () => {
    switch (role) {
      case "super_admin":
        return "/admin/";
      case "manager":
        return "/manager/";
      case "coach":
        return "/coach/";
      default:
        return "/";
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const isActive = (path: string) => {
    const dashboardPath = getDashboardPath();
    if (path === dashboardPath) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-20 right-4 z-50 rounded-lg bg-white shadow-md border-gray-200 hover:bg-gray-50"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </Button>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-gray-200 transition-all duration-300 z-40",
          isOpen ? "w-64" : "w-20",
        )}
      >
        <div className="flex flex-col w-full h-full">
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {isOpen && (
              <div className="px-2 py-2 mb-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {getSectionTitle()}
                </p>
              </div>
            )}

            {menu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const isHovered = hoveredItem === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg transition-all duration-200 group",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    isOpen ? "px-3 py-2.5" : "px-2.5 py-2.5 justify-center",
                  )}
                >
                  <div className="relative">
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        (active || isHovered) && "scale-105",
                      )}
                    />
                  </div>
                  {isOpen && (
                    <>
                      <span className="text-sm font-medium flex-1">
                        {item.label}
                      </span>
                      {active && (
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          {isOpen && (
            <div className="p-4 border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {getInitials()}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {role === "coach" ? "Coach User" : "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {getRoleTitle()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Collapse Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "absolute -right-3 top-1/2 rotate-180 transform -translate-y-1/2 bg-white border border-gray-200 shadow-sm rounded-full w-6 h-6 hover:bg-gray-50 z-50",
              !isOpen && "rotate-360",
            )}
          >
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleMobileSidebar}
          />
          <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50 lg:hidden transform transition-transform duration-300 shadow-xl">
            <div className="flex flex-col h-full pt-16">
              {/* Mobile Sidebar Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xl">⚽</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      FootballHub
                    </h2>
                    <p className="text-sm text-gray-500">{getRoleTitle()}</p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <div className="px-2 py-3 mb-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {getSectionTitle()}
                  </p>
                </div>

                {menu.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={toggleMobileSidebar}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        active
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                      {active && (
                        <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Footer */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {getInitials()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {role === "coach" ? "Coach User" : "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500">{getRoleTitle()}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
