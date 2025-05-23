import { Bot, User } from 'lucide-react'
import { cn } from '~/lib/utils'
import type { ChatMessage } from '~/types/llm-chat'

interface MessageBubbleProps {
  message: ChatMessage
  isStreaming?: boolean
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  // Format the timestamp
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  const isUser = message.sender_type === 'user'

  return (
    <div
      className={cn(
        'flex items-start gap-2 max-w-[90%]',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto',
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
        )}
      >
        {isUser ? <User className='h-3.5 w-3.5' /> : <Bot className='h-3.5 w-3.5' />}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          'rounded-lg py-2 px-3 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-none'
            : 'bg-muted text-foreground rounded-tl-none',
          isStreaming && 'animate-pulse',
        )}
      >
        <p className='whitespace-pre-wrap'>{message.content}</p>
        <p
          className={cn(
            'text-[10px] mt-1',
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground',
          )}
        >
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  )
}
