"use client"

import { useState } from "react"
import Tabs from "./tabs"
import MatchCard from "@/app/(public)/matches/match-card"

export default function MatchesContent() {
  const [activeTab, setActiveTab] = useState("live")

  const liveMatches = [
    { id: "1", team1: "Software FC", team2: "CSE", date: "Dec 10, 2024", time: "15:00", isLive: true },
    { id: "2", team1: "Delta United", team2: "Tech Stars", date: "Dec 10, 2024", time: "17:30", isLive: true },
  ]

  const upcomingMatches = [
    { id: "3", team1: "Premium FC", team2: "Elite Eleven", date: "Dec 11, 2024", time: "14:00", isLive: false },
    { id: "4", team1: "Champions", team2: "Rising Stars", date: "Dec 11, 2024", time: "18:00", isLive: false },
  ]

  const finishedMatches = [
    { id: "5", team1: "Winners FC", team2: "Runners United", date: "Dec 09, 2024", time: "16:00", isLive: false },
    { id: "6", team1: "Master Team", team2: "Challenge FC", date: "Dec 09, 2024", time: "19:00", isLive: false },
  ]

  const getMatches = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingMatches
      case "finished":
        return finishedMatches
      default:
        return liveMatches
    }
  }

  return (
    <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="mb-8">
          <Tabs onTabChange={setActiveTab} />
        </div>

        {/* Match Cards */}
        <div className="space-y-4">
          {getMatches().map((match) => (
            <MatchCard
              key={match.id}
              id={match.id}
              team1={match.team1}
              team2={match.team2}
              date={match.date}
              time={match.time}
              isLive={match.isLive}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
