import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
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
    <div className='flex flex-col h-[calc(100vh-160px)]'>
      <div className='flex-1 grid grid-cols-3 gap-3 overflow-hidden'>
        {/* Chat panel - takes 2/3 of the space */}
        <div className='col-span-2 border rounded-lg overflow-hidden flex flex-col'>
          <ChatInterface userStep={userStep} />
        </div>

        {/* Structured data panel - takes 1/3 of the space */}
        <div className='col-span-1 border rounded-lg overflow-hidden'>
          <ScrollArea className='h-full'>
            <StructuredDataDisplay userStep={userStep} />
          </ScrollArea>
        </div>
      </div>

      {/* Bottom Controls - reduced padding */}
      <div className='mt-3 flex items-center justify-between'>
        <p className='text-muted-foreground text-xs'>
          Você não precisa fornecer todos os tipos de dados para continuar.
        </p>

        <Button onClick={() => onComplete(true)} className='ml-auto'>
          Finalizar Coleta de Dados
        </Button>
      </div>
    </div>
  )
}
