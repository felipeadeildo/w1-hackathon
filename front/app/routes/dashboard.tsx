import { useAuth } from '~/hooks/use-auth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className='text-3xl font-light mb-4'>Bem-vindo, {user?.email}</h1>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <div className='bg-card p-6 rounded-lg shadow-sm'>
          <h2 className='text-xl font-medium mb-4'>Resumo</h2>
          <p className='text-muted-foreground'>Em desenvolvimento...</p>
        </div>
      </div>
    </div>
  )
}
