import uuid
from datetime import datetime

from pydantic import BaseModel


class DocumentRequirementOut(BaseModel):
    id: uuid.UUID
    step_id: int
    name: str
    description: str
    doc_type: str
    is_required: bool
    created_by_user_id: uuid.UUID | None = None
    created_by_type: str
    priority: int
    reason: str | None = None

    class Config:
        from_attributes = True


class DocumentExtractedDataOut(BaseModel):
    id: uuid.UUID
    document_id: uuid.UUID
    field_name: str
    field_value: str
    confidence: float
    extraction_method: str
    verified: bool
    verified_by_user_id: uuid.UUID | None = None
    verified_at: datetime | None = None

    class Config:
        from_attributes = True


class DocumentReviewOut(BaseModel):
    id: uuid.UUID
    document_id: uuid.UUID
    reviewer_id: uuid.UUID
    status: str
    comments: str | None = None
    correction_requested: str | None = None

    class Config:
        from_attributes = True


class DocumentOut(BaseModel):
    id: uuid.UUID
    user_step_id: int
    requirement_id: uuid.UUID
    file_path: str
    original_filename: str
    file_type: str
    file_size: int
    content_type: str
    uploaded_by_id: uuid.UUID
    status: str
    rejection_reason: str | None = None
    validated_by_user_id: uuid.UUID | None = None
    validated_at: datetime | None = None
    ocr_processed: bool
    ocr_confidence: float | None = None
    ocr_processed_at: datetime | None = None
    extracted_data: list[DocumentExtractedDataOut] | None = None
    reviews: list[DocumentReviewOut] | None = None

    class Config:
        from_attributes = True
