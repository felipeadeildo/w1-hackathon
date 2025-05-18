import { ArrowRight, Link as LinkIcon, Percent, Users } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { MonthlyTab } from './economy-simulator/monthly-tab'
import { SimulationForm } from './economy-simulator/simulation-form'
import { SuccessionTab } from './economy-simulator/succession-tab'

export const EconomySimulator = () => {
  const [patrimonyValue, setPatrimonyValue] = useState(1000000)
  const [rentalIncome, setRentalIncome] = useState(10000)
  const [heirs, setHeirs] = useState(2)

  // Cálculos simplificados para demonstração
  const traditionalTaxCost = patrimonyValue * 0.15 // 15% em custos de inventário
  const holdingTaxCost = patrimonyValue * 0.04 // 4% com holding
  const savingsAmount = traditionalTaxCost - holdingTaxCost

  const monthlyTaxTraditional = rentalIncome * 0.275 // 27.5% IR pessoa física
  const monthlyTaxHolding = rentalIncome * 0.15 // 15% aprox. para PJ
  const monthlySavings = monthlyTaxTraditional - monthlyTaxHolding
  const yearlySavings = monthlySavings * 12

  const timeData = [
    { year: 1, savings: yearlySavings },
    { year: 3, savings: yearlySavings * 3 },
    { year: 5, savings: yearlySavings * 5 },
    { year: 10, savings: yearlySavings * 10 },
    { year: 15, savings: yearlySavings * 15 },
    { year: 20, savings: yearlySavings * 20 },
  ]

  return (
    <Card className='w-full shadow-lg py-0'>
      <CardHeader className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg py-2 px-4'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-xl font-light'>Simulador de Economia</CardTitle>
            <CardDescription className='text-primary-foreground/80 text-xs'>
              Descubra quanto você pode economizar com uma holding patrimonial
            </CardDescription>
          </div>
          <a href='#contact'>
            <Button
              variant='outline'
              size='sm'
              className='bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
            >
              <LinkIcon size={14} className='mr-1' />
              <span className='text-xs'>Fale com um consultor</span>
            </Button>
          </a>
        </div>
      </CardHeader>

      <CardContent className='p-4'>
        <div className='grid md:grid-cols-5 gap-6'>
          <div className='md:col-span-2'>
            <h3 className='text-sm font-medium mb-3'>Informe seus dados</h3>
            <SimulationForm
              patrimonyValue={patrimonyValue}
              setPatrimonyValue={setPatrimonyValue}
              rentalIncome={rentalIncome}
              setRentalIncome={setRentalIncome}
              heirs={heirs}
              setHeirs={setHeirs}
            />
          </div>

          <div className='md:col-span-3'>
            <h3 className='text-sm font-medium mb-3'>Resultados da simulação</h3>
            <Tabs defaultValue='succession' className='mt-2'>
              <TabsList className='grid grid-cols-2 mb-3 w-full'>
                <TabsTrigger value='succession' className='flex items-center gap-1 text-xs py-1.5'>
                  <Users size={12} />
                  <span>Sucessão Patrimonial</span>
                </TabsTrigger>
                <TabsTrigger value='monthly' className='flex items-center gap-1 text-xs py-1.5'>
                  <Percent size={12} />
                  <span>Economia Mensal</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value='succession'>
                <SuccessionTab
                  traditionalTaxCost={traditionalTaxCost}
                  holdingTaxCost={holdingTaxCost}
                  savingsAmount={savingsAmount}
                />
              </TabsContent>

              <TabsContent value='monthly'>
                <MonthlyTab
                  monthlyTaxTraditional={monthlyTaxTraditional}
                  monthlyTaxHolding={monthlyTaxHolding}
                  monthlySavings={monthlySavings}
                  yearlySavings={yearlySavings}
                  timeData={timeData}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>

      <CardFooter className='bg-muted px-4 py-3 border-t'>
        <a href='#contact' className='w-full'>
          <Button variant='default' className='w-full group'>
            <span>Simule sua economia personalizada</span>
            <ArrowRight size={16} className='ml-2 group-hover:translate-x-1 transition-transform' />
          </Button>
        </a>
      </CardFooter>
    </Card>
  )
}
