import uuid
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.asset import Asset
    from models.holding import Holding
    from models.user import User


class Simulation(TimeStampModel, UUIDModel, table=True):
    """Simulações de economia com holding"""

    user_id: uuid.UUID = Field(foreign_key="user.id")
    title: str
    description: str | None = None

    # Resultados da simulação
    tax_savings: float = 0
    succession_savings: float = 0
    total_cost: float = 0
    roi_percentage: float = 0
    payback_months: int = 0

    recommendation: str | None = None
    is_approved_by_client: bool = False

    # Relacionamentos
    user: "User" = Relationship(back_populates="simulations")
    details: list["SimulationDetail"] = Relationship(back_populates="simulation")
    holding: Optional["Holding"] = Relationship(back_populates="simulation")


class SimulationDetail(TimeStampModel, UUIDModel, table=True):
    """Detalhes de cada simulação"""

    simulation_id: uuid.UUID = Field(foreign_key="simulation.id")
    asset_id: uuid.UUID | None = Field(default=None, foreign_key="asset.id")
    category: str  # IPTU, ITBI, Imposto de Renda, etc.

    current_cost: float  # Custo atual sem holding
    holding_cost: float  # Custo com holding
    savings: float  # Economia

    description: str | None = None

    # Relacionamentos
    simulation: Simulation = Relationship(back_populates="details")
    asset: Optional["Asset"] = Relationship()
