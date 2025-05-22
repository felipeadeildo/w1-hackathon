import { Loader2, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'

interface FileUploadProps {
  onUploadComplete: (url: string) => void
  fileType?: 'image' | 'document' | 'any'
  buttonText?: React.ReactNode
  existingUrl?: string
}

export function FileUpload({
  onUploadComplete,
  fileType = 'any',
  buttonText,
  existingUrl,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  // Mock file upload function - in a real app, replace with actual upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a fake URL that would actually come from your API
      const fakeUrl = URL.createObjectURL(file)

      // In a real app, you'd upload to your server and get back a URL
      onUploadComplete(fakeUrl)
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setIsUploading(false)
    }
  }

  // Determine accept attribute based on fileType
  const getAccept = () => {
    switch (fileType) {
      case 'image':
        return 'image/*'
      case 'document':
        return '.pdf,.doc,.docx,.png,.jpg,.jpeg'
      default:
        return undefined
    }
  }

  // If there's an existing URL, show the file
  if (existingUrl) {
    return (
      <div className='flex items-center gap-2'>
        <div className='flex-1 truncate'>
          {fileType === 'image' ? (
            <img
              src={existingUrl}
              alt='Uploaded file'
              className='h-20 w-auto object-cover rounded'
            />
          ) : (
            <a
              href={existingUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-blue-600 hover:underline truncate block'
            >
              Arquivo enviado
            </a>
          )}
        </div>
        <Button
          variant='outline'
          size='sm'
          type='button'
          onClick={() => {
            // Allow uploading a new file
            onUploadComplete('')
          }}
        >
          Trocar
        </Button>
      </div>
    )
  }

  return (
    <div>
      <input
        type='file'
        id='fileUpload'
        accept={getAccept()}
        onChange={handleFileUpload}
        className='hidden'
        disabled={isUploading}
      />
      <label htmlFor='fileUpload'>
        <Button
          variant='outline'
          disabled={isUploading}
          className='cursor-pointer w-full'
          type='button'
          asChild
        >
          <span>
            {isUploading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                <span>Enviando...</span>
              </>
            ) : (
              buttonText || (
                <>
                  <UploadCloud className='mr-2 h-4 w-4' />
                  <span>Fazer upload</span>
                </>
              )
            )}
          </span>
        </Button>
      </label>
    </div>
  )
}
