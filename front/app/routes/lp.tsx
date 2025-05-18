import { useEffect } from 'react'
import { Benefits } from '~/components/lp/benefits'
import { EconomySimulator } from '~/components/lp/economy-simulator'
import { FinalCTA } from '~/components/lp/final-cta'
import { Footer } from '~/components/lp/footer'
import { Header } from '~/components/lp/header'
import { Hero } from '~/components/lp/hero'
import { HowItWorks } from '~/components/lp/how-it-works'
import SimulatorSection from '~/components/lp/simulator-section'
import { SuccessStories } from '~/components/lp/success-stories'
import { SuccessStoriesSection } from '~/components/lp/success-stories-section'

export default function LandingPage() {
  useEffect(() => {
    const handleHashChange = () => {
      const { hash } = window.location
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
        e.preventDefault()
        const href = this.getAttribute('href')
        if (href && href !== '#') {
          window.history.pushState({}, '', href)
          const element = document.querySelector(href)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }
      })
    })

    // Lidar com mudanças na hash da URL
    window.addEventListener('hashchange', handleHashChange)

    // Checar a hash na carga inicial
    if (window.location.hash) {
      setTimeout(handleHashChange, 100)
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Header />

      <Hero />

      <Benefits />

      <SimulatorSection>
        <EconomySimulator />
      </SimulatorSection>

      <HowItWorks />

      <SuccessStoriesSection>
        <SuccessStories />
      </SuccessStoriesSection>

      <FinalCTA />

      <Footer />
    </div>
  )
}
