import { type ReactNode, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Loading } from '~/components/ui/loading'
import { useAuth } from '~/hooks/use-auth'
import { useIsOnboardingComplete, useOnboardingFlow } from '~/hooks/use-onboarding'

interface RequireAuthProps {
  children: ReactNode
}

/**
 * Component to protect routes requiring authentication
 * Redirects to login if not authenticated
 * Redirects to onboarding if it's not completed
 */
export function RequiresAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: onboardingFlow, isLoading: flowLoading } = useOnboardingFlow()
  const { data: isComplete, isLoading: completeLoading } = useIsOnboardingComplete()

  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  const isLoading = authLoading || flowLoading || completeLoading

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Sua sessão expirou ou você não está autenticado. Faça login novamente.')
      navigate('/auth', {
        replace: true,
        state: { from: location.pathname },
      })
    }
  }, [isAuthenticated, authLoading, navigate, location])

  // Onboarding check
  useEffect(() => {
    // Only redirect if authenticated, data is loaded, and onboarding isn't completed
    if (
      isAuthenticated &&
      !flowLoading &&
      !completeLoading &&
      onboardingFlow &&
      !isComplete &&
      !currentPath.includes('/app/onboarding')
    ) {
      toast.info(
        'Você precisa completar o processo de onboarding antes de acessar outras funcionalidades.',
      )
      navigate('/app/onboarding', { replace: true })
    }
  }, [
    isAuthenticated,
    onboardingFlow,
    isComplete,
    flowLoading,
    completeLoading,
    navigate,
    currentPath,
  ])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loading label='Verificando autenticação...' size={80} labelPosition='bottom' />
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : null
}
