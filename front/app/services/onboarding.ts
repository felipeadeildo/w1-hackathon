import { httpClient } from '~/lib/httpClient'
import type { StepDataObject, UserOnboardingFlow, UserOnboardingStep } from '~/types/onboarding'

/**
 * Get the current user's onboarding flow with all steps
 */
export const getCurrentOnboardingFlow = async (): Promise<UserOnboardingFlow> => {
  const response = await httpClient.get<UserOnboardingFlow>('/onboarding/flow')
  if (!response.success) {
    throw new Error(response.detail)
  }
  return response.data
}

/**
 * Get a specific step from the user's onboarding flow
 */
export const getOnboardingStep = async (stepId: number): Promise<UserOnboardingStep> => {
  const response = await httpClient.get<UserOnboardingStep>(`/onboarding/step/${stepId}`)
  if (!response.success) {
    throw new Error(response.detail)
  }
  return response.data
}

/**
 * Update the data for a specific onboarding step
 * This can be used to save form data, LLM chat results, etc.
 */
export const updateStepData = async (
  userStepId: number,
  data: StepDataObject,
): Promise<UserOnboardingStep> => {
  const response = await httpClient.patch<UserOnboardingStep>(
    `/onboarding/step/${userStepId}/data`,
    { data },
  )
  if (!response.success) {
    throw new Error(response.detail)
  }
  return response.data
}

/**
 * Mark a step as completed or not completed
 */
export const updateStepStatus = async (
  userStepId: number,
  isCompleted: boolean,
): Promise<UserOnboardingStep> => {
  const response = await httpClient.patch<UserOnboardingStep>(
    `/onboarding/step/${userStepId}/status`,
    { is_completed: isCompleted },
  )
  if (!response.success) {
    throw new Error(response.detail)
  }
  return response.data
}

/**
 * Helper function to get the current active step (first incomplete step)
 * or the last step if all are complete
 */
export const getCurrentActiveStep = async (): Promise<UserOnboardingStep | null> => {
  const flow = await getCurrentOnboardingFlow()

  // Sort steps by order
  const sortedSteps = [...flow.user_steps].sort((a, b) => a.step.order - b.step.order)

  // Find first incomplete step
  const currentStep = sortedSteps.find((step) => !step.is_completed)

  // If all steps are complete, return the last one
  return currentStep || sortedSteps[sortedSteps.length - 1] || null
}
