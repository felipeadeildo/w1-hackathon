import type { StepDataObject, UserOnboardingStep } from '~/types/onboarding'

interface DataStepProps {
  userStep: UserOnboardingStep
  onUpdateData: (data: StepDataObject) => Promise<void>
  onComplete: (isComplete: boolean) => Promise<void>
}

// eslint-disable-next-line no-empty-pattern
export const LLMChatStep = ({}: DataStepProps) => {
  return <div>LLMChatStep</div>
}
