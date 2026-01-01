import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { MatchDetailContent } from "./match-detail-content"

const matchesData: Record<string, any> = {
  "1": {
    id: "1",
    team1: { name: "Software FC", logo: "💻", goals: 2 },
    team2: { name: "CSE", logo: "🔵", goals: 1 },
    date: "Dec 10, 2024",
    time: "15:00",
    status: "LIVE",
    minute: 67,
    temperature: 67,
    venue: "Central Stadium",
    attendance: "2,500",
    referee: "John Smith",
    lineups: {
      team1: [
        { number: 1, name: "Ahmed Hassan", position: "GK" },
        { number: 2, name: "Mohamed Ali", position: "DF" },
        { number: 3, name: "Yousif Omar", position: "DF" },
        { number: 4, name: "Ibrahim Said", position: "DF" },
        { number: 5, name: "Khalil Nasser", position: "MF" },
        { number: 6, name: "Tariq Farid", position: "MF" },
        { number: 7, name: "Samir Adel", position: "MF" },
        { number: 8, name: "Kayyim Mamoud", position: "MF" },
        { number: 9, name: "Amjad Karim", position: "FW" },
        { number: 10, name: "Faisal Zaid", position: "FW" },
        { number: 11, name: "Walid Qassim", position: "FW" },
      ],
      team2: [
        { number: 1, name: "David Johnson", position: "GK" },
        { number: 2, name: "Mark Wilson", position: "DF" },
        { number: 3, name: "James Smith", position: "DF" },
        { number: 4, name: "Robert Brown", position: "DF" },
        { number: 5, name: "Michael Davis", position: "MF" },
        { number: 6, name: "Thomas Miller", position: "MF" },
        { number: 7, name: "Christopher Garcia", position: "MF" },
        { number: 8, name: "Daniel Rodriguez", position: "MF" },
        { number: 9, name: "Matthew Martinez", position: "FW" },
        { number: 10, name: "Anthony Anderson", position: "FW" },
        { number: 11, name: "Joshua Taylor", position: "FW" },
      ],
    },
    stats: {
      team1: { possession: 58, shots: 12, shotsOnTarget: 6, fouls: 8, corners: 7 },
      team2: { possession: 42, shots: 8, shotsOnTarget: 3, fouls: 12, corners: 4 },
    },
    events: [
      { minute: "12", team: "Software FC", player: "Thomas Miller", type: "discard", description: "Discard" },
      { minute: "34", team: "CSE", player: "James Smith", type: "yellow", description: "Second yellow card" },
      { minute: "45", team: "Software FC", player: "Joshua Taylor", type: "penalty", description: "Penalty kick" },
      { minute: "56", team: "CSE", player: "Khalil Nasser", type: "warning", description: "Late challenge" },
      {
        minute: "67",
        team: "Software FC",
        player: "Amjad Karim",
        type: "goal",
        description: "Curled ball from outside the box",
      },
      { minute: "72", team: "CSE", player: "Michael Davis", type: "red", description: "Tactical foul" },
      {
        minute: "82",
        team: "Software FC",
        player: "Faisal Zaid",
        type: "goal",
        description: "Header from close range",
      },
    ],
    cardsAndFouls: {
      team1: { yellowCards: 2, redCards: 0, fouls: 8 },
      team2: { yellowCards: 3, redCards: 0, fouls: 12 },
    },
  },
  "2": {
    id: "2",
    team1: { name: "Delta United", logo: "🔴", goals: 1 },
    team2: { name: "Tech Stars", logo: "⭐", goals: 2 },
    date: "Dec 10, 2024",
    time: "17:30",
    status: "LIVE",
    minute: 45,
    temperature: 65,
    venue: "Victory Park",
    attendance: "1,800",
    referee: "Sarah Johnson",
    lineups: {
      team1: [
        { number: 1, name: "Alex Turner", position: "GK" },
        { number: 2, name: "Brian Hayes", position: "DF" },
        { number: 3, name: "Chris Lee", position: "DF" },
        { number: 4, name: "David Park", position: "DF" },
        { number: 5, name: "Eric King", position: "MF" },
        { number: 6, name: "Frank White", position: "MF" },
        { number: 7, name: "George Miller", position: "MF" },
        { number: 8, name: "Henry Davis", position: "MF" },
        { number: 9, name: "Ian Clark", position: "FW" },
        { number: 10, name: "Jack Smith", position: "FW" },
        { number: 11, name: "Kevin Brown", position: "FW" },
      ],
      team2: [
        { number: 1, name: "Lucas Martinez", position: "GK" },
        { number: 2, name: "Mike Garcia", position: "DF" },
        { number: 3, name: "Nathan Rodriguez", position: "DF" },
        { number: 4, name: "Oscar Taylor", position: "DF" },
        { number: 5, name: "Peter Anderson", position: "MF" },
        { number: 6, name: "Quinn Thomas", position: "MF" },
        { number: 7, name: "Ryan Jackson", position: "MF" },
        { number: 8, name: "Sam White", position: "MF" },
        { number: 9, name: "Tom Harris", position: "FW" },
        { number: 10, name: "Ulysses Martin", position: "FW" },
        { number: 11, name: "Victor Lopez", position: "FW" },
      ],
    },
    stats: {
      team1: { possession: 45, shots: 10, shotsOnTarget: 4, fouls: 10, corners: 5 },
      team2: { possession: 55, shots: 14, shotsOnTarget: 7, fouls: 9, corners: 8 },
    },
    events: [
      { minute: "15", team: "Tech Stars", player: "Tom Harris", type: "goal", description: "Strike from distance" },
      { minute: "28", team: "Delta United", player: "Eric King", type: "yellow", description: "Rough tackle" },
      { minute: "42", team: "Tech Stars", player: "Quinn Thomas", type: "yellow", description: "Time wasting" },
      { minute: "45", team: "Delta United", player: "Ian Clark", type: "goal", description: "Tap in" },
    ],
    cardsAndFouls: {
      team1: { yellowCards: 1, redCards: 0, fouls: 10 },
      team2: { yellowCards: 1, redCards: 0, fouls: 9 },
    },
  },
}

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log("[v0] Match ID received:", id)
  const match = matchesData[id]
  console.log("[v0] Match data found:", match ? "yes" : "no")

  if (!match) {
    return (
      <div className="min-h-screen bg-background">
        <div className="py-12 px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground">Match not found</h2>
          <p className="text-sm text-muted-foreground mt-2">ID: {id}</p>
          <Link href="/matches" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Matches
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="bg-linear-to-r from-orange-400 to-orange-600 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/matches" className="flex items-center gap-2 text-white hover:opacity-90 mb-6 w-fit">
            <ArrowLeft className="w-4 h-4" />
            Back to Matches
          </Link>

          {/* Match Score */}
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">
              {match.team1.name} VS {match.team2.name}
            </h1>
            <div className="text-5xl font-bold mb-3">
              {match.team1.goals}:{match.team2.goals}
            </div>
            <p className="text-orange-50">
              <span className="inline-block bg-orange-500 px-3 py-1 rounded-full text-sm font-bold mr-2">
                {match.status}
              </span>
              {match.temperature}° • {match.date} • {match.time}
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <MatchDetailContent match={match} id={id} />
      </Suspense>
    </div>
  )
}
