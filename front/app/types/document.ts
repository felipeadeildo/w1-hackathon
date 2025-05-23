import type { UUID } from 'crypto'

export type DocumentStatus = 'uploaded' | 'validated' | 'invalid' | 'pending_review'

export interface DocumentRequirement {
  id: UUID
  step_id: number
  name: string
  description: string
  doc_type: string
  is_required: boolean
  created_by_type: string
  created_by_user_id: number
  priority: number
  reason: string | null
}

export interface Document {
  id: UUID
  user_step_id: number
  requirement_id: UUID
  file_path: string
  original_filename: string
  file_type: string
  file_size: number
  content_type: string
  uploaded_by_id: number
  uploaded_at: string
  status: DocumentStatus
  status_reason: string | null
  last_validated_at: string | null
}
export interface UploadProgressEvent {
  loaded: number
  total: number
  progress: number
}
