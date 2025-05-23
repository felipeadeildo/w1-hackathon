import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { EstruturaFamiliarData, MembroFamiliaData } from '~/types/llm-chat'

interface EstruturaFamiliarSectionProps {
  estruturaFamiliar?: EstruturaFamiliarData
  icon: React.ReactNode
}

export function EstruturaFamiliarSection({
  estruturaFamiliar,
  icon,
}: EstruturaFamiliarSectionProps) {
  const hasData =
    estruturaFamiliar &&
    (estruturaFamiliar.estado_civil ||
      estruturaFamiliar.regime_bens ||
      estruturaFamiliar.conjuge ||
      estruturaFamiliar.filhos?.length > 0)

  return (
    <section>
      <div className='flex items-center gap-2 mb-3'>
        {icon}
        <h3 className='text-lg font-medium'>Estrutura Familiar</h3>
      </div>

      {hasData ? (
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>Informações Familiares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4'>
              {estruturaFamiliar?.estado_civil && (
                <div>
                  <p className='text-sm text-muted-foreground'>Estado Civil</p>
                  <p className='font-medium'>{estruturaFamiliar.estado_civil}</p>
                </div>
              )}

              {estruturaFamiliar?.regime_bens && (
                <div>
                  <p className='text-sm text-muted-foreground'>Regime de Bens</p>
                  <p className='font-medium'>{estruturaFamiliar.regime_bens}</p>
                </div>
              )}
            </div>

            {/* Cônjuge */}
            {estruturaFamiliar?.conjuge && (
              <div className='mt-4'>
                <p className='text-sm text-muted-foreground mb-2'>Cônjuge</p>
                <MembroFamiliarCard membro={estruturaFamiliar.conjuge} />
              </div>
            )}

            {/* Filhos */}
            {estruturaFamiliar?.filhos && estruturaFamiliar.filhos.length > 0 && (
              <div className='mt-4'>
                <p className='text-sm text-muted-foreground mb-2'>
                  Filhos ({estruturaFamiliar.filhos.length})
                </p>
                <div className='space-y-2'>
                  {estruturaFamiliar.filhos.map((filho, index) => (
                    <MembroFamiliarCard key={index} membro={filho} />
                  ))}
                </div>
              </div>
            )}

            {/* Outros dependentes */}
            {estruturaFamiliar?.outros_dependentes &&
              estruturaFamiliar.outros_dependentes.length > 0 && (
                <div className='mt-4'>
                  <p className='text-sm text-muted-foreground mb-2'>
                    Outros Dependentes ({estruturaFamiliar.outros_dependentes.length})
                  </p>
                  <div className='space-y-2'>
                    {estruturaFamiliar.outros_dependentes.map((dependente, index) => (
                      <MembroFamiliarCard key={index} membro={dependente} />
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className='p-6 text-center text-muted-foreground'>
            Estrutura familiar ainda não identificada
          </CardContent>
        </Card>
      )}
    </section>
  )
}

// Helper component for displaying family members
function MembroFamiliarCard({ membro }: { membro: MembroFamiliaData }) {
  return (
    <Card className='bg-muted/30'>
      <CardContent className='p-3'>
        <div className='flex justify-between items-start'>
          <div>
            <p className='font-medium'>{membro.nome}</p>
            <p className='text-sm text-muted-foreground'>{membro.parentesco}</p>
          </div>
          {membro.idade && <p className='text-sm'>{membro.idade} anos</p>}
        </div>
        {membro.ocupacao && <p className='text-sm mt-1'>{membro.ocupacao}</p>}
      </CardContent>
    </Card>
  )
}
