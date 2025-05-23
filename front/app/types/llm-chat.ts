export interface ImovelData {
  tipo: string
  localizacao: string
  valor_estimado?: number
  valor_estimado_str?: string
  status: string
  renda_mensal?: number
  renda_mensal_str?: string
  area?: string
  data_aquisicao?: string
  observacoes?: string
}

export interface ParticipacaoSocietariaData {
  empresa: string
  segmento: string
  participacao: string
  faturamento_anual?: string
  cnpj?: string
  posicao?: string
  data_criacao?: string
  observacoes?: string
}

export interface MembroFamiliaData {
  nome: string
  parentesco: string
  idade?: number
  ocupacao?: string
  cpf?: string
  observacoes?: string
}

export interface EstruturaFamiliarData {
  estado_civil?: string
  regime_bens?: string
  conjuge?: MembroFamiliaData
  filhos: MembroFamiliaData[]
  outros_dependentes: MembroFamiliaData[]
  observacoes?: string
}

export interface InvestimentoData {
  tipo: string
  valor?: number
  valor_str?: string
  detalhes?: string
  instituicao?: string
  data_aplicacao?: string
  observacoes?: string
}

export interface OutroAtivoData {
  tipo: string
  descricao: string
  valor?: number
  valor_str?: string
  observacoes?: string
}

export interface ChatStructuredData {
  imoveis: ImovelData[]
  participacoes: ParticipacaoSocietariaData[]
  estrutura_familiar?: EstruturaFamiliarData
  investimentos: InvestimentoData[]
  outros_ativos: OutroAtivoData[]
}

// === INTERFACES PARA MENSAGENS ===

export interface ChatMessage {
  id: string
  sender_type: 'user' | 'llm' | 'system' | 'consultant'
  content: string
  created_at: string
}

// === INTERFACES PARA PROGRESSO ===

export interface ChatProgress {
  completed_sections: number
  total_sections: number
  percentage: number
  missing_data: string[]
}

// === INTERFACES PARA REQUESTS ===

export interface ChatMessageRequest extends Record<string, unknown> {
  message: string
  step_id: number
}

export interface ChatResetRequest extends Record<string, unknown> {
  step_id: number
}

export interface ChatStateResponse {
  conversation_id: string | null
  messages: ChatMessage[]
  structured_data: ChatStructuredData
  progress: ChatProgress
  is_completed: boolean
}

export type StreamMessageChunkType = 'message' | 'structured_data' | 'progress' | 'complete'

export interface StreamMessageChunk {
  type: StreamMessageChunkType
  content?: string
  data?: Record<string, unknown>
}

export interface StreamCallbacks {
  onMessage?: (content: string) => void
  onStructuredData?: (data: ChatStructuredData) => void
  onProgress?: (progress: ChatProgress) => void
  onComplete?: (finalContent?: string) => void
  onError?: (error: string) => void
}
