import { ArrowRight, Calculator, ChevronRight, Coins, Lock, Mail, Shield } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export const Hero = () => {
  return (
    <div
      id='hero'
      className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16'
    >
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row items-center'>
          <div className='md:w-1/2 md:pr-12'>
            <h1 className='text-4xl md:text-5xl font-light mb-4'>
              Proteção e eficiência para seu patrimônio
            </h1>
            <p className='text-primary-foreground/90 text-lg mb-8'>
              Estruture uma holding patrimonial com a W1 Capital e descubra uma nova maneira de
              proteger seus bens e reduzir sua carga tributária.
            </p>

            <div className='space-y-4 mb-6'>
              <div className='flex items-center gap-2'>
                <div className='bg-primary-foreground/20 p-2 rounded-full'>
                  <Shield size={20} className='text-primary-foreground' />
                </div>
                <span>Proteção patrimonial eficiente</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='bg-primary-foreground/20 p-2 rounded-full'>
                  <Coins size={20} className='text-primary-foreground' />
                </div>
                <span>Redução significativa da carga tributária</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='bg-primary-foreground/20 p-2 rounded-full'>
                  <Calculator size={20} className='text-primary-foreground' />
                </div>
                <span>Simulação personalizada para seu patrimônio</span>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <Button size='lg' variant='secondary' className='group'>
                <span>Simular Economia</span>
                <ArrowRight
                  size={16}
                  className='ml-2 group-hover:translate-x-1 transition-transform'
                />
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
              >
                Saiba Mais
              </Button>
            </div>
          </div>
          <div className='md:w-1/2 mt-10 md:mt-0'>
            <div className='bg-card p-6 rounded-lg shadow-lg text-card-foreground'>
              <h3 className='text-xl font-medium mb-4'>Acesso à Plataforma</h3>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground block mb-1'>
                    Email
                  </label>
                  <div className='relative'>
                    <Mail size={16} className='absolute left-3 top-3 text-muted-foreground' />
                    <Input type='email' placeholder='seu@email.com' className='pl-10' />
                  </div>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground block mb-1'>
                    Senha
                  </label>
                  <div className='relative'>
                    <Lock size={16} className='absolute left-3 top-3 text-muted-foreground' />
                    <Input type='password' placeholder='Sua senha' className='pl-10' />
                  </div>
                </div>
                <Button variant='default' className='w-full'>
                  Entrar
                </Button>
                <div className='text-center'>
                  <a
                    href='#'
                    className='text-sm text-primary hover:text-primary/90 flex items-center justify-center gap-1'
                  >
                    Primeiro acesso
                    <ChevronRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
