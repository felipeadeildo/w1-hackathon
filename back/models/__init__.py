from sqlmodel import SQLModel

from models.base import TimeStampModel, UUIDModel
from models.conversation import Conversation, Message
from models.holding.asset import Asset, HoldingAsset
from models.holding.chat import ChatDocumentGeneration, ChatMessage, ChatSession
from models.holding.core import Holding, HoldingStage
from models.holding.document import (
    Document,
    DocumentExtractedData,
    DocumentRequirement,
    DocumentReview,
)
from models.holding.simulation import SimulationResult, TaxSavingDetail
from models.holding.tracking import HoldingActivity
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
    "Asset",
    "ChatDocumentGeneration",
    "ChatMessage",
    "ChatSession",
    "Conversation",
    "Document",
    "DocumentExtractedData",
    "DocumentRequirement",
    "DocumentReview",
    "FamilyMember",
    "Holding",
    "HoldingActivity",
    "HoldingAsset",
    "HoldingStage",
    "Message",
    "OnboardingFlow",
    "OnboardingStep",
    "OnboardingStepType",
    "SQLModel",
    "SimulationResult",
    "TaxSavingDetail",
    "TimeStampModel",
    "UUIDModel",
    "User",
    "UserOnboardingFlow",
    "UserOnboardingStep",
    "UserProfile",
]
