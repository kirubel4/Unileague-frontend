"use client"
import { useState } from "react"

interface NewsItem {
  id: number
  title: string
  description: string
  fullContent: string
  category: "BREAKING" | "TRANSFER" | "UPDATE"
  timestamp: string
  image?: string
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Championship Final Set for December 15th",
    description: "The most anticipated match of the season approaches.",
    fullContent:
      "The most anticipated match of the season is finally confirmed for December 15th. Software FC will face CSE in the championship final at the new state-of-the-art stadium. This match promises to be thrilling as both teams have shown exceptional performance throughout the tournament. Tickets are now available for purchase, with early bird discounts for season pass holders. The match will be broadcast live on all major sports networks. Security measures have been implemented to ensure a safe and enjoyable experience for all attendees.",
    category: "BREAKING",
    timestamp: "2 days ago",
    image: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    id: 2,
    title: "Star Player Joins Software FC",
    description: "Major signing strengthens the squad.",
    fullContent:
      "In a surprise transfer move, one of the league's most promising players has signed with Software FC. The deal, worth a record amount for the club, is expected to significantly strengthen the team's offensive capabilities. The player brings extensive international experience and has previously played for several top-tier clubs. The coaching staff has praised the signing as a strategic move that will elevate the team's competitive level. The player will wear the iconic number 10 jersey and is expected to make his debut in the upcoming match against CSE.",
    category: "TRANSFER",
    timestamp: "5 hours ago",
    image: "bg-gradient-to-br from-yellow-500 to-orange-600",
  },
  {
    id: 3,
    title: "New Stadium Opening Next Month",
    description: "State-of-the-art facility ready for tournaments.",
    fullContent:
      "The highly anticipated new stadium is nearing completion and will officially open next month with a spectacular opening ceremony. The facility features a capacity of 50,000 spectators, world-class training facilities, and modern amenities for both players and fans. The stadium incorporates sustainable design principles with solar panels and rainwater harvesting systems. Multiple restaurants, premium lounges, and interactive fan zones will enhance the overall experience. The opening match will feature the championship final, making it a historic moment for the club and the entire football community.",
    category: "UPDATE",
    timestamp: "1 day ago",
  },
]

const categoryColors = {
  BREAKING: "bg-red-500",
  TRANSFER: "bg-yellow-500",
  UPDATE: "bg-blue-500",
}

export default function NewsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background">
       <div className="bg-linear-to-r from-pink-500 to-pink-600 py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">News</h1>
        <p className="text-lg text-pink-50">Stay updated with the latest football news and announcements</p>
      </div>
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {expandedId === item.id ? (
                  // Expanded view
                  <div className="bg-white">
                    <div className={`${item.image || "bg-gray-300"} h-40 relative`}>
                      <span
                        className={`absolute top-3 left-3 ${categoryColors[item.category]} text-white text-xs font-bold px-2 py-1 rounded`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.fullContent}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                        <button
                          onClick={() => setExpandedId(null)}
                          className="text-blue-500 text-sm font-semibold hover:underline"
                        >
                          Show Less ↑
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Collapsed view
                  <div>
                    <div className={`${item.image || "bg-gray-300"} h-40 relative`}>
                      <span
                        className={`absolute top-3 left-3 ${categoryColors[item.category]} text-white text-xs font-bold px-2 py-1 rounded`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                        <button
                          onClick={() => setExpandedId(item.id)}
                          className="text-blue-500 text-sm font-semibold hover:underline"
                        >
                          Read More →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
