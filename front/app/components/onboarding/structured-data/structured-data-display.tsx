import { Briefcase, Building, CircleDollarSign, Users } from 'lucide-react'
import { Progress } from '~/components/ui/progress'
import type { ChatProgress, ChatStructuredData } from '~/types/llm-chat'
import { EstruturaFamiliarSection } from './estrutura-familiar-section'
import { ImoveisSection } from './imoveis-section'
import { OutrosAtivosSection } from './outros-ativos-section'
import { ParticipacoesSection } from './participacoes-section'

interface StructuredDataDisplayProps {
  structuredData: ChatStructuredData | null
  progress: ChatProgress | null
}

export function StructuredDataDisplay({ structuredData, progress }: StructuredDataDisplayProps) {
  // Default data if nothing is loaded yet
  const data = structuredData || {
    imoveis: [],
    participacoes: [],
    investimentos: [],
    outros_ativos: [],
  }

  const percentage = progress?.percentage || 0

  return (
    <>
      {/* Header */}
      <div className='p-4 border-b bg-muted/20'>
        <h3 className='font-medium'>Dados Estruturados</h3>
        <p className='text-sm text-muted-foreground'>Informações extraídas com base na conversa</p>

        {/* Progress bar */}
        <div className='mt-4'>
          <div className='flex justify-between text-sm mb-1'>
            <span>{percentage}% completo</span>
            {progress?.missing_data.length ? (
              <span className='text-amber-600'>Faltam: {progress.missing_data.join(', ')}</span>
            ) : null}
          </div>
          <Progress value={percentage} className='h-2' />
        </div>
      </div>

      {/* Structured data sections */}
      <div className='overflow-y-auto'>
        <div className='p-4 space-y-8'>
          {/* Imóveis */}
          <ImoveisSection imoveis={data.imoveis} icon={<Building className='h-5 w-5' />} />

          {/* Participações Societárias */}
          <ParticipacoesSection
            participacoes={data.participacoes}
            icon={<Briefcase className='h-5 w-5' />}
          />

          {/* Estrutura Familiar */}
          <EstruturaFamiliarSection
            estruturaFamiliar={data.estrutura_familiar}
            icon={<Users className='h-5 w-5' />}
          />

          {/* Outros Ativos */}
          <OutrosAtivosSection
            investimentos={data.investimentos}
            outrosAtivos={data.outros_ativos}
            icon={<CircleDollarSign className='h-5 w-5' />}
          />
        </div>
      </div>
    </>
  )
}
