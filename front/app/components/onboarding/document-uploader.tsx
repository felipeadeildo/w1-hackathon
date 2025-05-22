import { useState } from 'react'
import { useUploadDocumentForRequirement } from '~/hooks/use-documents'
import { createFileInputHandler, createProgressHandler } from '~/lib/document-helper'
import type { DocumentRequirement } from '~/types/document'

interface DocumentUploaderProps {
  requirement: DocumentRequirement
  onUploadComplete?: () => void
}

export function DocumentUploader({ requirement, onUploadComplete }: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadMutation = useUploadDocumentForRequirement()

  const handleFileChange = createFileInputHandler((documentUpload) => {
    setError(null)
    setUploading(true)
    setProgress(0)

    uploadMutation.mutate(
      {
        requirementId: requirement.id as string,
        document: documentUpload,
        onProgress: createProgressHandler((percent) => {
          setProgress(percent)
        }),
      },
      {
        onSuccess: () => {
          setUploading(false)
          if (onUploadComplete) {
            onUploadComplete()
          }
        },
        onError: (err) => {
          setUploading(false)
          setError(err instanceof Error ? err.message : 'Erro ao fazer upload do documento')
        },
      },
    )
  }, requirement.id)

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-2'>
        <label
          htmlFor={`file-upload-${requirement.id}`}
          className='text-sm font-medium text-gray-700'
        >
          {requirement.name}
          {requirement.is_required && <span className='text-red-500 ml-1'>*</span>}
        </label>

        <p className='text-sm text-gray-500'>{requirement.description}</p>

        <input
          id={`file-upload-${requirement.id}`}
          type='file'
          onChange={handleFileChange}
          disabled={uploading}
          className='block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100'
        />
      </div>

      {uploading && (
        <div className='space-y-2'>
          <div className='w-full bg-gray-200 rounded-full h-2.5'>
            <div
              className='bg-blue-600 h-2.5 rounded-full transition-all duration-300'
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className='text-sm text-gray-600 text-right'>{progress}%</p>
        </div>
      )}

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  )
}
