import { ArrowRight, Calculator, MessageCircle, PhoneCall } from 'lucide-react'
import { Button } from '~/components/ui/button'

export const FinalCTA = () => {
  return (
    <div
      id='contact'
      className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16 scroll-mt-16'
    >
      <div className='container mx-auto px-4 text-center'>
        <h2 className='text-3xl font-light mb-4'>
          Pronto para transformar a gestão do seu patrimônio?
        </h2>
        <p className='text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto'>
          Entre em contato agora mesmo com nossos consultores especializados e descubra como uma
          holding patrimonial pode beneficiar você e sua família.
        </p>
        <div className='flex flex-col sm:flex-row justify-center gap-4'>
          <a href='#contact' className='contents'>
            <Button size='lg' variant='secondary' className='group flex items-center gap-2'>
              <PhoneCall size={18} />
              <span>Falar com um consultor</span>
              <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' />
            </Button>
          </a>
          <a href='#simulator' className='contents'>
            <Button
              variant='outline'
              size='lg'
              className='bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground flex items-center gap-2'
            >
              <Calculator size={18} />
              <span>Simular agora</span>
            </Button>
          </a>
        </div>

        <div className='mt-10 bg-primary-foreground/10 rounded-lg p-6 max-w-md mx-auto backdrop-blur-sm'>
          <div className='flex items-center justify-center gap-2 mb-4 text-primary-foreground'>
            <MessageCircle size={24} />
            <h3 className='text-xl font-medium'>Atendimento personalizado</h3>
          </div>
          <p className='mb-4 text-primary-foreground/90'>
            Deixe seus dados e um de nossos consultores entrará em contato em até 24 horas.
          </p>
          <form className='space-y-3'>
            <input
              type='text'
              placeholder='Seu nome'
              className='w-full p-2 rounded bg-primary-foreground/20 border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50'
            />
            <input
              type='tel'
              placeholder='Seu telefone'
              className='w-full p-2 rounded bg-primary-foreground/20 border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50'
            />
            <Button variant='secondary' className='w-full'>
              Solicitar contato
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
