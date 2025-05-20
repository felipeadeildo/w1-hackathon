import { SignupForm } from '~/components/auth/signup-form'

export default function SignupPage() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center py-12 px-4'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-light text-foreground'>Criar Conta</h2>
          <p className='mt-2 text-muted-foreground'>Crie sua conta para acessar a plataforma</p>
        </div>
        <div className='bg-card p-8 rounded-lg shadow-lg'>
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
