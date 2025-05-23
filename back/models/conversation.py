# models/conversation.py
import uuid
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.onboarding import OnboardingStep
    from models.user import User


class SenderType(str, Enum):
    USER = "user"
    LLM = "llm"
    CONSULTANT = "consultant"
    SYSTEM = "system"


class Conversation(TimeStampModel, UUIDModel, table=True):
    """Conversas com o cliente"""

    user_id: uuid.UUID = Field(foreign_key="user.id")
    title: str | None = None
    is_llm: bool = False  # Se é conversa com LLM ou com consultor

    # Relação opcional com step
    onboarding_step_id: int | None = Field(default=None, foreign_key="onboardingstep.id")

    # Relacionamentos
    user: "User" = Relationship(back_populates="conversations")
    messages: list["Message"] = Relationship(back_populates="conversation")
    onboarding_step: Optional["OnboardingStep"] = Relationship(back_populates="conversations")


class Message(TimeStampModel, UUIDModel, table=True):
    """Mensagens nas conversas"""

    conversation_id: uuid.UUID = Field(foreign_key="conversation.id")
    sender_id: uuid.UUID | None = Field(default=None, foreign_key="user.id")
    sender_type: SenderType = Field(default=SenderType.USER)
    content: str

    # Relacionamentos
    conversation: Conversation = Relationship(back_populates="messages")
    sender: Optional["User"] = Relationship(back_populates="messages_sent")
