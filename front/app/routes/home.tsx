import { Button } from '~/components/ui/button'

import { AlertTriangle } from 'lucide-react'
import type { Route } from './+types/home'

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'W1 Hackathon' },
    { name: 'description', content: 'W1 Hackathon' },
  ]
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <div className="flex items-center gap-2 mb-4 p-2 bg-yellow-100 rounded text-yellow-800">
        <AlertTriangle size={18} />
        <span>In Development</span>
      </div>
      <Button>Click me</Button>
    </div>
  )
}
