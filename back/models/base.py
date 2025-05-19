import uuid
from datetime import UTC, datetime

from sqlmodel import Field, SQLModel


class TimeStampModel(SQLModel):
    """Modelo base com timestamps para auditoria"""

    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class UUIDModel(SQLModel):
    """Modelo base com UUID como chave primária"""

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
