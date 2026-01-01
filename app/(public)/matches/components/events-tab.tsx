"use client"

interface EventsTabProps {
  match: any
}

export function EventsTab({ match }: EventsTabProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽"
      case "yellow":
        return "🟨"
      case "red":
        return "🟥"
      case "discard":
        return "🔄"
      case "penalty":
        return "🅿️"
      case "warning":
        return "⚠️"
      default:
        return "👤"
    }
  }

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <h3 className="text-lg font-bold text-foreground mb-6">Match Events</h3>
      <div className="space-y-3">
        {match.events.map((event: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 hover:bg-gray-50 rounded"
          >
            <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">
              {event.minute}'
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground">{event.player}</p>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
            <div className="text-2xl shrink-0">{getEventIcon(event.type)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
