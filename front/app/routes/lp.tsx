import { AlertTriangle } from 'lucide-react'
import { Button } from '~/components/ui/button'

export default function LandingPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-svh'>
      <div className='flex items-center gap-2 mb-4 p-2 bg-yellow-100 rounded text-yellow-800'>
        <AlertTriangle size={18} />
        <span>In Development</span>
      </div>
      <Button>Click me</Button>
    </div>
  )
}
