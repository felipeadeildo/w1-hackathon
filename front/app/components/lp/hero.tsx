import { ArrowRight, Calculator, Coins, Shield, User } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'

export const Hero = () => {
  const navigate = useNavigate()
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
              <a href='#simulator' className='contents'>
                <Button size='lg' variant='secondary' className='group'>
                  <span>Simular Economia</span>
                  <ArrowRight
                    size={16}
                    className='ml-2 group-hover:translate-x-1 transition-transform'
                  />
                </Button>
              </a>
              <a href='#benefits' className='contents'>
                <Button
                  size='lg'
                  variant='outline'
                  className='bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
                >
                  Saiba Mais
                </Button>
              </a>
            </div>
          </div>
          <div className='md:w-1/2 mt-10 md:mt-0 flex items-center justify-center'>
            <div className='bg-card p-12 rounded-lg shadow-lg text-card-foreground'>
              <div className='flex flex-col items-center space-y-6'>
                <div className='p-4 bg-primary/10 rounded-full'>
                  <User size={48} className='text-primary' />
                </div>
                <div className='text-center'>
                  <h3 className='text-xl font-medium'>Área do Cliente</h3>
                  <p className='text-muted-foreground mt-2'>
                    Acesse sua conta para gerenciar seu patrimônio
                  </p>
                </div>
                <Button size='lg' onClick={() => navigate('/app')} className='w-full'>
                  Acessar Plataforma
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
