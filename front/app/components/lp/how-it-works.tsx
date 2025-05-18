import {
  ArrowRight,
  BarChart4,
  Briefcase,
  Check,
  FileText,
  Shield,
  TrendingUp,
  Upload,
} from 'lucide-react'

export const HowItWorks = () => {
  const steps = [
    {
      title: 'Simulação inicial',
      description:
        'Simule em poucos minutos o quanto você pode economizar com uma holding patrimonial, baseado nos seus bens e rendimentos.',
      icon: <TrendingUp className='text-primary' size={24} />,
    },
    {
      title: 'Consultoria personalizada',
      description:
        'Nossos especialistas analisam seu caso específico e desenvolvem uma estratégia de holding sob medida para suas necessidades.',
      icon: <Shield className='text-primary' size={24} />,
    },
    {
      title: 'Processo simplificado',
      description:
        'Orientamos você em todo o processo de coleta de documentos, constituição da holding e integralização dos bens.',
      icon: <Upload className='text-primary' size={24} />,
    },
    {
      title: 'Acompanhamento contínuo',
      description:
        'Após a constituição da holding, garantimos o acompanhamento e gestão da sua estrutura patrimonial.',
      icon: <Check className='text-primary' size={24} />,
    },
  ]

  return (
    <div id='how-it-works' className='py-16 bg-muted scroll-mt-16'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <div className='flex justify-center gap-4 mb-4'>
            <BarChart4 className='h-8 w-8 text-primary' />
            <FileText className='h-8 w-8 text-primary' />
            <Briefcase className='h-8 w-8 text-primary' />
          </div>
          <h2 className='text-3xl font-light text-foreground mb-2'>Como Funciona</h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Um processo pensado para facilitar sua vida e maximizar os benefícios do seu patrimônio
          </p>
        </div>

        <div className='grid md:grid-cols-4 gap-8'>
          {steps.map((step, index) => (
            <div key={index} className='text-center group relative'>
              <div className='bg-card w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow'>
                {step.icon}
              </div>

              {index < steps.length - 1 && (
                <div className='absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-border hidden md:block'>
                  <ArrowRight className='text-primary absolute -right-2 -top-2' size={16} />
                </div>
              )}

              <h3 className='text-xl font-medium text-foreground mb-2'>{step.title}</h3>
              <p className='text-muted-foreground'>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
