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
    <div className='mx-auto max-w-5xl px-4 py-8'>
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle className='text-center text-2xl'>{flow.flow.name}</CardTitle>
          <p className='text-center text-muted-foreground'>{flow.flow.description}</p>
        </CardHeader>
        <CardContent>
          <Stepper
            value={currentStepIndex}
            onValueChange={setCurrentStepIndex}
            className='w-full justify-center'
          >
            {sortedSteps.map((userStep, index) => (
              <StepperItem
                key={userStep.id}
                step={index}
                completed={userStep.is_completed}
                disabled={index > 0 && !sortedSteps[index - 1].is_completed}
                className='relative flex-1 flex-col'
              >
                <StepperTrigger className='flex-col gap-3 rounded'>
                  <StepperIndicator />
                  <div className='space-y-0.5 px-2'>
                    <StepperTitle>{userStep.step.name}</StepperTitle>
                    <StepperDescription className='max-sm:hidden line-clamp-2'>
                      {userStep.step.description}
                    </StepperDescription>
                  </div>
                </StepperTrigger>
                {index < sortedSteps.length - 1 && (
                  <StepperSeparator className='absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none' />
                )}
              </StepperItem>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {currentUserStep && (
        <OnboardingStepFactory
          userStep={currentUserStep}
          onComplete={() => {
            const nextIndex = currentStepIndex + 1
            if (nextIndex < sortedSteps.length) {
              setCurrentStepIndex(nextIndex)
            }
          }}
        />
      )}
    </div>
  )
}
