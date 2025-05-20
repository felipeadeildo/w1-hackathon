"""Financial simulation and tax savings models."""

import uuid
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.holding.asset import Asset
    from models.holding.core import Holding
    from models.user import FamilyMember, User


class SimulationResult(TimeStampModel, UUIDModel, table=True):
    """Resultados das simulações financeiras."""

    holding_id: uuid.UUID = Field(foreign_key="holding.id")
    created_by_user_id: uuid.UUID = Field(foreign_key="user.id")

    # Resumo dos resultados
    tax_savings_annual: float
    succession_savings_total: float
    total_savings_5y: float
    roi_percentage: float

    # Detalhes da simulação
    assumptions: str | None = None
    simulation_period_years: int = Field(default=5)

    # Relacionamentos
    holding: "Holding" = Relationship(back_populates="simulations")
    created_by: "User" = Relationship()
    tax_details: list["TaxSavingDetail"] = Relationship(back_populates="simulation")


class TaxSavingDetail(TimeStampModel, UUIDModel, table=True):
    """Detalhes das economias de impostos."""

    simulation_id: uuid.UUID = Field(foreign_key="simulationresult.id")
    saving_type: str  # 'income_tax', 'property_tax', 'inheritance_tax'
    description: str
    amount: float
    recurrence: str  # 'monthly', 'annual', 'one_time'

    # Campos para análise detalhada
    applies_to_asset_id: uuid.UUID | None = Field(default=None, foreign_key="asset.id")
    applies_to_family_member_id: uuid.UUID | None = Field(
        default=None, foreign_key="familymember.id"
    )

    # Relacionamentos
    simulation: SimulationResult = Relationship(back_populates="tax_details")
    applies_to_asset: "Asset | None" = Relationship()
    applies_to_family_member: "FamilyMember | None" = Relationship()
