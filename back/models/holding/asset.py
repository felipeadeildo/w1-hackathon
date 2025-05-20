"""Asset and patrimony management models."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.holding.chat import ChatSession
    from models.holding.core import Holding
    from models.user import User


class Asset(TimeStampModel, UUIDModel, table=True):
    """Ativos/patrimônios do cliente."""

    owner_id: uuid.UUID = Field(foreign_key="user.id")
    name: str
    asset_type: str  # 'real_estate', 'company_share', 'investment', 'vehicle'
    description: str | None = None
    market_value: float
    acquisition_date: datetime | None = None
    acquisition_value: float | None = None

    # Campos para gestão e análise
    identified_by: str = Field(default="llm")  # 'llm', 'consultant', 'client'
    identified_in_chat_id: uuid.UUID | None = Field(default=None, foreign_key="chatsession.id")

    # Campos específicos para imóveis
    real_estate_registry: str | None = None  # Matrícula do imóvel
    real_estate_address: str | None = None
    real_estate_area: float | None = None  # m²
    real_estate_tax_id: str | None = None  # IPTU

    # Campos específicos para participações societárias
    company_name: str | None = None
    company_cnpj: str | None = None
    company_participation_percentage: float | None = None

    # Campos específicos para investimentos
    investment_type: str | None = None  # 'stocks', 'funds', 'fixed_income'
    investment_institution: str | None = None

    # Campos específicos para veículos
    vehicle_make: str | None = None
    vehicle_model: str | None = None
    vehicle_year: int | None = None
    vehicle_license_plate: str | None = None

    # Relacionamentos
    owner: "User" = Relationship(back_populates="assets")
    holding_assets: list["HoldingAsset"] = Relationship(back_populates="asset")
    identified_in_chat: "ChatSession | None" = Relationship()


class HoldingAsset(TimeStampModel, UUIDModel, table=True):
    """Relação entre holdings e ativos (integralização)."""

    holding_id: uuid.UUID = Field(foreign_key="holding.id")
    asset_id: uuid.UUID = Field(foreign_key="asset.id")
    integration_status: str = Field(default="pending")  # 'pending', 'in_progress', 'completed'
    integration_date: datetime | None = None

    # Campos para análise financeira e fiscal
    integration_value: float | None = None
    tax_paid: float | None = None
    annual_tax_before: float | None = None
    annual_tax_after: float | None = None

    # Relacionamentos
    holding: "Holding" = Relationship(back_populates="holding_assets")
    asset: Asset = Relationship(back_populates="holding_assets")
