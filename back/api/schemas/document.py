import uuid
from datetime import datetime

from pydantic import BaseModel


class DocumentRequirementOut(BaseModel):
    id: uuid.UUID
    name: str
    description: str
    doc_type: str
    is_required: bool
    status: str | None

    class Config:
        from_attributes = True


class DocumentUpload(BaseModel):
    holding_id: uuid.UUID
    requirement_id: uuid.UUID
    file_path: str
    original_filename: str
    file_type: str
    file_size: int
    content_type: str


class DocumentOut(BaseModel):
    id: uuid.UUID
    requirement_id: uuid.UUID
    holding_id: uuid.UUID
    status: str
    uploaded_by_id: uuid.UUID
    uploaded_at: datetime
    validated_at: datetime | None

    class Config:
        from_attributes = True
