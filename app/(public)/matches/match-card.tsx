"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

interface MatchCardProps {
  id?: string
  team1: string
  team2: string
  date: string
  time: string
  isLive?: boolean
}

export default function MatchCard({
  id = "1",
  team1,
  team2,
  date,
  time,
  isLive = false,
}: MatchCardProps) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/matches/${id}`)}
      className="bg-white border border-border rounded-lg p-6 flex items-center justify-between relative hover:shadow-md transition-shadow cursor-pointer"
    >
      {isLive && (
        <Link
          href={`/matches/${id}?tab=live`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg hover:bg-red-600 transition-colors"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          LIVE
        </Link>
      )}

      {/* Team 1 */}
      <div className="flex-1">
        <p className="text-gray-700 font-medium">{team1}</p>
      </div>

      {/* VS Badge */}
      <div className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg mx-4 text-sm">
        VS
      </div>

      {/* Team 2 */}
      <div className="flex-1 text-right">
        <p className="text-gray-700 font-medium">{team2}</p>
      </div>

      {/* Date & Time */}
      <div className="text-right ml-4 min-w-max">
        <p className="text-gray-600 text-sm">
          {date} • {time}
        </p>
      </div>
    </div>
  )
}
