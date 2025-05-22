import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import type { StepDataObject, UserOnboardingStep } from '~/types/onboarding'

interface PersonalDataStepProps {
  userStep: UserOnboardingStep
  onUpdateData: (data: StepDataObject) => Promise<void>
  onComplete: (isComplete: boolean) => Promise<void>
}

// Função para aplicar máscara de CPF
const applyCpfMask = (value: string) => {
  const cleanValue = value.replace(/\D/g, '')
  return cleanValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

// Função para aplicar máscara de telefone
const applyPhoneMask = (value: string) => {
  const cleanValue = value.replace(/\D/g, '')

  if (cleanValue.length <= 10) {
    // Formato: (00) 0000-0000
    return cleanValue.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})/, '$1-$2')
  } else {
    // Formato: (00) 00000-0000
    return cleanValue.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})/, '$1-$2')
  }
}

// Define the form schema with validation rules
const personalDataSchema = z.object({
  fullName: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
  cpf: z
    .string()
    .min(11, 'CPF inválido')
    .max(14, 'CPF inválido')
    .refine((val) => /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(val), {
      message: 'CPF deve estar no formato 000.000.000-00',
    }),
  birthDate: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: 'Data de nascimento deve estar no formato YYYY-MM-DD',
  }),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .refine((val) => /^(\+\d{1,3})?\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(val), {
      message: 'Telefone deve incluir DDD e número',
    }),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres (sigla)'),
  postalCode: z.string().refine((val) => /^\d{5}-?\d{3}$/.test(val), {
    message: 'CEP deve estar no formato 00000-000',
  }),
})

type PersonalDataFormValues = z.infer<typeof personalDataSchema>

export const PersonalDataStep = ({ userStep, onUpdateData, onComplete }: PersonalDataStepProps) => {
  // Initialize form with default values or existing data
  const form = useForm<PersonalDataFormValues>({
    resolver: zodResolver(personalDataSchema),
    mode: 'onChange', // Validação em tempo real
    defaultValues: {
      fullName: '',
      cpf: '',
      birthDate: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      ...(userStep.data || {}), // Merge any existing data
    },
  })

  // Track form status for automatic updates
  const formState = form.formState

  // Load existing data when the component mounts
  useEffect(() => {
    if (userStep.data) {
      Object.entries(userStep.data).forEach(([key, value]) => {
        if (value && form.getValues(key as keyof PersonalDataFormValues) !== value) {
          form.setValue(key as keyof PersonalDataFormValues, value as string)
        }
      })
    }
  }, [userStep.data, form])

  // Check if all required fields are filled and valid
  const isFormComplete = () => {
    const values = form.getValues()
    const hasErrors = Object.keys(formState.errors).length > 0
    const allFieldsFilled = Object.values(values).every((value) => value && value.trim().length > 0)

    // Debug logs (remova em produção)
    console.log('Form values:', values)
    console.log('Form errors:', formState.errors)
    console.log('All fields filled:', allFieldsFilled)
    console.log('Has errors:', hasErrors)
    console.log('Form is valid:', formState.isValid)

    return formState.isValid && allFieldsFilled
  }

  // Save form data when it changes
  const onSubmit = async (values: PersonalDataFormValues) => {
    await onUpdateData(values as StepDataObject)
    if (isFormComplete()) {
      await onComplete(true)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder='Nome completo' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='cpf'
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    placeholder='000.000.000-00'
                    {...field}
                    onChange={(e) => {
                      const maskedValue = applyCpfMask(e.target.value)
                      field.onChange(maskedValue)
                    }}
                    maxLength={14}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='birthDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder='(00) 00000-0000'
                    {...field}
                    onChange={(e) => {
                      const maskedValue = applyPhoneMask(e.target.value)
                      field.onChange(maskedValue)
                    }}
                    maxLength={15}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder='Rua, número, complemento' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='city'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder='Cidade' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='state'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input
                    placeholder='UF'
                    maxLength={2}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value.toUpperCase())
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='postalCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input
                    placeholder='00000-000'
                    {...field}
                    onChange={(e) => {
                      const cleanValue = e.target.value.replace(/\D/g, '')
                      const maskedValue = cleanValue.replace(/(\d{5})(\d{1,3})/, '$1-$2')
                      field.onChange(maskedValue)
                    }}
                    maxLength={9}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end'>
          <Button
            type='submit'
            disabled={!isFormComplete() || formState.isSubmitting}
            className='relative'
          >
            {formState.isSubmitting
              ? 'Salvando...'
              : userStep.is_completed
                ? 'Atualizar dados'
                : 'Salvar e continuar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
