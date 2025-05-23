import { RefreshCcw, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useChatMessages, useChatMessageStream, useResetChat } from '~/hooks/use-llm-chat'
import type { UserOnboardingStep } from '~/types/onboarding'
import { MessageBubble } from './message-bubble'
import { TypingIndicator } from './typing-indicator'

interface ChatInterfaceProps {
  userStep: UserOnboardingStep
}

export function ChatInterface({ userStep }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: messages = [] } = useChatMessages(userStep.step_id)
  const { currentMessage, sendStreamMessage, isStreaming } = useChatMessageStream(userStep.step_id)

  const { mutate: resetChatMutation } = useResetChat()

  const onResetChat = () => {
    resetChatMutation({ step_id: userStep.step_id })
    setInputValue('')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentMessage])

  const handleSend = async () => {
    if (inputValue.trim() && !isStreaming) {
      const message = inputValue.trim()
      setInputValue('')
      await sendStreamMessage(message)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Chat Header */}
      <div className='p-3 border-b bg-muted/20 flex items-center justify-between'>
        <div>
          <h3 className='font-medium'>Assistente W1</h3>
          <p className='text-xs text-muted-foreground'>
            Coletando informações para estruturação patrimonial
          </p>
        </div>
        <Button
          variant='ghost'
          size='sm'
          onClick={onResetChat}
          disabled={isStreaming}
          title='Reiniciar conversa'
        >
          <RefreshCcw className='h-4 w-4 mr-1' />
          Reiniciar
        </Button>
      </div>

      {/* Messages - Using ScrollArea for better scrolling */}
      <ScrollArea className='flex-1'>
        <div className='p-3 space-y-3'>
          {messages.length === 0 ? (
            <div className='h-full flex items-center justify-center text-center p-4'>
              <div className='max-w-sm'>
                <h3 className='font-medium text-lg mb-2'>Bem-vindo à coleta de dados</h3>
                <p className='text-muted-foreground text-sm mb-3'>
                  Converse com o assistente para estruturar seu patrimônio. Quanto mais detalhes
                  você fornecer, melhor será a análise.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {/* Show streaming message if applicable */}
              {isStreaming && currentMessage && (
                <MessageBubble
                  message={{
                    id: 'streaming',
                    content: currentMessage,
                    sender_type: 'llm',
                    created_at: new Date().toISOString(),
                  }}
                  isStreaming
                />
              )}

              {/* Show typing indicator during initial streaming phase */}
              {isStreaming && !currentMessage && <TypingIndicator />}
            </>
          )}

          {/* Empty div for scroll reference */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className='p-3 border-t bg-background'>
        <div className='flex space-x-2'>
          <Input
            ref={inputRef}
            placeholder='Digite sua mensagem...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            className='flex-1'
          />
          <Button onClick={handleSend} disabled={!inputValue.trim() || isStreaming}>
            <Send className='h-4 w-4' />
            <span className='sr-only'>Enviar</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
