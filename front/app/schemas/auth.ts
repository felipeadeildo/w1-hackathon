import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter ao menos 6 caracteres' }),
})

export type LoginInput = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    name: z.string().min(2, { message: 'Nome obrigatório' }),
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(6, { message: 'A senha deve ter ao menos 6 caracteres' }),
    passwordConfirm: z.string().min(6, { message: 'A confirmação deve ter ao menos 6 caracteres' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'As senhas não conferem',
    path: ['passwordConfirm'],
  })

export type SignupInput = z.infer<typeof signupSchema>
