"""Core holding management models."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.holding.asset import HoldingAsset
    from models.holding.chat import ChatSession
    from models.holding.document import Document, DocumentRequirement
    from models.holding.simulation import SimulationResult
    from models.holding.tracking import HoldingActivity
    from models.user import User


class Holding(TimeStampModel, UUIDModel, table=True):
    """Entidade principal que representa uma holding."""

    name: str
    status: str = Field(index=True)  # 'analysis', 'in_progress', 'completed'
    estimated_completion_date: datetime | None = None

    # Informações financeiras
    estimated_total_assets_value: float | None = None
    estimated_annual_income: float | None = None

    # Foreign keys
    client_id: uuid.UUID = Field(foreign_key="user.id")
    consultant_id: uuid.UUID | None = Field(default=None, foreign_key="user.id")

    # Campos administrativos
    cnpj: str | None = None
    legal_name: str | None = None
    incorporation_date: datetime | None = None

    # Relacionamentos
    client: "User" = Relationship(
        back_populates="holdings_as_client",
        sa_relationship_kwargs={"foreign_keys": "[Holding.client_id]", "lazy": "selectin"},
    )
    consultant: Optional["User"] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[Holding.consultant_id]", "lazy": "selectin"}
    )
    stages: list["HoldingStage"] = Relationship(back_populates="holding")
    holding_assets: list["HoldingAsset"] = Relationship(back_populates="holding")
    document_requirements: list["DocumentRequirement"] = Relationship(back_populates="holding")
    documents: list["Document"] = Relationship(back_populates="holding")
    activities: list["HoldingActivity"] = Relationship(back_populates="holding")
    simulations: list["SimulationResult"] = Relationship(back_populates="holding")


class HoldingStage(TimeStampModel, UUIDModel, table=True):
    """Estágios do processo de constituição da holding."""

    holding_id: uuid.UUID = Field(foreign_key="holding.id")
    name: str  # 'personal_docs', 'family_structure', 'assets_docs'
    description: str
    order: int
    status: str = Field(
        default="pending"
    )  # 'pending', 'in_progress', 'completed', 'waiting_client'
    stage_type: str  # 'document', 'chat', 'validation'
    start_date: datetime | None = None
    end_date: datetime | None = None

    # Relacionamentos
    holding: Holding = Relationship(back_populates="stages")
    document_requirements: list["DocumentRequirement"] = Relationship(back_populates="stage")
    chat_sessions: list["ChatSession"] = Relationship(back_populates="stage")
