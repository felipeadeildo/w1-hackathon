import type { Document } from '~/types/document'
import { httpClient } from './httpClient'

export const getRequirementDocuments = async (
  holdingId: string,
  requirementId: string,
): Promise<Document[]> => {
  const res = await httpClient.get<Document[]>(
    `/holdings/${holdingId}/requirements/${requirementId}/documents`,
  )
  if (!res.success) throw new Error(res.detail)
  return res.data
}

export const uploadDocument = async (
  holdingId: string,
  requirementId: string,
  file: File,
): Promise<Document> => {
  const formData = new FormData()
  formData.append('holding_id', holdingId)
  formData.append('requirement_id', requirementId)
  formData.append('file', file)
  // Adapte os campos conforme o backend espera
  const res = await httpClient.post<Document>('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  if (!res.success) throw new Error(res.detail)
  return res.data
}

export const getDocument = async (documentId: string): Promise<Document> => {
  const res = await httpClient.get<Document>(`/documents/${documentId}`)
  if (!res.success) throw new Error(res.detail)
  return res.data
}
