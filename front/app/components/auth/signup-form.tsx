import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Loading } from '~/components/ui/loading'
import { useAuth } from '~/hooks/use-auth'
import { signupSchema, type SignupInput } from '~/schemas/auth'

export const SignupForm = () => {
  const { signup, isLoading } = useAuth()
  const navigate = useNavigate()
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', passwordConfirm: '', name: '' },
  })

  const onSubmit = async (data: SignupInput) => {
    const user = await signup(data)
    if (user) {
      navigate('/app', { replace: true })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder='Seu nome completo' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='email'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='seu@email.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='password'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type='password' placeholder='Sua senha' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='passwordConfirm'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirme sua senha</FormLabel>
              <FormControl>
                <Input type='password' placeholder='Confirme sua senha' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={!form.formState.isValid || isLoading}>
          {isLoading && <Loading label='Criando conta...' labelPosition='right' size={20} />}
          {!isLoading && (
            <>
              <UserPlus className='mr-2 h-4 w-4' />
              Criar Conta
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
