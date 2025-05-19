import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.asset import Asset
    from models.document import Document
    from models.simulation import Simulation
    from models.user import User


class HoldingTypeEnum(str, Enum):
    PATRIMONIAL = "patrimonial"
    PARTICIPATION = "participation"
    MIXED = "mixed"


class HoldingStageEnum(str, Enum):
    SIMULATION = "simulation"
    PROPOSAL = "proposal"
    CONSTITUTION = "constitution"
    ASSET_TRANSFER = "asset_transfer"
    COMPLETED = "completed"


class HoldingAssetLink(SQLModel, table=True):
    """Relação entre holding e ativos"""

    holding_id: uuid.UUID = Field(foreign_key="holding.id", primary_key=True)
    asset_id: uuid.UUID = Field(foreign_key="asset.id", primary_key=True)
    transfer_date: datetime | None = None


class Holding(TimeStampModel, UUIDModel, table=True):
    """Holding a ser constituída"""

    client_id: uuid.UUID = Field(foreign_key="user.id")
    simulation_id: uuid.UUID | None = Field(default=None, foreign_key="simulation.id")

    name: str
    type: HoldingTypeEnum
    cnpj: str | None = None

    current_stage: HoldingStageEnum = HoldingStageEnum.SIMULATION
    stage_start_date: datetime = Field(default_factory=datetime.utcnow)
    estimated_completion_date: datetime | None = None

    # Acompanhamento do processo
    progress_percentage: int = 0
    stage_notes: str | None = None

    # Relacionamentos
    client: "User" = Relationship(back_populates="holdings")
    simulation: Optional["Simulation"] = Relationship(back_populates="holding")
    documents: list["Document"] = Relationship(back_populates="holding")
    assets: list["Asset"] = Relationship(back_populates="holdings", link_model=HoldingAssetLink)
    stages: list["HoldingStageHistory"] = Relationship(back_populates="holding")


class HoldingStageHistory(TimeStampModel, UUIDModel, table=True):
    """Histórico de estágios do processo de constituição da holding"""

    holding_id: uuid.UUID = Field(foreign_key="holding.id")
    stage: HoldingStageEnum
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: datetime | None = None
    duration_days: int | None = None
    notes: str | None = None

    # Relacionamentos
    holding: Holding = Relationship(back_populates="stages")
