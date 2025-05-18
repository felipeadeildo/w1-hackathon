import { LayoutDashboard, PiggyBank, ShieldCheck, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export const Benefits = () => {
  const benefits = [
    {
      title: 'Economia Tributária',
      description:
        'Reduza significativamente a carga tributária no recebimento de aluguéis e outros rendimentos patrimoniais.',
      icon: <PiggyBank className='h-8 w-8 text-primary' />,
    },
    {
      title: 'Proteção Patrimonial',
      description:
        'Proteja seus bens contra riscos diversos, garantindo a preservação de seu patrimônio para o futuro.',
      icon: <ShieldCheck className='h-8 w-8 text-primary' />,
    },
    {
      title: 'Sucessão Simplificada',
      description:
        'Facilite o processo sucessório, evitando os custos e a burocracia de um inventário tradicional.',
      icon: <Users className='h-8 w-8 text-primary' />,
    },
    {
      title: 'Gestão Centralizada',
      description:
        'Concentre a administração de seus bens em uma única estrutura, simplificando a gestão patrimonial.',
      icon: <LayoutDashboard className='h-8 w-8 text-primary' />,
    },
  ]

  return (
    <div id='benefits' className='py-16 scroll-mt-16'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-light text-foreground mb-2'>
            Por que criar uma Holding Patrimonial?
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Descubra as vantagens de estruturar seu patrimônio através de uma holding
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {benefits.map((benefit, index) => (
            <Card key={index} className='border shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader className='pb-2'>
                <div className='mb-4'>{benefit.icon}</div>
                <CardTitle className='text-xl font-medium text-primary'>{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
