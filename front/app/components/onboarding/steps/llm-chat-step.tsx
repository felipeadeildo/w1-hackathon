import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { useIsChatDataComplete, useLLMChat } from '~/hooks/use-llm-chat'
import type { StepDataObject, UserOnboardingStep } from '~/types/onboarding'
import { ChatInterface } from '../chat/chat-interface'
import { StructuredDataDisplay } from '../structured-data/structured-data-display'

interface LLMChatStepProps {
  userStep: UserOnboardingStep
  onUpdateData: (data: StepDataObject) => Promise<void>
  onComplete: (isComplete: boolean) => Promise<void>
}

export const LLMChatStep = ({ userStep, onUpdateData, onComplete }: LLMChatStepProps) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const {
    messages,
    structuredData,
    progress,
    sendMessage,
    resetChat,
    isLoading,
    isStreaming,
    currentMessage,
  } = useLLMChat(userStep.step_id)

  const { isComplete, percentage, missingData } = useIsChatDataComplete(userStep.step_id)

  const handleSendMessage = async (message: string) => {
    await sendMessage(message)

    // After sending, save any updated data to the onboarding step
    if (structuredData) {
      await onUpdateData(structuredData as unknown as StepDataObject)
    }
  }

  const handleCompleteStep = async () => {
    setIsCompleting(true)

    try {
      // Save the final data before completing
      if (structuredData) {
        await onUpdateData(structuredData as unknown as StepDataObject)
      }
      await onComplete(true)
    } finally {
      setIsCompleting(false)
    }
  }

  const handleResetChat = async () => {
    await resetChat()
  }

  return (
    <div className='flex flex-col h-[700px]'>
      <div className='flex-1 flex flex-col md:flex-row gap-4 overflow-hidden'>
        {/* Chat Interface */}
        <div className='flex-1 min-w-0 flex flex-col border rounded-lg overflow-hidden'>
          <ChatInterface
            messages={messages}
            isStreaming={isStreaming}
            currentMessage={currentMessage}
            onSendMessage={handleSendMessage}
            onResetChat={handleResetChat}
            isLoading={isLoading}
          />
        </div>

        {/* Structured Data Display */}
        <div className='flex-1 min-w-0 border rounded-lg overflow-hidden'>
          <StructuredDataDisplay structuredData={structuredData} progress={progress} />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className='mt-6 flex items-center justify-between'>
        <div className='text-sm'>
          {isComplete ? (
            <div className='text-green-600 font-medium'>
              ✓ Dados suficientes coletados ({percentage}%)
            </div>
          ) : (
            <div className='text-amber-600'>
              {percentage}% completo - Faltam: {missingData.join(', ')}
            </div>
          )}
        </div>

        <Button
          onClick={handleCompleteStep}
          disabled={!isComplete || isCompleting}
          className='ml-auto'
        >
          {isCompleting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {isComplete ? 'Finalizar Coleta de Dados' : 'Continuar Coletando Dados'}
        </Button>
      </div>
    </div>
  )
}
