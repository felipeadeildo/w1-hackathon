import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className='flex items-start gap-3 max-w-3xl mr-auto'>
      {/* Avatar */}
      <div className='flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground'>
        <Bot className='h-4 w-4' />
      </div>

      {/* Typing indicator */}
      <div className='rounded-lg p-3 bg-muted text-foreground rounded-tl-none'>
        <div className='flex space-x-1 items-center h-6'>
          <div className='w-2 h-2 bg-foreground/50 rounded-full animate-bounce'></div>
          <div
            className='w-2 h-2 bg-foreground/50 rounded-full animate-bounce'
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className='w-2 h-2 bg-foreground/50 rounded-full animate-bounce'
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  )
}
