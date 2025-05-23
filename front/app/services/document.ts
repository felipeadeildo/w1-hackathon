import { httpClient } from '~/lib/httpClient'
import type { Document, DocumentRequirement, UploadProgressEvent } from '~/types/document'

/**
 * Get document requirements for a specific onboarding step
 */
export const getStepDocumentRequirements = async (
  stepId: number,
): Promise<DocumentRequirement[]> => {
  const response = await httpClient.get<DocumentRequirement[]>(
    `/documents/steps/${stepId}/requirements`,
  )
  if (!response.success) {
    throw new Error(response.detail)
  }
  return response.data
}

/**
 * Create a document requirement for a step (admin only)
 */
export const createStepDocumentRequirement = async (
  stepId: number,
  requirement: Omit<
    DocumentRequirement,
    'id' | 'step_id' | 'created_by_user_id' | 'created_by_type' | 'priority' | 'reason'
  >,
): Promise<DocumentRequirement> => {
  const response = await httpClient.post<DocumentRequirement>(
    `/documents/steps/${stepId}/requirements`,
    requirement,
  )
  if (!response.success) {
    throw new Error(response.detail)
  }
  return response.data
}

/**
 * Get documents uploaded for a user's onboarding step
 */
export const getUserStepDocuments = async (userStepId: number): Promise<Document[]> => {
  const response = await httpClient.get<Document[]>(`/documents/user-steps/${userStepId}/documents`)
  if (!response.success) {
    throw new Error(response.detail)
  }
  return response.data
}

/**
 * Upload a document for a user's onboarding step with progress tracking
 */
export const uploadUserStepDocument = async (
  userStepId: number,
  requirementId: string,
  file: File,
  onProgress?: (event: UploadProgressEvent) => void,
): Promise<Document> => {
  // Create a FormData object to handle file upload
  const formData = new FormData()
  formData.append('file', file)

  // Configure the upload options
  const options: RequestInit & {
    onUploadProgress?: (progressEvent: ProgressEvent) => void
    headers?: Record<string, string>
  } = {
    // Don't set Content-Type header - browser will automatically set it with correct boundary
    headers: {
      // Remove any content-type header that might interfere with the multipart/form-data
    },
  }

  // Add progress tracking if callback is provided
  if (onProgress) {
    options.onUploadProgress = (progressEvent: ProgressEvent) => {
      onProgress({
        loaded: progressEvent.loaded,
        total: progressEvent.total,
        progress: progressEvent.loaded / progressEvent.total,
      })
    }
  }

  // Use query parameter for requirement_id
  const url = `/documents/user-steps/${userStepId}/documents?requirement_id=${encodeURIComponent(
    requirementId,
  )}`

  // Make sure httpClient doesn't try to JSON.stringify the FormData
  const response = await httpClient.post<Document>(url, formData, options)

  if (!response.success) {
    throw new Error(response.detail)
  }

  return response.data
}

/**
 * Get a specific document for a user's onboarding step
 */
export const getUserStepDocument = async (
  userStepId: number,
  documentId: string,
): Promise<Document> => {
  const response = await httpClient.get<Document>(
    `/documents/user-steps/${userStepId}/documents/${documentId}`,
  )
  if (!response.success) {
    throw new Error(response.detail)
  }
  return response.data
}

/**
 * Get all documents for a specific requirement
 */
export const getDocumentsForRequirement = async (requirementId: string): Promise<Document[]> => {
  const response = await httpClient.get<Document[]>(`/documents/requirements/${requirementId}`)
  if (!response.success) {
    throw new Error(response.detail)
  }
  return response.data
}

/**
 * Get document details by ID
 */
export const getDocumentById = async (documentId: string): Promise<Document> => {
  const response = await httpClient.get<Document>(`/documents/${documentId}`)
  if (!response.success) {
    throw new Error(response.detail)
  }
  return response.data
}
