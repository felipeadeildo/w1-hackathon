import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.asset import Asset
    from models.holding import Holding
    from models.user import User


class DocumentStatusEnum(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    REQUESTED = "requested"


class DocumentType(TimeStampModel, UUIDModel, table=True):
    """Tipos de documentos necessários"""

    name: str = Field(unique=True)
    description: str | None = None
    is_personal: bool = False  # Se é documento pessoal ou de bem
    is_required: bool = True

    # Relacionamentos
    documents: list["Document"] = Relationship(back_populates="document_type")


class Document(TimeStampModel, UUIDModel, table=True):
    """Documentos enviados pelo cliente"""

    user_id: uuid.UUID = Field(foreign_key="user.id")
    document_type_id: uuid.UUID = Field(foreign_key="documenttype.id")
    asset_id: uuid.UUID | None = Field(default=None, foreign_key="asset.id")
    holding_id: uuid.UUID | None = Field(default=None, foreign_key="holding.id")

    file_path: str
    file_name: str
    file_size: int

    status: DocumentStatusEnum = DocumentStatusEnum.PENDING
    rejection_reason: str | None = None
    validated_by: uuid.UUID | None = None
    validation_date: datetime | None = None

    # Relacionamentos
    user: "User" = Relationship(back_populates="documents")
    document_type: DocumentType = Relationship(back_populates="documents")
    asset: Optional["Asset"] = Relationship(back_populates="documents")
    holding: Optional["Holding"] = Relationship(back_populates="documents")


class DocumentRequest(TimeStampModel, UUIDModel, table=True):
    """Solicitações de documentos ao cliente"""

    user_id: uuid.UUID = Field(foreign_key="user.id")
    document_type_id: uuid.UUID = Field(foreign_key="documenttype.id")
    asset_id: uuid.UUID | None = Field(default=None, foreign_key="asset.id")
    holding_id: uuid.UUID | None = Field(default=None, foreign_key="holding.id")

    requested_by: uuid.UUID = Field(foreign_key="user.id")
    due_date: datetime | None = None
    status: DocumentStatusEnum = DocumentStatusEnum.REQUESTED
    notes: str | None = None

    # Documento enviado em resposta à solicitação
    document_id: uuid.UUID | None = Field(default=None, foreign_key="document.id")

    # Relacionamentos
    requester: "User" = Relationship(sa_relationship_kwargs={"foreign_keys": [requested_by]})
    user: "User" = Relationship(sa_relationship_kwargs={"foreign_keys": [user_id]})
    document_type: DocumentType = Relationship()
    asset: Optional["Asset"] = Relationship()
    holding: Optional["Holding"] = Relationship()
    document: Document | None = Relationship()
