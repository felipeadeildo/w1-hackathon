import {
  ArrowRight,
  BarChart,
  Clock,
  DollarSign,
  Home,
  Landmark,
  Percent,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export const EconomySimulator = () => {
  const [patrimonyValue, setPatrimonyValue] = useState(1000000)
  const [rentalIncome, setRentalIncome] = useState(10000)
  const [heirs, setHeirs] = useState(2)

  // TODO: definir variáveis reais para o cálculo

  // Cálculos simplificados para demonstração
  const traditionalTaxCost = patrimonyValue * 0.15 // 15% em custos de inventário
  const holdingTaxCost = patrimonyValue * 0.04 // 4% com holding
  const savingsAmount = traditionalTaxCost - holdingTaxCost

  const monthlyTaxTraditional = rentalIncome * 0.275 // 27.5% IR pessoa física
  const monthlyTaxHolding = rentalIncome * 0.15 // 15% aprox. para PJ
  const monthlySavings = monthlyTaxTraditional - monthlyTaxHolding
  const yearlySavings = monthlySavings * 12

  const data = [
    { year: 1, savings: yearlySavings },
    { year: 5, savings: yearlySavings * 5 },
    { year: 10, savings: yearlySavings * 10 },
    { year: 20, savings: yearlySavings * 20 },
  ]

  return (
    <Card className='w-full shadow-lg py-0'>
      <CardHeader className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg py-2 shadow-lg'>
        <CardTitle className='text-2xl font-light'>Simulador de Economia</CardTitle>
        <CardDescription className='text-primary-foreground/80'>
          Descubra quanto você pode economizar com uma holding patrimonial
        </CardDescription>
      </CardHeader>
      <CardContent className='p-6 space-y-6'>
        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2'>
              <Home size={16} />
              <span>Valor total do patrimônio</span>
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-3 text-muted-foreground'>R$</span>
              <Input
                type='number'
                value={patrimonyValue}
                onChange={(e) => setPatrimonyValue(Number(e.target.value))}
                className='pl-10'
              />
            </div>
          </div>

          <div>
            <label className='text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2'>
              <Landmark size={16} />
              <span>Renda mensal com aluguéis</span>
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-3 text-muted-foreground'>R$</span>
              <Input
                type='number'
                value={rentalIncome}
                onChange={(e) => setRentalIncome(Number(e.target.value))}
                className='pl-10'
              />
            </div>
          </div>

          <div>
            <label className='text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2'>
              <Users size={16} />
              <span>Número de herdeiros</span>
            </label>
            <Input type='number' value={heirs} onChange={(e) => setHeirs(Number(e.target.value))} />
          </div>
        </div>

        <Tabs defaultValue='succession' className='mt-6'>
          <div className='flex justify-center w-full'>
            <TabsList className='grid grid-cols-2 mb-4 w-fit'>
              <TabsTrigger value='succession' className='flex items-center gap-1'>
                <Users size={14} />
                <span>Sucessão Patrimonial</span>
              </TabsTrigger>
              <TabsTrigger value='monthly' className='flex items-center gap-1'>
                <Percent size={14} />
                <span>Economia Mensal</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='succession' className='space-y-4'>
            <div className='bg-muted p-4 rounded-lg'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <DollarSign size={14} />
                  <span>Custo de inventário tradicional:</span>
                </span>
                <span className='text-foreground font-medium'>
                  R$ {traditionalTaxCost.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <DollarSign size={14} />
                  <span>Custo com holding patrimonial:</span>
                </span>
                <span className='text-foreground font-medium'>
                  R$ {holdingTaxCost.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className='flex justify-between items-center pt-2 border-t border-border'>
                <span className='text-foreground font-medium flex items-center gap-1'>
                  <BarChart size={14} />
                  <span>Sua economia:</span>
                </span>
                <span className='text-accent-foreground font-bold text-xl'>
                  R$ {savingsAmount.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            <div className='flex gap-2 items-center text-primary'>
              <Clock size={16} />
              <span className='text-sm'>
                Proteja o patrimônio da sua família e evite processos demorados de inventário
              </span>
            </div>
          </TabsContent>

          <TabsContent value='monthly' className='space-y-4'>
            <div className='bg-muted p-4 rounded-lg'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <DollarSign size={14} />
                  <span>Imposto mensal atual:</span>
                </span>
                <span className='text-foreground font-medium'>
                  R$ {monthlyTaxTraditional.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <DollarSign size={14} />
                  <span>Imposto mensal com holding:</span>
                </span>
                <span className='text-foreground font-medium'>
                  R$ {monthlyTaxHolding.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className='flex justify-between items-center pt-2 border-t border-border'>
                <span className='text-foreground font-medium flex items-center gap-1'>
                  <BarChart size={14} />
                  <span>Economia mensal:</span>
                </span>
                <span className='text-accent-foreground font-bold'>
                  R$ {monthlySavings.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className='flex justify-between items-center pt-2 border-t border-border mt-2'>
                <span className='text-foreground font-medium flex items-center gap-1'>
                  <BarChart size={14} />
                  <span>Economia anual:</span>
                </span>
                <span className='text-accent-foreground font-bold text-xl'>
                  R$ {yearlySavings.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            <div className='h-64 mt-6 relative'>
              {/* Aqui usaríamos o recharts para criar um gráfico real */}
              <div className='absolute inset-0 flex items-end justify-between px-4'>
                {data.map((item, index) => (
                  <div key={index} className='flex flex-col items-center'>
                    <div
                      className='bg-primary w-16 rounded-t-md'
                      style={{
                        height: `${Math.min(100, (item.savings / (yearlySavings * 20)) * 180)}px`,
                      }}
                    ></div>
                    <div className='text-sm font-medium mt-2 text-foreground'>
                      {item.year} {item.year === 1 ? 'ano' : 'anos'}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      R$ {item.savings.toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className='bg-muted px-6 py-4 border-t rounded-b-lg'>
        <Button variant='default' className='w-full group'>
          <span>Simule sua economia personalizada</span>
          <ArrowRight size={16} className='ml-2 group-hover:translate-x-1 transition-transform' />
        </Button>
      </CardFooter>
    </Card>
  )
}
