import { useEffect } from 'react'
import { Benefits } from '~/components/lp/benefits'
import { EconomySimulator } from '~/components/lp/economy-simulator'
import { FinalCTA } from '~/components/lp/final-cta'
import { Footer } from '~/components/lp/footer'
import { Header } from '~/components/lp/header'
import { Hero } from '~/components/lp/hero'
import { HowItWorks } from '~/components/lp/how-it-works'
import { SimulatorSection } from '~/components/lp/simulator-section'
import { SuccessStories } from '~/components/lp/success-stories'
import { SuccessStoriesSection } from '~/components/lp/success-stories-section'
import type { Route } from './+types/lp'

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'W1 Capital - Revolucionando Soluções Financeiras' },
    {
      name: 'description',
      content:
        'Descubra como o W1 Capital está transformando o cenário financeiro com soluções inovadoras. Simule seu crescimento financeiro e aprenda como nossa plataforma funciona para você.',
    },
    {
      name: 'keywords',
      content: 'finanças, capital, W1, soluções financeiras, simulador econômico',
    },
    { property: 'og:title', content: 'W1 Capital - Revolucionando Soluções Financeiras' },
    {
      property: 'og:description',
      content: 'Transforme seu futuro financeiro com as soluções do W1 Capital',
    },
    { name: 'twitter:card', content: 'summary_large_image' },
  ]
}

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
