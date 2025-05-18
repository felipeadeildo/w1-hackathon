import { ArrowUp, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import { Button } from '~/components/ui/button'

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id='footer' className='py-12 bg-secondary text-secondary-foreground'>
      <div className='container mx-auto px-4'>
        <div className='grid md:grid-cols-4 gap-8'>
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <div className='h-8 w-8 rounded-full bg-primary flex items-center justify-center'>
                <span className='text-primary-foreground text-sm font-bold'>W1</span>
              </div>
              <h3 className='text-lg font-medium'>W1 Capital</h3>
            </div>
            <p className='mb-6 text-secondary-foreground/80'>
              Soluções em consultoria patrimonial para proteger e otimizar seu patrimônio.
            </p>
            <div className='flex gap-3'>
              <a
                href='#'
                className='text-secondary-foreground/80 hover:text-primary transition-colors p-2 bg-secondary-foreground/10 rounded-full'
              >
                <Facebook size={18} />
              </a>
              <a
                href='#'
                className='text-secondary-foreground/80 hover:text-primary transition-colors p-2 bg-secondary-foreground/10 rounded-full'
              >
                <Linkedin size={18} />
              </a>
              <a
                href='#'
                className='text-secondary-foreground/80 hover:text-primary transition-colors p-2 bg-secondary-foreground/10 rounded-full'
              >
                <Instagram size={18} />
              </a>
              <a
                href='#'
                className='text-secondary-foreground/80 hover:text-primary transition-colors p-2 bg-secondary-foreground/10 rounded-full'
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className='text-sm font-medium mb-4'>Links Rápidos</h4>
            <ul className='space-y-2 text-secondary-foreground/80'>
              <li>
                <a
                  href='#hero'
                  className='hover:text-primary transition-colors flex items-center gap-1'
                >
                  <span className='w-2 h-2 bg-primary/60 rounded-full'></span>
                  <span>Início</span>
                </a>
              </li>
              <li>
                <a
                  href='#benefits'
                  className='hover:text-primary transition-colors flex items-center gap-1'
                >
                  <span className='w-2 h-2 bg-primary/60 rounded-full'></span>
                  <span>Benefícios</span>
                </a>
              </li>
              <li>
                <a
                  href='#simulator'
                  className='hover:text-primary transition-colors flex items-center gap-1'
                >
                  <span className='w-2 h-2 bg-primary/60 rounded-full'></span>
                  <span>Simulador</span>
                </a>
              </li>
              <li>
                <a
                  href='#how-it-works'
                  className='hover:text-primary transition-colors flex items-center gap-1'
                >
                  <span className='w-2 h-2 bg-primary/60 rounded-full'></span>
                  <span>Como Funciona</span>
                </a>
              </li>
              <li>
                <a
                  href='#contact'
                  className='hover:text-primary transition-colors flex items-center gap-1'
                >
                  <span className='w-2 h-2 bg-primary/60 rounded-full'></span>
                  <span>Contato</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='text-sm font-medium mb-4'>Serviços</h4>
            <ul className='space-y-2 text-secondary-foreground/80'>
              <li>
                <a
                  href='#'
                  className='hover:text-primary transition-colors flex items-center gap-1'
                >
                  <span className='w-2 h-2 bg-primary/60 rounded-full'></span>
                  <span>Holding Patrimonial</span>
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='hover:text-primary transition-colors flex items-center gap-1'
                >
                  <span className='w-2 h-2 bg-primary/60 rounded-full'></span>
                  <span>Planejamento Sucessório</span>
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='hover:text-primary transition-colors flex items-center gap-1'
                >
                  <span className='w-2 h-2 bg-primary/60 rounded-full'></span>
                  <span>Consultoria Tributária</span>
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='hover:text-primary transition-colors flex items-center gap-1'
                >
                  <span className='w-2 h-2 bg-primary/60 rounded-full'></span>
                  <span>Gestão de Ativos</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='text-sm font-medium mb-4'>Contato</h4>
            <ul className='space-y-3 text-secondary-foreground/80'>
              <li className='flex items-center gap-2'>
                <Mail className='text-primary' size={16} />
                <span>contato@w1capital.com.br</span>
              </li>
              <li className='flex items-center gap-2'>
                <Phone className='text-primary' size={16} />
                <span>(11) 3000-0000</span>
              </li>
              <li className='flex items-start gap-2'>
                <MapPin className='text-primary mt-1' size={16} />
                <span>Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100</span>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-secondary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-secondary-foreground/70 text-sm mb-4 md:mb-0'>
            © 2025 W1 Capital. Todos os direitos reservados.
          </p>
          <Button
            variant='outline'
            size='sm'
            className='rounded-full border-secondary-foreground/20 text-secondary-foreground/70 hover:text-primary'
            onClick={scrollToTop}
          >
            <ArrowUp size={16} className='mr-1' />
            <span>Voltar ao topo</span>
          </Button>
        </div>
      </div>
    </footer>
  )
}
