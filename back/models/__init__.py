from sqlmodel import SQLModel

from models.base import TimeStampModel, UUIDModel
from models.conversation import Conversation, Message, SenderType
from models.document import Document, DocumentExtractedData, DocumentRequirement, DocumentReview
from models.onboarding import (
    OnboardingFlow,
    OnboardingStep,
    OnboardingStepType,
    UserOnboardingFlow,
    UserOnboardingStep,
)
from models.user import FamilyMember, User, UserProfile

# Ensure all models are available at the module level for SQLModel and Alembic
__all__ = [
    "Conversation",
    "Document",
    "DocumentExtractedData",
    "DocumentRequirement",
    "DocumentReview",
    "FamilyMember",
    "Message",
    "OnboardingFlow",
    "OnboardingStep",
    "OnboardingStepType",
    "SQLModel",
    "SenderType",
    "TimeStampModel",
    "UUIDModel",
    "User",
    "UserOnboardingFlow",
    "UserOnboardingStep",
    "UserProfile",
]
