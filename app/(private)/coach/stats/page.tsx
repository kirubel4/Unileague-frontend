"use client";

import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

/* =========================
   MOCK DATA
========================= */

const team = {
  teamName: "Arsenal",
  matchesPlayed: 3,
  wins: 0,
  draws: 0,
  losses: 3,
  goalsFor: 2,
  goalsAgainst: 6,
  goalDifference: -4,
  yellowCards: 0,
  redCards: 0,
};

/* =========================
   PAGE
========================= */

export default function TeamStatusPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* ================= HEADER ================= */}
        <section className="rounded-xl bg-white border px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Team Status</p>
              <h1 className="text-2xl font-semibold text-gray-900">
                {team.teamName}
              </h1>
            </div>

            <div className="flex gap-6">
              <HeaderMetric label="Matches" value={team.matchesPlayed} />
              <HeaderMetric label="Wins" value={team.wins} />
              <HeaderMetric label="Draws" value={team.draws} />
              <HeaderMetric label="Losses" value={team.losses} />
            </div>
          </div>
        </section>

        {/* ================= PERFORMANCE ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile
            label="Goals For"
            value={team.goalsFor}
            icon={<TrendingUp className="h-4 w-4" />}
          />

          <StatTile
            label="Goals Against"
            value={team.goalsAgainst}
            icon={<TrendingDown className="h-4 w-4" />}
          />

          <StatTile
            label="Goal Difference"
            value={team.goalDifference}
            icon={<Minus className="h-4 w-4" />}
            highlight={team.goalDifference < 0}
          />

          <StatTile
            label="Discipline"
            value={`${team.yellowCards}Y / ${team.redCards}R`}
            icon={<AlertTriangle className="h-4 w-4" />}
          />
        </section>

        {/* ================= DISCIPLINE ================= */}
        <section className="rounded-xl bg-white border px-6 py-4">
          <h2 className="mb-3 text-sm font-medium text-gray-700">
            Discipline Overview
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <DisciplineItem
              label="Yellow Cards"
              value={team.yellowCards}
              tone="yellow"
            />
            <DisciplineItem
              label="Red Cards"
              value={team.redCards}
              tone="red"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */
// components/ui/metrics.tsx
import { cn } from "@/lib/utils";

interface HeaderMetricProps {
  label: string;
  value: number;
  trend?: "up" | "down" | "neutral";
  description?: string;
  size?: "sm" | "md" | "lg";
}

export function HeaderMetric({
  label,
  value,
  trend,
  description,
  size = "md",
}: HeaderMetricProps) {
  return (
    <div className="group relative p-6 rounded-xl bg-linear-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
      {/* Trend indicator */}
      {trend && (
        <div
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center",
            trend === "up"
              ? "bg-green-100 text-green-600"
              : trend === "down"
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600"
          )}
        >
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
        </div>
      )}

      <div className="text-center space-y-2">
        <p
          className={cn(
            "font-bold bg-linear-to-r bg-clip-text text-transparent",
            size === "lg"
              ? "text-4xl"
              : size === "md"
              ? "text-3xl"
              : "text-2xl",
            "from-gray-800 to-gray-600"
          )}
        >
          {value}
        </p>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700 uppercase tracking-wider">
            {label}
          </p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatTileProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  highlight?: boolean;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  description?: string;
}

