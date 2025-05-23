import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className='flex items-start gap-2 max-w-[90%] mr-auto'>
      {/* Avatar */}
      <div className='flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-muted text-muted-foreground'>
        <Bot className='h-3.5 w-3.5' />
      </div>

      {/* Typing indicator */}
      <div className='rounded-lg py-2 px-3 bg-muted text-foreground rounded-tl-none'>
        <div className='flex space-x-1 items-center h-5'>
          <div className='w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce'></div>
          <div
            className='w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce'
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className='w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce'
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  )
}
