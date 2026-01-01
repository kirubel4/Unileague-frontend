"use client"

interface StatsTabProps {
  match: any
}

export function StatsTab({ match }: StatsTabProps) {
  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {["Overview", "Attack", "Defense", "Passing"].map((label) => (
          <button
            key={label}
            className="px-4 py-2 rounded-full text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 whitespace-nowrap"
          >
            {label}
          </button>
        ))}
      </div>

      <h3 className="text-lg font-bold text-foreground mb-6">Match Statistics</h3>
      <div className="space-y-6">
        {[
          {
            label: "Possession",
            t1: match.stats.team1.possession,
            t2: match.stats.team2.possession,
            unit: "%",
          },
          { label: "Shots", t1: match.stats.team1.shots, t2: match.stats.team2.shots, unit: "" },
          {
            label: "Shots on Target",
            t1: match.stats.team1.shotsOnTarget,
            t2: match.stats.team2.shotsOnTarget,
            unit: "",
          },
          { label: "Corners", t1: match.stats.team1.corners, t2: match.stats.team2.corners, unit: "" },
          { label: "Fouls", t1: match.stats.team1.fouls, t2: match.stats.team2.fouls, unit: "" },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{match.team1.name}</span>
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <span className="font-medium text-foreground">{match.team2.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold w-12 text-right">
                {stat.t1}
                {stat.unit}
              </span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden flex">
                <div className="bg-orange-500" style={{ width: `${stat.t1}%` }}></div>
                <div className="bg-blue-500" style={{ width: `${stat.t2}%` }}></div>
              </div>
              <span className="font-bold w-12">
                {stat.t2}
                {stat.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
