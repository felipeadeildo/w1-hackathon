import { useState } from 'react'
import { useStepDocumentRequirements, useUserStepDocuments } from '~/hooks/use-documents'
import type { Document } from '~/types/document'
import { DocumentUploader } from './document-uploader'

interface DocumentRequirementsListProps {
  stepId: number
  userStepId: number
}

export function DocumentRequirementsList({ stepId, userStepId }: DocumentRequirementsListProps) {
  const [showUploaderForReq, setShowUploaderForReq] = useState<string | null>(null)

  const {
    data: requirements,
    isLoading: isLoadingRequirements,
    error: requirementsError,
  } = useStepDocumentRequirements(stepId)

  const {
    data: documents,
    isLoading: isLoadingDocuments,
    refetch: refetchDocuments,
  } = useUserStepDocuments(userStepId)

  const handleUploadComplete = () => {
    refetchDocuments()
    setShowUploaderForReq(null)
  }

  if (isLoadingRequirements || isLoadingDocuments) {
    return <div className='p-4 text-center'>Carregando requisitos de documentos...</div>
  }

  if (requirementsError) {
    return <div className='p-4 text-center text-red-500'>Erro ao carregar requisitos</div>
  }

  if (!requirements || requirements.length === 0) {
    return <div className='p-4 text-center'>Não há documentos exigidos para esta etapa.</div>
  }

  // Create a map of requirement ID to documents for quick lookup
  const documentsByRequirementId = (documents || []).reduce(
    (map, doc) => {
      const reqId = doc.requirement_id as string
      if (!map[reqId]) {
        map[reqId] = []
      }
      map[reqId].push(doc)
      return map
    },
    {} as Record<string, Document[]>,
  )

  return (
    <div className='space-y-8'>
      <h3 className='text-lg font-medium'>Documentos Necessários</h3>

      <div className='grid gap-6 md:grid-cols-2'>
        {requirements.map((requirement) => {
          const requirementId = requirement.id as string
          const requirementDocs = documentsByRequirementId[requirementId] || []
          const hasUploadedDocs = requirementDocs.length > 0
          const isShowingUploader = showUploaderForReq === requirementId

          return (
            <div key={requirementId} className='p-4 border rounded-lg bg-white'>
              {hasUploadedDocs && !isShowingUploader ? (
                <div className='space-y-3'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h4 className='font-medium'>{requirement.name}</h4>
                      <p className='text-sm text-gray-500'>{requirement.description}</p>
                    </div>
                    <span className='bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded'>
                      Enviado
                    </span>
                  </div>

                  <div className='text-sm'>
                    <h5 className='font-medium mb-1'>Arquivos enviados:</h5>
                    <ul className='text-gray-600 space-y-1'>
                      {requirementDocs.map((doc) => (
                        <li key={doc.id as string} className='flex items-center'>
                          <svg
                            className='w-4 h-4 mr-1.5 text-green-500'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                              clipRule='evenodd'
                            />
                          </svg>
                          {doc.original_filename}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    className='text-sm text-blue-600 hover:text-blue-800'
                    onClick={() => setShowUploaderForReq(requirementId)}
                  >
                    Enviar outro arquivo
                  </button>
                </div>
              ) : (
                <DocumentUploader
                  userStepId={userStepId}
                  requirement={requirement}
                  onUploadComplete={handleUploadComplete}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
