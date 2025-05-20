import { LoginForm } from '~/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center py-12 px-4'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-light text-foreground'>Área do Cliente</h2>
          <p className='mt-2 text-muted-foreground'>Faça login para acessar sua conta</p>
        </div>
        <div className='bg-card p-8 rounded-lg shadow-lg'>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
