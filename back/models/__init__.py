from sqlmodel import SQLModel

from models.asset import Asset, AssetTypeEnum
from models.base import TimeStampModel, UUIDModel
from models.conversation import Conversation, Message
from models.document import Document, DocumentRequest, DocumentStatusEnum, DocumentType
from models.holding import (
    Holding,
    HoldingAssetLink,
    HoldingStageEnum,
    HoldingStageHistory,
    HoldingTypeEnum,
)
from models.simulation import Simulation, SimulationDetail
from models.user import FamilyMember, User, UserProfile

# Ensure all models are available at the module level for SQLModel and Alembic
__all__ = [
    "Asset",
    "AssetTypeEnum",
    "Conversation",
    "Document",
    "DocumentRequest",
    "DocumentStatusEnum",
    "DocumentType",
    "FamilyMember",
    "Holding",
    "HoldingAssetLink",
    "HoldingStageEnum",
    "HoldingStageHistory",
    "HoldingTypeEnum",
    "Message",
    "SQLModel",
    "Simulation",
    "SimulationDetail",
    "TimeStampModel",
    "UUIDModel",
    "User",
    "UserProfile",
]
