
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About</h1>
        <p className="text-lg text-purple-50">Learn more about our football management platform</p>
      </div>
      <div className="py-12 px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Platform Overview</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            The ASTU Football Management System is a comprehensive platform designed to manage university football
            tournaments, teams, and matches. Our system provides real-time updates, detailed statistics, and seamless
            user experience for all football enthusiasts.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-4">Features</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-3">•</span>
              <span>Live match tracking and scoring</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">•</span>
              <span>Tournament management and scheduling</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">•</span>
              <span>Team and player statistics</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">•</span>
              <span>News and announcements</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">•</span>
              <span>Real-time notifications</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
