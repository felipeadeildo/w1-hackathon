import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createHolding,
  getHolding,
  getHoldings,
  getHoldingStages,
  getStageRequirements,
} from '~/lib/holding'

export function useHoldings() {
  return useQuery({
    queryKey: ['holdings'],
    queryFn: getHoldings,
  })
}

export function useHolding(holdingId: string) {
  return useQuery({
    queryKey: ['holding', holdingId],
    queryFn: () => getHolding(holdingId),
    enabled: !!holdingId,
  })
}

export function useHoldingStages(holdingId: string) {
  return useQuery({
    queryKey: ['holdingStages', holdingId],
    queryFn: () => getHoldingStages(holdingId),
    enabled: !!holdingId,
  })
}

export function useStageRequirements(holdingId: string, stageId: string) {
  return useQuery({
    queryKey: ['stageRequirements', holdingId, stageId],
    queryFn: () => getStageRequirements(holdingId, stageId),
    enabled: !!holdingId && !!stageId,
  })
}

export function useCreateHolding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createHolding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holdings'] })
    },
  })
}