export function StatTile({
  label,
  value,
  icon,
  highlight = false,
  variant = "default",
  description,
}: StatTileProps) {
  const variantStyles = {
    default: "from-white to-gray-50 border-gray-200",
    success: "from-green-50 to-green-100/50 border-green-200",
    warning: "from-yellow-50 to-yellow-100/50 border-yellow-200",
    danger: "from-red-50 to-red-100/50 border-red-200",
    info: "from-blue-50 to-blue-100/50 border-blue-200",
  };

  const valueColors = {
    default: "text-gray-900",
    success: "text-green-700",
    warning: "text-yellow-700",
    danger: "text-red-700",
    info: "text-blue-700",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-linear-to-br p-5",
        variantStyles[variant],
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      )}
    >
      {/* Decorative corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 -translate-y-8 translate-x-8 rotate-45 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{
          background:
            variant === "success"
              ? "linear-gradient(45deg, #10b981, transparent)"
              : variant === "warning"
              ? "linear-gradient(45deg, #f59e0b, transparent)"
              : variant === "danger"
              ? "linear-gradient(45deg, #ef4444, transparent)"
              : variant === "info"
              ? "linear-gradient(45deg, #3b82f6, transparent)"
              : "linear-gradient(45deg, #6b7280, transparent)",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">{label}</p>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>

          <div
            className={cn(
              "p-2.5 rounded-lg",
              variant === "success"
                ? "bg-green-100 text-green-600"
                : variant === "warning"
                ? "bg-yellow-100 text-yellow-600"
                : variant === "danger"
                ? "bg-red-100 text-red-600"
                : variant === "info"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600"
            )}
          >
            {icon}
          </div>
        </div>

        {/* Value */}
        <div className="space-y-1">
          <p
            className={cn(
              "text-2xl font-bold",
              valueColors[variant],
              highlight && "animate-pulse"
            )}
          >
            {value}
          </p>

          {/* Progress indicator for numeric values */}
          {typeof value === "number" && variant === "danger" && (
            <div className="h-1 bg-red-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(value * 10, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DisciplineItemProps {
  label: string;
  value: number;
  tone: "yellow" | "red";
  severity?: "low" | "medium" | "high";
  max?: number;
}

export function DisciplineItem({
  label,
  value,
  tone,
  severity = "low",
  max = 10,
}: DisciplineItemProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const toneStyles = {
    yellow: {
      bg: "from-yellow-50 to-amber-50/50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      progress: "bg-gradient-to-r from-yellow-400 to-amber-500",
      iconBg: "bg-yellow-100 text-yellow-600",
    },
    red: {
      bg: "from-red-50 to-red-50/50",
      border: "border-red-200",
      text: "text-red-800",
      progress: "bg-gradient-to-r from-red-400 to-red-600",
      iconBg: "bg-red-100 text-red-600",
    },
  };

  const severityIcons = {
    low: "🟢",
    medium: "🟡",
    high: "🔴",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-linear-to-br p-5 transition-all duration-300 hover:shadow-md",
        toneStyles[tone].bg,
        toneStyles[tone].border
      )}
    >
      {/* Animated progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-out",
            toneStyles[tone].progress
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Label and severity */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                toneStyles[tone].iconBg
              )}
            >
              {tone === "yellow" ? "🟨" : "🟥"}
            </div>
            <p className="text-sm font-medium text-gray-700">{label}</p>
          </div>

          <div className="text-sm font-medium text-gray-600">
            {severityIcons[severity]}
          </div>
        </div>

        {/* Value and indicator */}
        <div className="flex items-end justify-between">
          <div>
            <p className={cn("text-3xl font-bold", toneStyles[tone].text)}>
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {value === 0
                ? "Perfect discipline"
                : `${value} card${value !== 1 ? "s" : ""} this season`}
            </p>
          </div>

          {/* Visual indicator */}
          <div className="flex flex-col items-end">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-1",
                value === 0
                  ? "bg-green-100 text-green-600"
                  : toneStyles[tone].iconBg
              )}
            >
              <span className="text-lg font-bold">{value}</span>
            </div>
            {value > 0 && (
              <div className="text-xs font-medium text-gray-500">
                {value <= 2 ? "Low" : value <= 5 ? "Medium" : "High"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Usage example:
export function MetricsExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <HeaderMetric
        label="Total Wins"
        value={12}
        trend="up"
        description="This season"
      />

      <StatTile
        label="Goals Scored"
        value={42}
        icon={<span>⚽</span>}
        variant="success"
        description="Avg: 2.1 per game"
      />

      <StatTile
        label="Goals Conceded"
        value={18}
        icon={<span>🛡️</span>}
        variant="warning"
        description="Avg: 0.9 per game"
      />

      <DisciplineItem
        label="Yellow Cards"
        value={3}
        tone="yellow"
        severity="low"
      />
    </div>
  );
}
