import { BarChartIcon, DollarSign, InfoIcon, TrendingUp } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'

interface MonthlyTabProps {
  monthlyTaxTraditional: number
  monthlyTaxHolding: number
  monthlySavings: number
  yearlySavings: number
  timeData: { year: number; savings: number }[]
}

// TODO: mover para lib/utils.ts
const formatCurrency = (value: number) => {
  return `R$ ${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

type CustomTooltipProps = TooltipProps<number, string> & {
  active?: boolean
  payload?: Array<{
    value: number
    name: string
  }>
  label?: string | number
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-card p-2.5 rounded-md border shadow-sm'>
        <p className='text-xs font-medium'>{`${label} ${label === 1 ? 'ano' : 'anos'}`}</p>
        <p className='text-primary font-bold text-sm'>{formatCurrency(payload[0].value)}</p>
        <p className='text-xs text-muted-foreground mt-0.5'>Economia acumulada</p>
      </div>
    )
  }
  return null
}

export const MonthlyTab = ({
  monthlyTaxTraditional,
  monthlyTaxHolding,
  monthlySavings,
  yearlySavings,
  timeData,
}: MonthlyTabProps) => {
  const savingsPercentage = (
    ((monthlyTaxTraditional - monthlyTaxHolding) / monthlyTaxTraditional) *
    100
  ).toFixed(1)

  return (
    <div className='space-y-3'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='bg-muted/30 p-2.5 rounded-lg border'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5'>
              <DollarSign className='h-3.5 w-3.5 text-primary' />
              <span className='text-sm font-medium'>Comparativo de Impostos</span>
            </div>

            <Badge
              variant='outline'
              className='bg-primary/10 text-primary text-[10px] py-0 px-1.5 h-4 hidden sm:flex'
            >
              Economia: -{savingsPercentage}%
            </Badge>
          </div>

          <div className='grid gap-2 text-xs mt-2'>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>Imposto mensal atual:</span>
              <span>{formatCurrency(monthlyTaxTraditional)}</span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>Com holding:</span>
              <span>{formatCurrency(monthlyTaxHolding)}</span>
            </div>

            <Separator className='my-1' />

            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-1'>
                <BarChartIcon className='h-3.5 w-3.5 text-primary' />
                <span>Economia mensal:</span>
              </div>
              <span className='font-semibold'>{formatCurrency(monthlySavings)}</span>
            </div>

            <div className='flex justify-between items-center pt-1'>
              <div className='flex items-center gap-1'>
                <TrendingUp className='h-3.5 w-3.5 text-primary' />
                <span>Economia anual:</span>
              </div>
              <span className='text-primary font-bold'>{formatCurrency(yearlySavings)}</span>
            </div>

            {/* Badge para mobile */}
            <div className='flex sm:hidden justify-end mt-1'>
              <Badge
                variant='outline'
                className='bg-primary/10 text-primary text-[10px] py-0 px-1.5 h-4'
              >
                Economia: -{savingsPercentage}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Gráfico compacto */}
        <div className='bg-muted/20 p-2.5 rounded-lg border'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5'>
              <TrendingUp className='h-3.5 w-3.5 text-primary' />
              <span className='text-xs font-medium'>Economia ao Longo do Tempo</span>
            </div>

            {/* Valor total em X anos (visível apenas em telas maiores) */}
            <div className='hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground'>
              <InfoIcon className='h-3 w-3' />
              <span>
                Em {timeData.length} anos: {formatCurrency(timeData[timeData.length - 1].savings)}
              </span>
            </div>
          </div>

          <div className='h-[160px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={timeData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id='savingsGradient' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='hsl(var(--primary))' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='hsl(var(--primary))' stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' vertical={false} opacity={0.3} />
                <XAxis
                  dataKey='year'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={5}
                  tickFormatter={(value) => `${value}`}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={5}
                  width={40}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  style={{ fontSize: 10 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type='monotone'
                  dataKey='savings'
                  stroke='hsl(var(--primary))'
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill='url(#savingsGradient)'
                  activeDot={{ r: 4, strokeWidth: 1 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Informação em mobile */}
          <div className='flex sm:hidden justify-end mt-1'>
            <div className='flex items-center gap-1 text-[10px] text-muted-foreground'>
              <InfoIcon className='h-3 w-3' />
              <span>
                Em {timeData.length} anos: {formatCurrency(timeData[timeData.length - 1].savings)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
