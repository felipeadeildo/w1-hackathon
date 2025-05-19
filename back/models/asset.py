import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Any

import sqlalchemy
from sqlmodel import Field, Relationship

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.document import Document
    from models.holding import Holding
    from models.user import User

from models.holding import HoldingAssetLink


class AssetTypeEnum(str, Enum):
    REAL_ESTATE = "real_estate"
    COMPANY_SHARE = "company_share"
    FINANCIAL_ASSET = "financial_asset"
    OTHER = "other"


class Asset(TimeStampModel, UUIDModel, table=True):
    """Ativos/Patrimônio do cliente"""

    owner_id: uuid.UUID = Field(foreign_key="user.id")
    type: AssetTypeEnum
    name: str
    description: str | None = None
    market_value: float
    acquisition_value: float | None = None
    acquisition_date: datetime | None = None

    # Campos específicos por tipo de ativo (localização, IPTU, etc para imóveis)
    details: dict[str, Any] = Field(
        default_factory=dict, sa_column=sqlalchemy.Column(sqlalchemy.JSON)
    )

    # Relacionamentos
    owner: "User" = Relationship(back_populates="assets")
    documents: list["Document"] = Relationship(back_populates="asset")
    holdings: list["Holding"] = Relationship(back_populates="assets", link_model=HoldingAssetLink)
