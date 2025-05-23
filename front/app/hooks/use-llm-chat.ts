import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import {
  getChatMessages,
  getChatProgress,
  getChatState,
  getStructuredData,
  resetChat,
  sendMessage,
  sendMessageStream,
} from '~/services/llm-chat'
import type {
  ChatMessageRequest,
  ChatProgress,
  ChatResetRequest,
  ChatStructuredData,
} from '~/types/llm-chat'

/**
 * Hook to fetch complete chat state for a specific step
 */
export function useChatState(stepId: number) {
  return useQuery({
    queryKey: ['chatState', stepId],
    queryFn: () => getChatState(stepId),
    enabled: !!stepId,
  })
}

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
 * Hook to fetch chat progress for a specific step
 */
export function useChatProgress(stepId: number) {
  return useQuery({
    queryKey: ['chatProgress', stepId],
    queryFn: () => getChatProgress(stepId),
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
 * Hook for sending a message without streaming
 * This is useful as a fallback when streaming is not supported
 */
export function useSendChatMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: ChatMessageRequest) => sendMessage(request),
    onSuccess: (_, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['chatState', variables.step_id] })
      queryClient.invalidateQueries({ queryKey: ['chatStructuredData', variables.step_id] })
      queryClient.invalidateQueries({ queryKey: ['chatProgress', variables.step_id] })
      queryClient.invalidateQueries({ queryKey: ['chatMessages', variables.step_id] })
    },
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
      queryClient.invalidateQueries({ queryKey: ['chatState', variables.step_id] })
      queryClient.invalidateQueries({ queryKey: ['chatStructuredData', variables.step_id] })
      queryClient.invalidateQueries({ queryKey: ['chatProgress', variables.step_id] })
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
  const [structuredData, setStructuredData] = useState<ChatStructuredData | null>(null)
  const [progress, setProgress] = useState<ChatProgress | null>(null)

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
            onStructuredData: (data) => {
              setStructuredData(data)
            },
            onProgress: (data) => {
              setProgress(data)
            },
            onComplete: () => {
              setIsStreaming(false)
              // Invalidate all related queries to ensure we have the latest data
              queryClient.invalidateQueries({ queryKey: ['chatState', stepId] })
              queryClient.invalidateQueries({ queryKey: ['chatStructuredData', stepId] })
              queryClient.invalidateQueries({ queryKey: ['chatProgress', stepId] })
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

  // Cleanup on unmount or step change
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
    structuredData,
    progress,
    resetStreamState,
  }
}

/**
 * Comprehensive hook that combines state and streaming capabilities
 * This provides a complete solution for chat interaction
 */
export function useLLMChat(stepId: number) {
  const { data: chatState, isLoading: isLoadingState } = useChatState(stepId)
  const { data: chatProgress, isLoading: isLoadingProgress } = useChatProgress(stepId)
  const {
    sendStreamMessage,
    isStreaming,
    streamError,
    currentMessage,
    structuredData: streamStructuredData,
    progress: streamProgress,
    resetStreamState,
  } = useChatMessageStream(stepId)
  const resetChatMutation = useResetChat()
  const sendMessageMutation = useSendChatMessage()

  // Merged state that combines API data with stream data
  const mergedStructuredData = streamStructuredData || chatState?.structured_data || null
  const mergedProgress = streamProgress || chatProgress || null

  // Check if everything is loading
  const isLoading = isLoadingState || isLoadingProgress || isStreaming

  // Handler to reset chat
  const handleResetChat = useCallback(async () => {
    resetStreamState()
    await resetChatMutation.mutateAsync({ step_id: stepId })
  }, [resetChatMutation, stepId, resetStreamState])

  // Handler to send message with fallback to non-streaming version
  const handleSendMessage = useCallback(
    async (message: string, useStream: boolean = true) => {
      if (useStream) {
        await sendStreamMessage(message)
      } else {
        await sendMessageMutation.mutateAsync({ message, step_id: stepId })
      }
    },
    [sendStreamMessage, sendMessageMutation, stepId],
  )

  return {
    // State
    chatState,
    messages: chatState?.messages || [],
    structuredData: mergedStructuredData,
    progress: mergedProgress,
    isCompleted: chatState?.is_completed || false,
    conversationId: chatState?.conversation_id || null,

    // Stream specific state
    isStreaming,
    streamError,
    currentMessage,

    // Loading states
    isLoading,
    isResetting: resetChatMutation.isPending,
    isSending: sendMessageMutation.isPending,

    // Actions
    sendMessage: handleSendMessage,
    resetChat: handleResetChat,
  }
}

/**
 * Hook to check if structured data is complete enough
 * using the progress information
 */
export function useIsChatDataComplete(stepId: number) {
  const { data: progress } = useChatProgress(stepId)

  return {
    isComplete: progress ? progress.percentage >= 80 : false,
    percentage: progress?.percentage || 0,
    missingData: progress?.missing_data || [],
  }
}
