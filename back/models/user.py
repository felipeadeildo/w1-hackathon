import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

import sqlalchemy
from sqlmodel import Field, Relationship

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.asset import Asset
    from models.conversation import Conversation
    from models.document import Document
    from models.holding import Holding
    from models.simulation import Simulation


class User(TimeStampModel, UUIDModel, table=True):
    """Usuários do sistema (clientes e consultores)"""

    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = True
    is_consultant: bool = False

    # Relacionamentos
    profile: Optional["UserProfile"] = Relationship(back_populates="user")
    family_members: list["FamilyMember"] = Relationship(back_populates="user")

    # Relacionamentos com outros modelos
    assets: list["Asset"] = Relationship(
        back_populates="owner", sa_relationship_kwargs={"lazy": "selectin"}
    )
    documents: list["Document"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"lazy": "selectin"}
    )
    conversations: list["Conversation"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"lazy": "selectin"}
    )
    simulations: list["Simulation"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"lazy": "selectin"}
    )
    holdings: list["Holding"] = Relationship(
        back_populates="client", sa_relationship_kwargs={"lazy": "selectin"}
    )


class UserProfile(TimeStampModel, table=True):
    """Perfil detalhado do usuário (dados pessoais)"""

    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)
    full_name: str
    cpf: str = Field(index=True)
    rg: str | None = None
    date_of_birth: datetime | None = None
    phone_number: str | None = None
    address: str | None = None
    marital_status: str | None = None

    # Dados estruturados obtidos via LLM
    family_structure: dict | None = Field(
        default=None, sa_column=sqlalchemy.Column(sqlalchemy.JSON)
    )

    # Relacionamentos
    user: User = Relationship(back_populates="profile")


class FamilyMember(TimeStampModel, UUIDModel, table=True):
    """Membros da família para planejamento sucessório"""

    user_id: uuid.UUID = Field(foreign_key="user.id")
    name: str
    relationship: str  # cônjuge, filho, etc.
    cpf: str | None = None
    date_of_birth: datetime | None = None

    # Relacionamentos
    user: User = Relationship(back_populates="family_members")
