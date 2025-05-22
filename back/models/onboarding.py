import uuid
from datetime import UTC, datetime
from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import JSON, Column
from sqlmodel import Field, Relationship, SQLModel

from models.user import User

if TYPE_CHECKING:
    from models.user import User


class OnboardingStepType(str, Enum):
    PERSONAL_DATA = "personal_data"
    LLM_CHAT = "llm_chat"
    DATA_VERIFICATION = "data_verification"


class OnboardingFlow(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    steps: list["OnboardingStep"] = Relationship(back_populates="flow")
    user_flows: list["UserOnboardingFlow"] = Relationship(back_populates="flow")


class OnboardingStep(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str
    order: int
    type: OnboardingStepType
    flow_id: int = Field(foreign_key="onboardingflow.id")

    flow: OnboardingFlow = Relationship(back_populates="steps")
    user_steps: list["UserOnboardingStep"] = Relationship(back_populates="step")


class UserOnboardingFlow(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    flow_id: int = Field(foreign_key="onboardingflow.id")
    is_completed: bool = Field(default=False)
    started_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    completed_at: datetime | None = None

    user: "User" = Relationship(back_populates="onboarding_flows")
    flow: OnboardingFlow = Relationship(back_populates="user_flows")
    user_steps: list["UserOnboardingStep"] = Relationship(back_populates="user_flow")


class UserOnboardingStep(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_flow_id: int = Field(foreign_key="useronboardingflow.id")
    step_id: int = Field(foreign_key="onboardingstep.id")
    is_completed: bool = Field(default=False)
    started_at: datetime | None = None
    completed_at: datetime | None = None
    data: dict | None = Field(default=None, sa_column=Column(JSON))

    user_flow: UserOnboardingFlow = Relationship(back_populates="user_steps")
    step: OnboardingStep = Relationship(back_populates="user_steps")
