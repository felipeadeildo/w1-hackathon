import { Button } from '~/components/ui/button'
import type { StepDataObject, UserOnboardingStep } from '~/types/onboarding'
import { ChatInterface } from '../chat/chat-interface'
import { StructuredDataDisplay } from '../structured-data/structured-data-display'

interface LLMChatStepProps {
  userStep: UserOnboardingStep
  onUpdateData: (data: StepDataObject) => Promise<void>
  onComplete: (isComplete: boolean) => Promise<void>
}

export const LLMChatStep = ({ userStep, onComplete }: LLMChatStepProps) => {
  return (
    <div className='flex flex-col h-[700px]'>
      <div className='flex-1 flex flex-col md:flex-row gap-4 overflow-hidden'>
        <div className='flex-1 min-w-0 flex flex-col border rounded-lg overflow-hidden'>
          <ChatInterface userStep={userStep} />
        </div>

        <div className='flex-1 min-w-0 border rounded-lg overflow-hidden'>
          <StructuredDataDisplay userStep={userStep} />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className='mt-6 flex items-center justify-between'>
        <p className='text-muted-foreground text-xs mt-1'>
          Você não precisa fornecer todos os tipos de dados para continuar.
        </p>

        <Button onClick={() => onComplete(true)} className='ml-auto'>
          Finalizar Coleta de Dados
        </Button>
      </div>
    </div>
  )
}
