import { useParams } from 'react-router'
import { useHolding, useHoldingStages } from '~/hooks/use-holding'

export default function HoldingPage() {
  const { holdingId } = useParams()
  const { data: holding, isLoading } = useHolding(holdingId!)
  const { data: stages } = useHoldingStages(holdingId!)

  if (isLoading) return <div>Carregando...</div>
  if (!holding) return <div>Holding não encontrada.</div>

  // Exemplo simples: mostra nome e lista de estágios
  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>{holding.name}</h2>
      <div className='space-y-2'>
        <div>
          Status: <span className='font-mono'>{holding.status}</span>
        </div>
        <div>Fases:</div>
        <ul className='list-disc ml-6'>
          {stages?.map((stage) => (
            <li key={stage.id}>
              {stage.order}. {stage.description}{' '}
              <span className='text-xs text-muted-foreground'>({stage.status})</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Aqui depois renderiza o estágio atual, upload, etc */}
    </div>
  )
}
