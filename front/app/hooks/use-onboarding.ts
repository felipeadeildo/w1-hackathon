import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getCurrentActiveStep,
  getCurrentOnboardingFlow,
  getOnboardingStep,
  updateStepData,
  updateStepStatus,
} from '~/lib/onboarding'
import type { StepDataObject } from '~/types/onboarding'

/**
 * Hook to fetch the current user's onboarding flow
 */
export function useOnboardingFlow() {
  return useQuery({
    queryKey: ['onboardingFlow'],
    queryFn: getCurrentOnboardingFlow,
  })
}

/**
 * Hook to fetch a specific onboarding step
 */
export function useOnboardingStep(stepId: number) {
  return useQuery({
    queryKey: ['onboardingStep', stepId],
    queryFn: () => getOnboardingStep(stepId),
    enabled: !!stepId,
  })
}

/**
 * Hook to get the current active step (first incomplete step)
 */
export function useCurrentActiveStep() {
  return useQuery({
    queryKey: ['onboardingActiveStep'],
    queryFn: getCurrentActiveStep,
  })
}

/**
 * Hook for updating onboarding step data
 */
export function useUpdateStepData() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { userStepId: number; data: StepDataObject }) =>
      updateStepData(params.userStepId, params.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['onboardingStep', variables.userStepId] })
      queryClient.invalidateQueries({ queryKey: ['onboardingFlow'] })
      queryClient.invalidateQueries({ queryKey: ['onboardingActiveStep'] })
    },
  })
}

/**
 * Hook for updating onboarding step status (marking as complete/incomplete)
 */
export function useUpdateStepStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { userStepId: number; isCompleted: boolean }) =>
      updateStepStatus(params.userStepId, params.isCompleted),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['onboardingStep', variables.userStepId] })
      queryClient.invalidateQueries({ queryKey: ['onboardingFlow'] })
      queryClient.invalidateQueries({ queryKey: ['onboardingActiveStep'] })
    },
  })
}
