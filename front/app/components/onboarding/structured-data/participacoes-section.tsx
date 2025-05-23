import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { ParticipacaoSocietariaData } from '~/types/llm-chat'

interface PartipacoesSectionProps {
  participacoes: ParticipacaoSocietariaData[]
  icon: React.ReactNode
}

export function ParticipacoesSection({ participacoes, icon }: PartipacoesSectionProps) {
  return (
    <section>
      <div className='flex items-center gap-2 mb-3'>
        {icon}
        <h3 className='text-lg font-medium'>Participações Societárias ({participacoes.length})</h3>
      </div>

      {participacoes.length > 0 ? (
        <div className='space-y-4'>
          {participacoes.map((participacao, index) => (
            <Card key={index}>
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-base'>{participacao.empresa}</CardTitle>
                  <span className='text-primary font-semibold'>{participacao.participacao}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-1 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Segmento:</span>
                    <span>{participacao.segmento}</span>
                  </div>

                  {participacao.faturamento_anual && (
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Faturamento Anual:</span>
                      <span>{participacao.faturamento_anual}</span>
                    </div>
                  )}

                  {participacao.cnpj && (
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>CNPJ:</span>
                      <span>{participacao.cnpj}</span>
                    </div>
                  )}

                  {participacao.posicao && (
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Posição:</span>
                      <span>{participacao.posicao}</span>
                    </div>
                  )}

                  {participacao.data_criacao && (
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Data de Criação:</span>
                      <span>{participacao.data_criacao}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className='p-6 text-center text-muted-foreground'>
            Nenhuma participação societária identificada ainda
          </CardContent>
        </Card>
      )}
    </section>
  )
}
