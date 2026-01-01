"use client"

interface LineupsTabProps {
  match: any
}

export function LineupsTab({ match }: LineupsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Team 1 */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">{match.team1.name}</h3>
        <div className="space-y-2">
          {match.lineups.team1.map((player: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded">
              <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {player.number}
              </div>
              <div>
                <p className="font-medium text-foreground">{player.name}</p>
                <p className="text-xs text-muted-foreground">{player.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team 2 */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">{match.team2.name}</h3>
        <div className="space-y-2">
          {match.lineups.team2.map((player: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {player.number}
              </div>
              <div>
                <p className="font-medium text-foreground">{player.name}</p>
                <p className="text-xs text-muted-foreground">{player.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
