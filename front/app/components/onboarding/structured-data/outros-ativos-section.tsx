import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { formatCurrency } from '~/lib/format'
import type { InvestimentoData, OutroAtivoData } from '~/types/llm-chat'

interface OutrosAtivosSectionProps {
  investimentos: InvestimentoData[]
  outrosAtivos: OutroAtivoData[]
  icon: React.ReactNode
}

export function OutrosAtivosSection({
  investimentos,
  outrosAtivos,
  icon,
}: OutrosAtivosSectionProps) {
  const totalAtivos = investimentos.length + outrosAtivos.length

  return (
    <section>
      <div className='flex items-center gap-2 mb-3'>
        {icon}
        <h3 className='text-lg font-medium'>Outros Ativos ({totalAtivos})</h3>
      </div>

      {/* Investimentos */}
      {investimentos.length > 0 && (
        <div className='mb-4'>
          <h4 className='text-sm font-medium mb-3'>Investimentos ({investimentos.length})</h4>
          <div className='space-y-4'>
            {investimentos.map((investimento, index) => (
              <Card key={index}>
                <CardHeader className='pb-2'>
                  <div className='flex justify-between items-start'>
                    <CardTitle className='text-base'>{investimento.tipo}</CardTitle>
                    <span className='font-medium'>
                      {investimento.valor_str || formatCurrency(investimento.valor)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-1 text-sm'>
                    {investimento.detalhes && (
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Detalhes:</span>
                        <span>{investimento.detalhes}</span>
                      </div>
                    )}

                    {investimento.instituicao && (
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Instituição:</span>
                        <span>{investimento.instituicao}</span>
                      </div>
                    )}

                    {investimento.data_aplicacao && (
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Data de Aplicação:</span>
                        <span>{investimento.data_aplicacao}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Outros Ativos */}
      {outrosAtivos.length > 0 && (
        <div>
          <h4 className='text-sm font-medium mb-3'>Outros Ativos ({outrosAtivos.length})</h4>
          <div className='space-y-4'>
            {outrosAtivos.map((ativo, index) => (
              <Card key={index}>
                <CardHeader className='pb-2'>
                  <div className='flex justify-between items-start'>
                    <CardTitle className='text-base'>{ativo.tipo}</CardTitle>
                    <span className='font-medium'>
                      {ativo.valor_str || formatCurrency(ativo.valor)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-1 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Descrição:</span>
                      <span>{ativo.descricao}</span>
                    </div>

                    {ativo.observacoes && (
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Observações:</span>
                        <span>{ativo.observacoes}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {totalAtivos === 0 && (
        <Card>
          <CardContent className='p-6 text-center text-muted-foreground'>
            Nenhum outro ativo identificado ainda
          </CardContent>
        </Card>
      )}
    </section>
  )
}
