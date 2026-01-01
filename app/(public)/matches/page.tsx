import HeroSection from "@/app/(public)/matches/components/hero-section"
import MatchesContent from "@/app/(public)/matches/components/matches-content"


export default function MatchesPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <MatchesContent />
    </div>
  )
}
