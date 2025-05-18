import { Home, Landmark, Users } from 'lucide-react'
import { Input } from '~/components/ui/input'

interface SimulationFormProps {
  patrimonyValue: number
  setPatrimonyValue: (value: number) => void
  rentalIncome: number
  setRentalIncome: (value: number) => void
  heirs: number
  setHeirs: (value: number) => void
}

export const SimulationForm = ({
  patrimonyValue,
  setPatrimonyValue,
  rentalIncome,
  setRentalIncome,
  heirs,
  setHeirs,
}: SimulationFormProps) => {
  return (
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
  )
}
