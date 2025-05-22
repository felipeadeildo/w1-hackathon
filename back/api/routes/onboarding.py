from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from api.dependencies import get_current_user
from api.schemas.onboarding import (
    StepDataUpdate,
    StepStatusUpdate,
    UserOnboardingFlowRead,
    UserOnboardingStepRead,
)
from core.database import get_session
from core.user_crud import (
    check_onboarding_flow_completion,
    complete_onboarding_flow,
    get_user_onboarding_flow,
    get_user_onboarding_step,
    update_onboarding_step,
)
from models.onboarding import UserOnboardingFlow, UserOnboardingStep
from models.user import User

router = APIRouter(tags=["onboarding"])


@router.get("/flow", response_model=UserOnboardingFlowRead)
async def get_current_onboarding_flow(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserOnboardingFlowRead:
    """Get the current user's onboarding flow and steps"""
    if current_user.is_consultant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consultants don't have onboarding flows",
        )

    user_flow = get_user_onboarding_flow(session, current_user.id)
    if not user_flow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active onboarding flow found for this user",
        )

    return user_flow  # type: ignore


@router.get("/step/{step_id}", response_model=UserOnboardingStepRead)
async def get_onboarding_step(
    step_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserOnboardingStepRead:
    """Get details for a specific onboarding step"""
    user_flow = get_user_onboarding_flow(session, current_user.id)
    if not user_flow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active onboarding flow found for this user",
        )

    user_step = get_user_onboarding_step(session, step_id, user_flow.id)  # type: ignore
    if not user_step:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Step not found in user's onboarding flow"
        )

    return user_step  # type: ignore


@router.patch("/step/{user_step_id}/data", response_model=UserOnboardingStepRead)
async def update_step_data(
    user_step_id: int,
    step_data: StepDataUpdate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserOnboardingStepRead:
    """Update data for a specific onboarding step"""
    # First verify the step belongs to this user
    user_step = session.get(UserOnboardingStep, user_step_id)
    if not user_step:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Step not found")

    user_flow = session.get(UserOnboardingFlow, user_step.user_flow_id)
    if not user_flow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User flow not found for this step"
        )

    if user_flow.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this step"
        )

    # Update the step data
    updated_step = update_onboarding_step(
        session=session, user_step_id=user_step_id, data=step_data.data
    )

    return updated_step  # type: ignore


@router.patch("/step/{user_step_id}/status", response_model=UserOnboardingStepRead)
async def update_step_status(
    user_step_id: int,
    status_update: StepStatusUpdate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserOnboardingStepRead:
    """Mark a step as completed or not completed"""
    # Verify the step belongs to this user
    user_step = session.get(UserOnboardingStep, user_step_id)
    if not user_step:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Step not found")

    user_flow = session.get(UserOnboardingFlow, user_step.user_flow_id)
    if not user_flow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User flow not found for this step"
        )

    if user_flow.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this step"
        )

    # Update the step status
    updated_step = update_onboarding_step(
        session=session, user_step_id=user_step_id, is_completed=status_update.is_completed
    )

    # Check if the entire flow is completed
    is_completed = check_onboarding_flow_completion(session, user_flow.id)  # type: ignore
    if status_update.is_completed and is_completed:
        complete_onboarding_flow(session, user_flow.id)  # type: ignore

    return updated_step  # type: ignore
