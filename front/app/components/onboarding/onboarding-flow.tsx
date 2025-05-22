import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '~/components/ui/stepper'
import { useCurrentActiveStep } from '~/hooks/use-onboarding'
import type { UserOnboardingFlow } from '~/types/onboarding'
import { OnboardingStepFactory } from './onboarding-step-factory'

interface OnboardingFlowProps {
  flow: UserOnboardingFlow
}

export function OnboardingFlow({ flow }: OnboardingFlowProps) {
  const { data: activeStep } = useCurrentActiveStep()
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)

  // Find the active step index when data loads
  useEffect(() => {
    if (activeStep) {
      const index = flow.user_steps.findIndex((step) => step.id === activeStep.id)
      if (index >= 0) {
        setCurrentStepIndex(index)
      }
    }
  }, [activeStep, flow.user_steps])

  // Sort steps by order for display
  const sortedSteps = [...flow.user_steps].sort((a, b) => a.step.order - b.step.order)
  const currentUserStep = sortedSteps[currentStepIndex]

  return (
    <div className='mx-auto max-w-full'>
      <Card className='mb-6'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-center text-2xl'>{flow.flow.name}</CardTitle>
          <p className='text-center text-sm text-muted-foreground'>{flow.flow.description}</p>
        </CardHeader>
        <CardContent>
          <Stepper
            value={currentStepIndex}
            onValueChange={setCurrentStepIndex}
            className='w-full'
            orientation='horizontal'
          >
            {sortedSteps.map((userStep, index) => (
              <StepperItem
                key={userStep.id}
                step={index}
                completed={userStep.is_completed}
                disabled={index > 0 && !sortedSteps[index - 1].is_completed}
                className='not-last:flex-1'
              >
                <StepperTrigger className='rounded flex flex-col md:flex-row md:items-center gap-2'>
                  <StepperIndicator className='shrink-0' />
                  <div className='text-center md:text-left'>
                    <StepperTitle className='text-sm whitespace-nowrap'>
                      {userStep.step.name}
                    </StepperTitle>
                    <StepperDescription className='max-sm:hidden line-clamp-1 text-xs'>
                      {userStep.step.description}
                    </StepperDescription>
                  </div>
                </StepperTrigger>
                {index < sortedSteps.length - 1 && <StepperSeparator className='md:mx-2' />}
              </StepperItem>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {currentUserStep && (
        <Card>
          <CardHeader>
            <CardTitle>{currentUserStep.step.name}</CardTitle>
            <p className='text-muted-foreground'>{currentUserStep.step.description}</p>
          </CardHeader>
          <CardContent>
            <OnboardingStepFactory
              userStep={currentUserStep}
              onComplete={() => {
                const nextIndex = currentStepIndex + 1
                if (nextIndex < sortedSteps.length) {
                  setCurrentStepIndex(nextIndex)
                }
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
