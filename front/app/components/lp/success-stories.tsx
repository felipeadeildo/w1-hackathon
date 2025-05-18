import { Award, Building, DollarSign, Star, TrendingDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export const SuccessStories = () => {
  const stories = [
    {
      name: 'José Oliveira',
      description: 'Dono de uma pequena rede de padarias no interior de São Paulo',
      result: 'Economia de R$ 1,5 milhão em impostos através da estrutura de holdings',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      icon: <DollarSign className='text-primary' size={18} />,
    },
    {
      name: 'Ricardo Mendes',
      description: 'Proprietário de 10 imóveis alugados em São Paulo',
      result: 'Redução de 60% na carga tributária e proteção no processo sucessório',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      icon: <TrendingDown className='text-primary' size={18} />,
    },
    {
      name: 'Maria Fernandes',
      description: 'Empresária com participação em duas empresas de tecnologia',
      result: 'Economia anual de R$ 120 mil e simplificação da gestão patrimonial',
      image: 'https://randomuser.me/api/portraits/women/28.jpg',
      icon: <Building className='text-primary' size={18} />,
    },
  ]

  return (
    <div className='space-y-6'>
      <div className='text-center mb-10'>
        <h2 className='text-3xl font-light text-foreground mb-2'>Casos de Sucesso</h2>
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          Conheça alguns clientes que transformaram sua gestão patrimonial com a W1 Capital
        </p>
      </div>

      <div className='grid md:grid-cols-3 gap-6'>
        {stories.map((story, index) => (
          <Card key={index} className='shadow-md hover:shadow-lg transition-shadow group'>
            <CardHeader className='pb-2'>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <Avatar className='h-16 w-16 border-2 border-muted group-hover:border-primary transition-colors'>
                    <AvatarImage src={story.image} alt={story.name} className='object-cover' />
                    <AvatarFallback>
                      {story.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1'>
                    <Star size={12} />
                  </div>
                </div>
                <div>
                  <CardTitle className='text-xl font-medium'>{story.name}</CardTitle>
                  <CardDescription>{story.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='pt-4 border-t border-border'>
                <div className='flex items-start gap-2'>
                  <Award className='text-primary mt-1' size={18} />
                  <p className='text-foreground'>{story.result}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
