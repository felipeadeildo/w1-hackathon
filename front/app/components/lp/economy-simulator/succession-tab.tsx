import { BarChartIcon, Clock, DollarSign } from 'lucide-react'

interface SuccessionTabProps {
  traditionalTaxCost: number
  holdingTaxCost: number
  savingsAmount: number
}

export const SuccessionTab = ({
  traditionalTaxCost,
  holdingTaxCost,
  savingsAmount,
}: SuccessionTabProps) => {
  return (
    <div className='space-y-4'>
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
            <BarChartIcon size={14} />
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
    </div>
  )
}
