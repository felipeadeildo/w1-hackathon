import { useLocation } from 'react-router'
import { LoginForm } from '~/components/auth/login-form'
import { SignupForm } from '~/components/auth/signup-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export default function AuthPage() {
  const location = useLocation()
  const defaultTab = location.hash === '#signup' ? 'signup' : 'login'

  return (
    <div className='min-h-screen bg-background flex items-center justify-center py-12 px-4'>
      <div className='max-w-md w-full space-y-8'>
        <div className='flex flex-col items-center'>
          <img src='/w1-tagline.png' alt='W1 Capital' className='h-12 mb-8' />
          <h2 className='text-3xl font-light text-foreground'>Área do Cliente</h2>
          <p className='mt-2 text-muted-foreground'>Gerencie seu patrimônio de forma eficiente</p>
        </div>

        <div className='bg-card p-8 rounded-lg shadow-lg'>
          <Tabs defaultValue={defaultTab} className='space-y-6'>
            <TabsList className='w-full grid grid-cols-2'>
              <TabsTrigger value='login'>Login</TabsTrigger>
              <TabsTrigger value='signup'>Primeiro acesso</TabsTrigger>
            </TabsList>

            <TabsContent value='login'>
              <LoginForm />
            </TabsContent>

            <TabsContent value='signup'>
              <SignupForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
