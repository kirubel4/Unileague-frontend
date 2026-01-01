"use client"

interface LiveTabProps {
  match: any
}

export function LiveTab({ match }: LiveTabProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Match Summary */}
        <div className="md:col-span-1 bg-white border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center justify-between">
            <span>Match Summary</span>
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">LIVE</span>
          </h3>
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-border">
              <p className="text-3xl font-bold text-orange-500">{match.team1.goals}</p>
              <p className="text-sm text-muted-foreground">Goals</p>
            </div>
            <div className="text-center pb-4 border-b border-border">
              <p className="text-3xl font-bold text-foreground">{match.minute}'</p>
              <p className="text-sm text-muted-foreground">Minute</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500">{match.team2.goals}</p>
              <p className="text-sm text-muted-foreground">Goals</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Quick Stats</h3>
          <div className="space-y-3">
            {[
              { label: "Possession", t1: match.stats.team1.possession, t2: match.stats.team2.possession, unit: "%" },
              { label: "Shots", t1: match.stats.team1.shots, t2: match.stats.team2.shots, unit: "" },
              {
                label: "Shots on Target",
                t1: match.stats.team1.shotsOnTarget,
                t2: match.stats.team2.shotsOnTarget,
                unit: "",
              },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xs text-muted-foreground font-medium mb-1">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold w-8">
                    {stat.t1}
                    {stat.unit}
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${stat.t1}%` }}></div>
                  </div>
                  <span className="text-sm font-bold w-8 text-right">
                    {stat.t2}
                    {stat.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Recent Events</h3>
          <div className="space-y-3">
            {match.events.slice(-3).map((event: any, idx: number) => (
              <div key={idx} className="text-sm pb-3 border-b border-border last:border-b-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🟡</span>
                  <span className="font-medium text-foreground">{event.player}</span>
                </div>
                <p className="text-xs text-muted-foreground">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards & Fouls */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">Cards & Fouls</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Yellow Cards</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold">{match.cardsAndFouls.team1.yellowCards}</span>
              <span className="text-muted-foreground">-</span>
              <span className="text-2xl font-bold">{match.cardsAndFouls.team2.yellowCards}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Red Cards</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold">{match.cardsAndFouls.team1.redCards}</span>
              <span className="text-muted-foreground">-</span>
              <span className="text-2xl font-bold">{match.cardsAndFouls.team2.redCards}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Fouls</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold">{match.cardsAndFouls.team1.fouls}</span>
              <span className="text-muted-foreground">-</span>
              <span className="text-2xl font-bold">{match.cardsAndFouls.team2.fouls}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
