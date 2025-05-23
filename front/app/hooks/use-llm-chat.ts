import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import {
  getChatMessages,
  getStructuredData,
  resetChat,
  sendMessageStream,
} from '~/services/llm-chat'
import type { ChatResetRequest } from '~/types/llm-chat'

/**
 * Hook to fetch only structured data for a specific step
 */
export function useChatStructuredData(stepId: number) {
  return useQuery({
    queryKey: ['chatStructuredData', stepId],
    queryFn: () => getStructuredData(stepId),
    enabled: !!stepId,
  })
}

/**
 * Hook to fetch chat messages for a specific step
 */
export function useChatMessages(stepId: number, limit: number = 50, offset: number = 0) {
  return useQuery({
    queryKey: ['chatMessages', stepId, limit, offset],
    queryFn: () => getChatMessages(stepId, limit, offset),
    enabled: !!stepId,
  })
}

/**
 * Hook for resetting chat conversation
 */
export function useResetChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: ChatResetRequest) => resetChat(request),
    onSuccess: (_, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['chatStructuredData', variables.step_id] })
      queryClient.invalidateQueries({ queryKey: ['chatMessages', variables.step_id] })
    },
  })
}

/**
 * Enhanced hook for streaming chat messages with full state management
 * Handles all streaming scenarios and provides a rich set of state and handlers
 */
export function useChatMessageStream(stepId: number) {
  const queryClient = useQueryClient()
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [currentMessage, setCurrentMessage] = useState('')

  // Reset stream state
  const resetStreamState = useCallback(() => {
    setIsStreaming(false)
    setStreamError(null)
    setCurrentMessage('')
  }, [])

  // Send a message with streaming response
  const sendStreamMessage = useCallback(
    async (message: string): Promise<void> => {
      resetStreamState()
      setIsStreaming(true)

      try {
        await sendMessageStream(
          { message, step_id: stepId },
          {
            onMessage: (content) => {
              setCurrentMessage((prev) => prev + content)
            },
            onComplete: () => {
              setIsStreaming(false)
              queryClient.invalidateQueries({ queryKey: ['chatStructuredData', stepId] })
              queryClient.invalidateQueries({ queryKey: ['chatMessages', stepId] })
            },
            onError: (error) => {
              setStreamError(error)
              setIsStreaming(false)
            },
          },
        )
      } catch (error) {
        setStreamError(error instanceof Error ? error.message : 'Unknown error')
        setIsStreaming(false)
      }
    },
    [stepId, queryClient, resetStreamState],
  )

  useEffect(() => {
    return () => {
      resetStreamState()
    }
  }, [stepId, resetStreamState])

  return {
    sendStreamMessage,
    isStreaming,
    streamError,
    currentMessage,
    resetStreamState,
  }
}
