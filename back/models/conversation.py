import uuid
from typing import TYPE_CHECKING, Any, Optional

import sqlalchemy
from sqlmodel import Field, Relationship

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.user import User


class Conversation(TimeStampModel, UUIDModel, table=True):
    """Conversas com o cliente"""

    user_id: uuid.UUID = Field(foreign_key="user.id")
    title: str | None = None
    is_llm: bool = False  # Se é conversa com LLM ou com consultor

    # Relacionamentos
    user: "User" = Relationship(back_populates="conversations")
    messages: list["Message"] = Relationship(back_populates="conversation")


class Message(TimeStampModel, UUIDModel, table=True):
    """Mensagens nas conversas"""

    conversation_id: uuid.UUID = Field(foreign_key="conversation.id")
    sender_id: uuid.UUID | None = Field(default=None, foreign_key="user.id")
    is_from_system: bool = False
    content: str

    # Dados estruturados extraídos pelo LLM
    extracted_data: dict[str, Any] | None = Field(
        default=None, sa_column=sqlalchemy.Column(sqlalchemy.JSON)
    )

    # Relacionamentos
    conversation: Conversation = Relationship(back_populates="messages")
    sender: Optional["User"] = Relationship(back_populates="messages_sent")
