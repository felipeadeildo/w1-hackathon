import type {
  CreateHoldingInput,
  DocumentRequirement,
  Holding,
  HoldingStage,
} from '~/types/holding'
import { httpClient } from './httpClient'

export const getHoldings = async (): Promise<Holding[]> => {
  const res = await httpClient.get<Holding[]>('/holdings')
  if (!res.success) {
    throw new Error(res.detail)
  }
  return res.data
}

export const getHolding = async (holdingId: string): Promise<Holding> => {
  const res = await httpClient.get<Holding>(`/holdings/${holdingId}`)
  if (!res.success) {
    throw new Error(res.detail)
  }
  return res.data
}

export const getHoldingStages = async (holdingId: string): Promise<HoldingStage[]> => {
  const res = await httpClient.get<HoldingStage[]>(`/holdings/${holdingId}/stages`)
  if (!res.success) {
    throw new Error(res.detail)
  }
  return res.data
}

export const getStageRequirements = async (
  holdingId: string,
  stageId: string,
): Promise<DocumentRequirement[]> => {
  const res = await httpClient.get<DocumentRequirement[]>(
    `/holdings/${holdingId}/stages/${stageId}/requirements`,
  )
  if (!res.success) {
    throw new Error(res.detail)
  }
  return res.data
}

export const createHolding = async (input: CreateHoldingInput): Promise<Holding> => {
  const res = await httpClient.post<Holding>('/holdings', { ...input })
  if (!res.success) {
    throw new Error(res.detail)
  }
  return res.data
}
