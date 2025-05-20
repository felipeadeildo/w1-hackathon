import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Loading } from '~/components/ui/loading'
import { useAuth } from '~/hooks/use-auth'
import { useHoldings } from '~/hooks/use-holding'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: holdings, isLoading } = useHoldings()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  if (isLoading)
    return (
      <div className='flex items-center justify-center'>
        <Loading label='Carregando holdings...' />
      </div>
    )

  if (!holdings || holdings.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center gap-6 h-96'>
        <span className='text-lg text-muted-foreground'>Nenhuma holding cadastrada ainda.</span>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant='default'>Criar nova holding</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Holding</DialogTitle>
            </DialogHeader>
            <form
              className='flex flex-col gap-4'
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const name = (form.elements.namedItem('name') as HTMLInputElement).value
                const res = await fetch('/api/holdings/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name }),
                  credentials: 'include',
                })
                if (res.ok) {
                  const holding = await res.json()
                  setOpen(false)
                  navigate(`/app/holding/${holding.id}`)
                }
              }}
            >
              <input
                name='name'
                placeholder='Nome da holding'
                className='input input-bordered w-full'
                required
              />
              <Button type='submit'>Criar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-light mb-4'>Bem-vindo, {user?.email}</h1>
      <h2 className='text-2xl font-bold'>Minhas Holdings</h2>
      <ul className='space-y-2'>
        {holdings.map((h) => (
          <li key={h.id}>
            <Button variant='outline' onClick={() => navigate(`/app/holding/${h.id}`)}>
              {h.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
