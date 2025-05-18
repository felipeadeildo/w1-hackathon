import { Award, HelpCircle, Home, PhoneCall, User } from 'lucide-react'
import { Button } from '~/components/ui/button'

export const Header = () => {
  return (
    <header id='header' className='py-4 border-b border-border sticky top-0 bg-background z-50'>
      <div className='container mx-auto px-4 flex justify-between items-center'>
        <div className='text-2xl font-medium text-primary flex items-center gap-2'>
          <div className='h-8 w-8 rounded-full bg-primary flex items-center justify-center'>
            <span className='text-primary-foreground text-sm font-bold'>W1</span>
          </div>
          W1 Capital
        </div>
        <nav className='hidden md:flex gap-6'>
          <a href='#hero' className='text-foreground hover:text-primary flex items-center gap-1'>
            <Home size={16} />
            <span>Início</span>
          </a>
          <a
            href='#benefits'
            className='text-foreground hover:text-primary flex items-center gap-1'
          >
            <Award size={16} />
            <span>Benefícios</span>
          </a>
          <a
            href='#how-it-works'
            className='text-foreground hover:text-primary flex items-center gap-1'
          >
            <HelpCircle size={16} />
            <span>Como Funciona</span>
          </a>
          <a href='#contact' className='text-foreground hover:text-primary flex items-center gap-1'>
            <PhoneCall size={16} />
            <span>Contato</span>
          </a>
        </nav>
        <Button variant='outline' className='flex items-center gap-1'>
          <User size={16} />
          <span>Área do Cliente</span>
        </Button>
      </div>
    </header>
  )
}
