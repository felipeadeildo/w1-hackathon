import { type ReactNode, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Loading } from '~/components/ui/loading'
import { useAuth } from '~/hooks/use-auth'

interface RequireAuthProps {
  children: ReactNode
}

/**
 * Component to protect routes requiring authentication
 * Redirects to login if not authenticated
 */
export function RequiresAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Sua sessão expirou ou você não está autenticado. Faça login novamente.')
      navigate('/login', {
        replace: true,
        state: { from: location.pathname },
      })
    }
  }, [isAuthenticated, isLoading, navigate, location])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loading label='Verificando autenticação...' size={80} labelPosition='bottom' />
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : null
}
