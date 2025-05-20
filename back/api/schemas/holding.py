import uuid
from datetime import datetime

from pydantic import BaseModel


class HoldingCreate(BaseModel):
    name: str
    consultant_id: uuid.UUID | None = None


class HoldingOut(BaseModel):
    id: uuid.UUID
    name: str
    status: str
    client_id: uuid.UUID
    consultant_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class HoldingStageOut(BaseModel):
    id: uuid.UUID
    name: str
    description: str
    order: int
    status: str
    stage_type: str
    start_date: datetime | None
    end_date: datetime | None

    class Config:
        orm_mode = True
