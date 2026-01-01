"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { LiveTab } from "../components/live-tab"
import { StatsTab } from "../components/stats-tab"
import { LineupsTab } from "../components/lineups-tab"
import { EventsTab } from "../components/events-tab"

interface MatchDetailContentProps {
  match: any
  id: string
}

export function MatchDetailContent({ match, id }: MatchDetailContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "live"

  const handleTabChange = (tabId: string) => {
    router.push(`/matches/${id}?tab=${tabId}`)
  }

  return (
    <>
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex gap-4 justify-center">
            {[
              { id: "live", label: "Live" },
              { id: "stats", label: "Stats" },
              { id: "lineups", label: "Lineups" },
              { id: "events", label: "Events" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                  activeTab === tab.id ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-6">
        {activeTab === "live" && <LiveTab match={match} />}
        {activeTab === "stats" && <StatsTab match={match} />}
        {activeTab === "lineups" && <LineupsTab match={match} />}
        {activeTab === "events" && <EventsTab match={match} />}
      </div>
    </>
  )
}
