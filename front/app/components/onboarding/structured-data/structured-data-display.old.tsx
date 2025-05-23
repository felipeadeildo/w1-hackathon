import { Briefcase, Bui  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div className='p-3 border-b bg-muted/20'>
        <h3 className='font-medium text-sm'>Dados Estruturados</h3>
        <p className='text-xs text-muted-foreground'>Informações extraídas com base na conversa</p>
      </div>CircleDollarSign, Users } from 'lucide-react'
import { useChatStructuredData } from '~/hooks/use-llm-chat'
import type { UserOnboardingStep } from '~/types/onboarding'
import { EstruturaFamiliarSection } from './estrutura-familiar-section'
import { ImoveisSection } from './imoveis-section'
import { OutrosAtivosSection } from './outros-ativos-section'
import { ParticipacoesSection } from './participacoes-section'

interface StructuredDataDisplayProps {
  userStep: UserOnboardingStep
}

export function StructuredDataDisplay({ userStep }: StructuredDataDisplayProps) {
  const {
    data = {
      imoveis: [],
      participacoes: [],
      estrutura_familiar: undefined,
      investimentos: [],
      outros_ativos: [],
    },
  } = useChatStructuredData(userStep.step_id)

  return (
    <>
      {/* Header */}
      <div className='p-3 border-b bg-muted/20'>
        <h3 className='font-medium text-sm'>Dados Estruturados</h3>
        <p className='text-xs text-muted-foreground'>Informações extraídas com base na conversa</p>
      </div>

      {/* Structured data sections */}
      <div className='p-3 space-y-5'>
        {/* Imóveis */}
        <ImoveisSection imoveis={data.imoveis} icon={<Building className='h-4 w-4' />} />

        {/* Participações Societárias */}
        <ParticipacoesSection
          participacoes={data.participacoes}
          icon={<Briefcase className='h-4 w-4' />}
        />

        {/* Estrutura Familiar */}
        <EstruturaFamiliarSection
          estruturaFamiliar={data.estrutura_familiar}
          icon={<Users className='h-4 w-4' />}
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
