export interface Holding {
  id: string
  name: string
  status: string
  client_id: string
  consultant_id?: string
  created_at: string
  updated_at: string
}

export interface HoldingStage {
  id: string
  name: string
  description: string
  order: number
  status: string
  stage_type: string
  start_date?: string
  end_date?: string
}

export interface DocumentRequirement {
  id: string
  name: string
  description: string
  doc_type: string
  is_required: boolean
  status?: string
}
