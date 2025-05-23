import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { formatCurrency } from '~/lib/format'
import type { ImovelData } from '~/types/llm-chat'

interface ImoveisSectionProps {
  imoveis: ImovelData[]
  icon: React.ReactNode
}

export function ImoveisSection({ imoveis, icon }: ImoveisSectionProps) {
  return (
    <section>
      <div className='flex items-center gap-2 mb-3'>
        {icon}
        <h3 className='text-lg font-medium'>Imóveis ({imoveis.length})</h3>
      </div>

      {imoveis.length > 0 ? (
        <div className='space-y-4'>
          {imoveis.map((imovel, index) => (
            <Card key={index}>
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-base'>{imovel.tipo}</CardTitle>
                  <Badge variant={getBadgeVariant(imovel.status)}>{imovel.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-1 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Localização:</span>
                    <span>{imovel.localizacao}</span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Valor Estimado:</span>
                    <span className='font-medium'>
                      {imovel.valor_estimado_str || formatCurrency(imovel.valor_estimado)}
                    </span>
                  </div>

                  {imovel.renda_mensal || imovel.renda_mensal_str ? (
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Renda Mensal:</span>
                      <span>{imovel.renda_mensal_str || formatCurrency(imovel.renda_mensal)}</span>
                    </div>
                  ) : null}

                  {imovel.area && (
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Área:</span>
                      <span>{imovel.area}</span>
                    </div>
                  )}

                  {imovel.data_aquisicao && (
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Data de Aquisição:</span>
                      <span>{imovel.data_aquisicao}</span>
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
            Nenhum imóvel identificado ainda
          </CardContent>
        </Card>
      )}
    </section>
  )
}

// Helper to determine badge variant based on status
function getBadgeVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
  if (status.toLowerCase().includes('alug')) return 'default'
  if (status.toLowerCase().includes('próprio')) return 'secondary'
  return 'outline'
}
