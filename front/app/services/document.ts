import { httpClient } from '~/lib/httpClient'
import type {
  Document,
  DocumentRequirement,
  DocumentUpload,
  UploadProgressEvent,
} from '~/types/document'

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
  document: DocumentUpload & { file?: File }, // Add optional file property
  onProgress?: (event: UploadProgressEvent) => void,
): Promise<Document> => {
  // Create a FormData object to handle file upload
  const formData = new FormData()

  // Add all DocumentUpload fields to FormData
  Object.entries(document).forEach(([key, value]) => {
    if (key !== 'file' && value !== undefined) {
      formData.append(key, String(value))
    }
  })

  // If we have a file object, add it properly
  if (document.file) {
    formData.append('file', document.file, document.original_filename)
  }

  const options: RequestInit & { onUploadProgress?: (progressEvent: ProgressEvent) => void } = {}

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

  const response = await httpClient.post<Document>(
    `/documents/user-steps/${userStepId}/documents`,
    formData,
    options,
  )

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
 * Upload a document for a specific requirement with progress tracking
 * The backend will resolve the user_step for the current user
 */
export const uploadDocumentForRequirement = async (
  requirementId: string,
  document: DocumentUpload & { file?: File },
  onProgress?: (event: UploadProgressEvent) => void,
): Promise<Document> => {
  // Create a FormData object to handle file upload
  const formData = new FormData()

  // Add all DocumentUpload fields to FormData
  Object.entries(document).forEach(([key, value]) => {
    if (key !== 'file' && value !== undefined) {
      formData.append(key, String(value))
    }
  })

  // If we have a file object, add it properly
  if (document.file) {
    formData.append('file', document.file, document.original_filename)
  }

  const options: RequestInit & { onUploadProgress?: (progressEvent: ProgressEvent) => void } = {}

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

  const response = await httpClient.post<Document>(
    `/documents/requirements/${requirementId}`,
    formData,
    options,
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
