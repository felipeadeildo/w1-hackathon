export enum OnboardingStepType {
  PERSONAL_DATA = 'personal_data',
  LLM_CHAT = 'llm_chat',
  DATA_VERIFICATION = 'data_verification',
}

// Generic recursive type for form data or structured information
export type StepDataValue =
  | string
  | number
  | boolean
  | null
  | StepDataObject
  | Array<string | number | boolean | null | StepDataObject>

export interface StepDataObject {
  [key: string]: StepDataValue
}

export interface OnboardingStep {
  id: number
  name: string
  description: string
  order: number
  type: OnboardingStepType
}

export interface OnboardingFlow {
  id: number
  name: string
  description: string
  created_at: string
  steps: OnboardingStep[]
}

export interface UserOnboardingStep {
  id: number
  step_id: number
  is_completed: boolean
  started_at: string | null
  completed_at: string | null
  data: StepDataObject | null
  step: OnboardingStep
}

export interface UserOnboardingFlow {
  id: number
  flow_id: number
  is_completed: boolean
  started_at: string
  completed_at: string | null
  flow: OnboardingFlow
  user_steps: UserOnboardingStep[]
}

export interface StepDataUpdate {
  data: StepDataObject
}

export interface StepStatusUpdate {
  is_completed: boolean
}
