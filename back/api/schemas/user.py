from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr


class ProfileRead(BaseModel):
    full_name: str

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    password: str
    name: str


class UserLogin(UserBase):
    password: str


class UserRead(UserBase):
    id: UUID
    is_active: bool
    is_consultant: bool
    created_at: datetime
    updated_at: datetime
    profile: ProfileRead | None = None

    class Config:
        from_attributes = True

    @property
    def name(self) -> str | None:
        return self.profile.full_name if self.profile else None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: str | None = None
