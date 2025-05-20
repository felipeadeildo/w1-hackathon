"""Activity tracking models for holdings."""

import uuid
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.holding.chat import ChatSession
    from models.holding.core import Holding, HoldingStage
    from models.holding.document import Document
    from models.user import User


class HoldingActivity(TimeStampModel, UUIDModel, table=True):
    """Log de atividades da holding para acompanhamento."""

    holding_id: uuid.UUID = Field(foreign_key="holding.id")
    activity_type: str  # 'document_upload', 'chat_completion', 'stage_change', 'validation'
    description: str
    performed_by_id: uuid.UUID | None = Field(default=None, foreign_key="user.id")
    performed_by_type: str  # 'client', 'consultant', 'system', 'llm'

    # Campos para rastreamento detalhado
    related_stage_id: uuid.UUID | None = Field(default=None, foreign_key="holdingstage.id")
    related_document_id: uuid.UUID | None = Field(default=None, foreign_key="document.id")
    related_chat_id: uuid.UUID | None = Field(default=None, foreign_key="chatsession.id")

    # Campos para análise de performance
    time_spent_seconds: int | None = None

    # Relacionamentos
    holding: "Holding" = Relationship(back_populates="activities")
    performed_by: "User | None" = Relationship()
    related_stage: "HoldingStage | None" = Relationship()
    related_document: "Document | None" = Relationship()
    related_chat: "ChatSession | None" = Relationship()
