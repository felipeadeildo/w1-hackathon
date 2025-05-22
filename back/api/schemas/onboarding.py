from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

from models.onboarding import OnboardingStepType


class OnboardingStepBase(BaseModel):
    name: str
    description: str
    order: int
    type: OnboardingStepType


class OnboardingStepRead(OnboardingStepBase):
    id: int


class OnboardingFlowBase(BaseModel):
    name: str
    description: str


class OnboardingFlowRead(OnboardingFlowBase):
    id: int
    created_at: datetime
    steps: list[OnboardingStepRead]


class UserOnboardingStepRead(BaseModel):
    id: int
    step_id: int
    is_completed: bool
    started_at: datetime | None = None
    completed_at: datetime | None = None
    data: dict[str, Any] | None = None
    step: OnboardingStepRead


class UserOnboardingFlowRead(BaseModel):
    id: int
    flow_id: int
    is_completed: bool
    started_at: datetime
    completed_at: datetime | None = None
    flow: OnboardingFlowRead
    user_steps: list[UserOnboardingStepRead]


class StepDataUpdate(BaseModel):
    data: dict[str, Any] = Field(..., description="Data to be saved for this step")


class StepStatusUpdate(BaseModel):
    is_completed: bool = Field(..., description="Whether this step is completed")
