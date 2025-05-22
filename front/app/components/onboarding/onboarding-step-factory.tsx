import { useUpdateStepData, useUpdateStepStatus } from '~/hooks/use-onboarding'
import {
  OnboardingStepType,
  type StepDataObject,
  type UserOnboardingStep,
} from '~/types/onboarding'
import { DocumentVerificationStep } from './steps/document-verification-step'
import { LLMChatStep } from './steps/llm-chat-step'
import { PersonalDataStep } from './steps/personal-data-step'

interface OnboardingStepFactoryProps {
  userStep: UserOnboardingStep
  onComplete: () => void
}

export function OnboardingStepFactory({ userStep, onComplete }: OnboardingStepFactoryProps) {
  const { mutateAsync: updateData } = useUpdateStepData()
  const { mutateAsync: updateStatus } = useUpdateStepStatus()

  const handleUpdateData = async (data: StepDataObject) => {
    await updateData({ userStepId: userStep.id, data })
  }

  const handleComplete = async (isComplete: boolean = true) => {
    await updateStatus({ userStepId: userStep.id, isCompleted: isComplete })
    if (isComplete) {
      onComplete()
    }
  }

  // Factory pattern - return the appropriate component based on step type
  switch (userStep.step.type) {
    case OnboardingStepType.PERSONAL_DATA:
      return (
        <PersonalDataStep
          userStep={userStep}
          onUpdateData={handleUpdateData}
          onComplete={handleComplete}
        />
      )
    case OnboardingStepType.LLM_CHAT:
      return (
        <LLMChatStep
          userStep={userStep}
          onUpdateData={handleUpdateData}
          onComplete={handleComplete}
        />
      )
    case OnboardingStepType.DATA_VERIFICATION:
      return (
        <DocumentVerificationStep
          userStep={userStep}
          onUpdateData={handleUpdateData}
          onComplete={handleComplete}
        />
      )
    default:
      return (
        <div className='p-4 text-center'>
          <p>Tipo de etapa desconhecido</p>
        </div>
      )
  }
}
