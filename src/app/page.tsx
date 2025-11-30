import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturedEvents } from '@/components/landing/FeaturedEvents'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { CTASection } from '@/components/landing/CTASection'

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedEvents />
      <HowItWorks />
      <CTASection />
    </div>
  )
}
