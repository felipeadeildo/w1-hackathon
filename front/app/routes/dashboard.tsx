import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Form } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Loading } from '~/components/ui/loading'
import { useAuth } from '~/hooks/use-auth'
import { useCreateHolding, useHoldings } from '~/hooks/use-holding'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: holdings, isLoading } = useHoldings()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const createHoldingMutation = useCreateHolding()
  const form = useForm<{ name: string }>()

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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async (data) => {
                  try {
                    const holding = await createHoldingMutation.mutateAsync({ name: data.name })
                    setOpen(false)
                    navigate(`/app/holding/${holding.id}`)
                  } catch {
                    // handle error (show toast, etc)
                  }
                })}
                className='flex flex-col gap-4'
              >
                <Label htmlFor='name'>Nome da holding</Label>
                <Input
                  id='name'
                  {...form.register('name', { required: true })}
                  placeholder='Nome da holding'
                  required
                />
                <Button type='submit' disabled={createHoldingMutation.isPending}>
                  {createHoldingMutation.isPending ? 'Criando...' : 'Criar'}
                </Button>
              </form>
            </Form>
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
