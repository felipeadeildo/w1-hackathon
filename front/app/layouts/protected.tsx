import { LogOut } from 'lucide-react'
import { Link, Outlet, useNavigate } from 'react-router'
import { RequiresAuth } from '~/components/requires-auth'
import { Button } from '~/components/ui/button'
import { useAuth } from '~/hooks/use-auth'

export default function ProtectedLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <RequiresAuth>
      <div className='min-h-screen bg-background'>
        <header className='bg-card border-b'>
          <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
            <div className='flex items-center gap-8'>
              <img src='w1.png' alt='W1 Capital' className='h-8' />
              <nav className='hidden md:flex items-center gap-6'>
                <Button variant='ghost' className='text-muted-foreground hover:text-foreground'>
                  <Link to='/app'>Dashboard</Link>
                </Button>
              </nav>
            </div>
            <div className='flex items-center gap-4'>
              <span className='text-muted-foreground hidden md:inline-block'>{user?.email}</span>
              <Button
                variant='destructive'
                size='sm'
                onClick={handleLogout}
                className='gap-2 cursor-pointer'
              >
                Sair
                <LogOut className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </header>
        <main className='container mx-auto px-4 py-8'>
          <Outlet />
        </main>
      </div>
    </RequiresAuth>
  )
}
