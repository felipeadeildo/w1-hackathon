"""User and family member models."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

import sqlalchemy
from sqlmodel import Field, Relationship

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.conversation import Conversation, Message
    from models.onboarding import UserOnboardingFlow


class User(TimeStampModel, UUIDModel, table=True):
    """Usuários do sistema (clientes e consultores)."""

    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = True
    is_consultant: bool = False
    is_admin: bool = False

    # Relacionamentos básicos
    profile: "UserProfile" = Relationship(back_populates="user")
    family_members: list["FamilyMember"] = Relationship(back_populates="user")
    conversations: list["Conversation"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"lazy": "selectin"}
    )
    messages_sent: list["Message"] = Relationship(
        back_populates="sender", sa_relationship_kwargs={"lazy": "selectin"}
    )

    # Relacionamento com onboarding
    onboarding_flows: list["UserOnboardingFlow"] = Relationship(back_populates="user")


class UserProfile(TimeStampModel, table=True):
    """Perfil detalhado do usuário (dados pessoais)."""

    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)
    full_name: str
    cpf: str | None = Field(default=None, index=True)
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
    """Membros da família para planejamento sucessório."""

    user_id: uuid.UUID = Field(foreign_key="user.id")
    name: str
    relationship: str  # cônjuge, filho, etc.
    birth_date: datetime | None = None
    cpf: str | None = None
    rg: str | None = None
    is_dependent: bool = Field(default=False)
    profession: str | None = None
    income: float | None = None

    # Campos para controle
    identified_by: str = Field(default="llm")  # 'llm', 'consultant', 'client'

    # Relacionamentos
    user: User = Relationship(back_populates="family_members")
