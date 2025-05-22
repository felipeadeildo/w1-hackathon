import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createStepDocumentRequirement,
  getDocumentById,
  getDocumentsForRequirement,
  getStepDocumentRequirements,
  getUserStepDocument,
  getUserStepDocuments,
  uploadDocumentForRequirement,
  uploadUserStepDocument,
} from '~/services/document'
import type { DocumentRequirement, DocumentUpload, UploadProgressEvent } from '~/types/document'

/**
 * Hook to fetch document requirements for a specific step
 */
export function useStepDocumentRequirements(stepId: number) {
  return useQuery({
    queryKey: ['documentRequirements', stepId],
    queryFn: () => getStepDocumentRequirements(stepId),
    enabled: !!stepId,
  })
}

/**
 * Hook to create a document requirement for a step (admin only)
 */
export function useCreateStepDocumentRequirement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: {
      stepId: number
      requirement: Omit<
        DocumentRequirement,
        'id' | 'step_id' | 'created_by_user_id' | 'created_by_type' | 'priority' | 'reason'
      >
    }) => createStepDocumentRequirement(params.stepId, params.requirement),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documentRequirements', variables.stepId] })
    },
  })
}

/**
 * Hook to fetch documents for a user's onboarding step
 */
export function useUserStepDocuments(userStepId: number) {
  return useQuery({
    queryKey: ['userStepDocuments', userStepId],
    queryFn: () => getUserStepDocuments(userStepId),
    enabled: !!userStepId,
  })
}

/**
 * Hook to fetch a specific document for a user's onboarding step
 */
export function useUserStepDocument(userStepId: number, documentId: string) {
  return useQuery({
    queryKey: ['userStepDocument', userStepId, documentId],
    queryFn: () => getUserStepDocument(userStepId, documentId),
    enabled: !!userStepId && !!documentId,
  })
}

/**
 * Hook for uploading a document for a user's onboarding step with progress tracking
 */
export function useUploadUserStepDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: {
      userStepId: number
      document: DocumentUpload & { file?: File }
      onProgress?: (event: UploadProgressEvent) => void
    }) => uploadUserStepDocument(params.userStepId, params.document, params.onProgress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userStepDocuments', variables.userStepId] })
      queryClient.invalidateQueries({ queryKey: ['onboardingStep', variables.userStepId] })
      queryClient.invalidateQueries({ queryKey: ['onboardingFlow'] })
    },
  })
}

/**
 * Hook for uploading a document for a specific requirement with progress tracking
 */
export function useUploadDocumentForRequirement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: {
      requirementId: string
      document: DocumentUpload & { file?: File }
      onProgress?: (event: UploadProgressEvent) => void
    }) => uploadDocumentForRequirement(params.requirementId, params.document, params.onProgress),
    onSuccess: (document) => {
      // Since we don't know the userStepId beforehand (backend resolves it),
      // we need to invalidate queries more broadly
      queryClient.invalidateQueries({ queryKey: ['userStepDocuments'] })
      queryClient.invalidateQueries({ queryKey: ['documentRequirements'] })
      queryClient.invalidateQueries({ queryKey: ['onboardingFlow'] })
      queryClient.invalidateQueries({ queryKey: ['document', document.requirement_id] })
    },
  })
}

/**
 * Hook to fetch all documents for a specific requirement
 */
export function useDocumentsForRequirement(requirementId: string) {
  return useQuery({
    queryKey: ['document', requirementId],
    queryFn: () => getDocumentsForRequirement(requirementId),
    enabled: !!requirementId,
  })
}

/**
 * Hook to fetch a document by ID
 */
export function useDocument(documentId: string) {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: () => getDocumentById(documentId),
    enabled: !!documentId,
  })
}
