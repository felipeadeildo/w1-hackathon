"""Chat and LLM interaction models."""

import uuid
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.holding.core import HoldingStage
    from models.holding.document import DocumentRequirement


class ChatSession(TimeStampModel, UUIDModel, table=True):
    """Sessões de chat com LLM."""

    stage_id: uuid.UUID = Field(foreign_key="holdingstage.id")
    status: str = Field(default="active")  # 'active', 'completed'

    # Metadados para análise
    total_messages: int = Field(default=0)
    client_satisfaction: int | None = None  # Avaliação do cliente (1-5)

    # Relacionamentos
    stage: "HoldingStage" = Relationship(back_populates="chat_sessions")
    messages: list["ChatMessage"] = Relationship(back_populates="session")
    document_generations: list["ChatDocumentGeneration"] = Relationship(
        back_populates="chat_session"
    )


class ChatMessage(TimeStampModel, UUIDModel, table=True):
    """Mensagens individuais de chat."""

    session_id: uuid.UUID = Field(foreign_key="chatsession.id")
    sender: str  # 'user', 'assistant'
    content: str

    # Metadados para análise
    token_count: int | None = None  # Contagem de tokens
    processed_duration_ms: int | None = None  # Tempo de processamento

    # Relacionamentos
    session: ChatSession = Relationship(back_populates="messages")


class ChatDocumentGeneration(TimeStampModel, UUIDModel, table=True):
    """Conexão entre chat e geração de requisitos de documentos."""

    chat_session_id: uuid.UUID = Field(foreign_key="chatsession.id")
    message_id: uuid.UUID = Field(foreign_key="chatmessage.id")
    holding_id: uuid.UUID = Field(foreign_key="holding.id")
    target_stage_id: uuid.UUID = Field(foreign_key="holdingstage.id")

    # Relacionamentos
    chat_session: ChatSession = Relationship(back_populates="document_generations")
    message: ChatMessage = Relationship()
    target_stage: "HoldingStage" = Relationship()
    generated_requirements: list["DocumentRequirement"] = Relationship(
        sa_relationship_kwargs={
            "primaryjoin": "ChatDocumentGeneration.id==DocumentRequirement.generated_from_chat_id"
        }
    )
