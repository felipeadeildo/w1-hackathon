import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { useStepDocumentRequirements, useUserStepDocuments } from '~/hooks/use-documents'
import type { StepDataObject, UserOnboardingStep } from '~/types/onboarding'
import { DocumentRequirementsList } from '../document-requirements-list'

interface DataStepProps {
  userStep: UserOnboardingStep
  onUpdateData: (data: StepDataObject) => Promise<void>
  onComplete: (isComplete: boolean) => Promise<void>
}

export const DocumentVerificationStep = ({ userStep, onComplete }: DataStepProps) => {
  const stepId = userStep.step.id
  const userStepId = userStep.id
  const [isAllUploaded, setIsAllUploaded] = useState(false)

  // Get document requirements and uploaded documents
  const { data: requirements } = useStepDocumentRequirements(stepId)
  const { data: documents } = useUserStepDocuments(userStepId)

  // Check if all required documents have been uploaded
  useEffect(() => {
    if (requirements && documents) {
      const requiredRequirements = requirements.filter((req) => req.is_required)

      if (requiredRequirements.length === 0) {
        setIsAllUploaded(true)
        return
      }

      // Check if we have at least one document for each required requirement
      const allUploaded = requiredRequirements.every((req) => {
        return documents.some((doc) => doc.requirement_id === req.id)
      })

      setIsAllUploaded(allUploaded)

      // If the step is marked complete but not all documents are uploaded,
      // or if all documents are uploaded but step is not complete, update status
      if (allUploaded && !userStep.is_completed) {
        // Don't auto-complete, let the user click the button
        // onComplete(true)
      } else if (!allUploaded && userStep.is_completed) {
        onComplete(false)
      }
    }
  }, [requirements, documents, userStep.is_completed, onComplete])

  return (
    <div className='space-y-6'>
      <DocumentRequirementsList stepId={stepId} userStepId={userStepId} />

      <div className='flex justify-end'>
        <Button onClick={() => onComplete(true)} disabled={!isAllUploaded}>
          {userStep.is_completed ? 'Concluído' : 'Concluir etapa'}
        </Button>
      </div>
    </div>
  )
}
