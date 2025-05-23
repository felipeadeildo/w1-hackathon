import { Loader2 } from 'lucide-react'
import { OnboardingFlow } from '~/components/onboarding/onboarding-flow'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { useOnboardingFlow } from '~/hooks/use-onboarding'

export default function OnboardingPage() {
  const { data: flow, isLoading: isFlowLoading, error: flowError } = useOnboardingFlow()

  // Handle loading states
  if (isFlowLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <span className='sr-only'>Carregando...</span>
      </div>
    )
  }

  // Handle errors
  if (flowError) {
    return (
      <Card className='mx-auto max-w-4xl'>
        <CardHeader>
          <CardTitle className='text-center text-red-500'>Erro ao carregar onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-center'>Não foi possível carregar seu processo de onboarding.</p>
          <p className='text-center text-sm text-muted-foreground mt-2'>
            Por favor, tente novamente mais tarde ou entre em contato com suporte.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Render onboarding flow if we have data
  if (flow) {
    return <OnboardingFlow flow={flow} />
  }

  return null
}
