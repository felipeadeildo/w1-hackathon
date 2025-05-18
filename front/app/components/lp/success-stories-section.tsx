import { Star, UserCheck } from 'lucide-react'

export const SuccessStoriesSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id='success-stories' className='py-16 scroll-mt-16'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-8'>
          <div className='flex justify-center gap-4 mb-4'>
            <UserCheck className='h-8 w-8 text-primary' />
            <Star className='h-8 w-8 text-primary' />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
