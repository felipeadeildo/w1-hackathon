import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getDocument, getRequirementDocuments, uploadDocument } from '~/lib/document'

export function useRequirementDocuments(holdingId: string, requirementId: string) {
  return useQuery({
    queryKey: ['requirementDocuments', holdingId, requirementId],
    queryFn: () => getRequirementDocuments(holdingId, requirementId),
    enabled: !!holdingId && !!requirementId,
  })
}

export function useDocument(documentId: string) {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: () => getDocument(documentId),
    enabled: !!documentId,
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { holdingId: string; requirementId: string; file: File }) =>
      uploadDocument(params.holdingId, params.requirementId, params.file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['requirementDocuments', variables.holdingId, variables.requirementId],
      })
    },
  })
}
