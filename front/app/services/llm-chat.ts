import { httpClient } from '~/lib/httpClient'
import type {
  ChatMessage,
  ChatMessageRequest,
  ChatProgress,
  ChatResetRequest,
  ChatStateResponse,
  ChatStructuredData,
  StreamCallbacks,
  StreamMessageChunk,
} from '~/types/llm-chat'

/**
 * Send a message to LLM chat with streaming response
 */
export const sendMessageStream = async (
  request: ChatMessageRequest,
  callbacks: StreamCallbacks,
): Promise<void> => {
  try {
    const { step_id } = request

    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/llm-chat/message/stream?step_id=${step_id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(request),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Erro ao enviar mensagem')
    }

    if (!response.body) {
      throw new Error('Stream não disponível')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6) // Remove "data: "
              if (jsonStr.trim()) {
                const data: StreamMessageChunk = JSON.parse(jsonStr)

                switch (data.type) {
                  case 'message':
                    if (data.content && callbacks.onMessage) {
                      callbacks.onMessage(data.content)
                    }
                    break

                  case 'structured_data':
                    if (data.data && callbacks.onStructuredData) {
                      // Corrigido: Conversão segura para o tipo correto
                      callbacks.onStructuredData(data.data as unknown as ChatStructuredData)
                    }
                    break

                  case 'progress':
                    if (data.data && callbacks.onProgress) {
                      // Corrigido: Conversão segura para o tipo correto
                      callbacks.onProgress(data.data as unknown as ChatProgress)
                    }
                    break

                  case 'complete':
                    if (callbacks.onComplete) {
                      callbacks.onComplete(data.content)
                    }
                    return // Exit the function when complete

                  default:
                    console.warn('Unknown stream chunk type:', data.type)
                }
              }
            } catch (parseError) {
              console.warn('Failed to parse stream chunk:', parseError)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  } catch (error) {
    console.error('Stream error:', error)
    if (callbacks.onError) {
      callbacks.onError(error instanceof Error ? error.message : 'Erro desconhecido')
    }
  }
}

/**
 * Send a message to LLM chat without streaming (fallback)
 */
export const sendMessage = async (
  request: ChatMessageRequest,
): Promise<{
  message: string
  structured_data?: ChatStructuredData
  progress?: ChatProgress
}> => {
  // Corrigido: Usando request como Record<string, unknown> aqui
  const response = await httpClient.post<{
    message: string
    structured_data?: ChatStructuredData
    progress?: ChatProgress
  }>('/llm-chat/message', request as Record<string, unknown>)

  if (!response.success) {
    throw new Error(response.detail)
  }

  return response.data
}

/**
 * Get complete chat state
 */
export const getChatState = async (stepId: number): Promise<ChatStateResponse> => {
  const response = await httpClient.get<ChatStateResponse>('/llm-chat/state', {
    params: { step_id: stepId },
  })

  if (!response.success) {
    throw new Error(response.detail)
  }

  return response.data
}

/**
 * Get only structured data
 */
export const getStructuredData = async (stepId: number): Promise<ChatStructuredData> => {
  const response = await httpClient.get<ChatStructuredData>('/llm-chat/structured-data', {
    params: { step_id: stepId },
  })

  if (!response.success) {
    throw new Error(response.detail)
  }

  return response.data
}

/**
 * Get chat progress
 */
export const getChatProgress = async (stepId: number): Promise<ChatProgress> => {
  const response = await httpClient.get<ChatProgress>('/llm-chat/progress', {
    params: { step_id: stepId },
  })

  if (!response.success) {
    throw new Error(response.detail)
  }

  return response.data
}

/**
 * Reset chat conversation and structured data
 */
export const resetChat = async (request: ChatResetRequest): Promise<{ message: string }> => {
  // Corrigido: Usando request como Record<string, unknown> aqui
  const response = await httpClient.post<{ message: string }>(
    '/llm-chat/reset',
    request as Record<string, unknown>,
  )

  if (!response.success) {
    throw new Error(response.detail)
  }

  return response.data
}

/**
 * Get chat messages with pagination
 */
export const getChatMessages = async (
  stepId: number,
  limit: number = 50,
  offset: number = 0,
): Promise<ChatMessage[]> => {
  const response = await httpClient.get<ChatMessage[]>('/llm-chat/messages', {
    params: { step_id: stepId, limit, offset },
  })

  if (!response.success) {
    throw new Error(response.detail)
  }

  return response.data
}

/**
 * Helper function to format structured data for display
 */
export const formatStructuredDataSummary = (data: ChatStructuredData): string => {
  const sections = []

  if (data.imoveis.length > 0) {
    sections.push(`${data.imoveis.length} imóvel(s)`)
  }

  if (data.participacoes.length > 0) {
    sections.push(`${data.participacoes.length} participação(s) societária(s)`)
  }

  if (data.estrutura_familiar?.estado_civil || data.estrutura_familiar?.conjuge) {
    sections.push('estrutura familiar')
  }

  if (data.investimentos.length > 0) {
    sections.push(`${data.investimentos.length} investimento(s)`)
  }

  if (data.outros_ativos.length > 0) {
    sections.push(`${data.outros_ativos.length} outro(s) ativo(s)`)
  }

  return sections.length > 0 ? `Dados coletados: ${sections.join(', ')}` : 'Nenhum dado coletado'
}

/**
 * Helper function to check if structured data is complete
 */
export const isStructuredDataComplete = (progress: ChatProgress): boolean => {
  return progress.percentage >= 80 // Consider 80% or more as complete
}
