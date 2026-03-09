import { PublicNav } from '@/components/layout/public-nav'
import { HeroSection } from '@/components/ui/hero-section'
import { FeatureCards } from '@/components/ui/feature-cards'
import { CoreFeatures } from '@/components/ui/core-features'
import { PublicFooter } from '@/components/layout/public-footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <PublicNav />
      <main>
        <HeroSection />
        <FeatureCards />
        <CoreFeatures />
      </main>
      <PublicFooter />
    </div>
  )
}
