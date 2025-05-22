"""Document management models for onboarding."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship

from models.base import TimeStampModel, UUIDModel

if TYPE_CHECKING:
    from models.onboarding import OnboardingStep, UserOnboardingStep
    from models.user import User


class DocumentRequirement(TimeStampModel, UUIDModel, table=True):
    """Requirements for documents to be submitted during onboarding."""

    step_id: int = Field(foreign_key="onboardingstep.id")
    name: str
    description: str
    doc_type: str  # 'rg', 'cpf', 'property_deed', etc.
    is_required: bool = Field(default=True)
    created_by_user_id: uuid.UUID | None = Field(default=None, foreign_key="user.id")
    created_by_type: str = Field(default="system")  # 'system', 'consultant', 'admin', 'llm'
    priority: int = Field(default=0)
    reason: str | None = None

    # Relationships
    step: "OnboardingStep" = Relationship(back_populates="document_requirements")
    created_by: "User" = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[DocumentRequirement.created_by_user_id]"}
    )
    documents: list["Document"] = Relationship(back_populates="requirement")


class Document(TimeStampModel, UUIDModel, table=True):
    """Documents uploaded by users during onboarding."""

    user_step_id: int = Field(foreign_key="useronboardingstep.id")
    requirement_id: uuid.UUID = Field(foreign_key="documentrequirement.id")
    file_path: str
    original_filename: str
    file_type: str  # 'pdf', 'jpg', 'png', etc.
    file_size: int
    content_type: str  # MIME type
    uploaded_by_id: uuid.UUID = Field(foreign_key="user.id")

    # Status and validation
    status: str = Field(default="uploaded")  # 'uploaded', 'processing', 'validated', 'rejected'
    rejection_reason: str | None = None
    validated_by_user_id: uuid.UUID | None = Field(default=None, foreign_key="user.id")
    validated_at: datetime | None = None

    # OCR processing fields
    ocr_processed: bool = Field(default=False)
    ocr_confidence: float | None = None
    ocr_processed_at: datetime | None = None

    # Relationships
    user_step: "UserOnboardingStep" = Relationship(back_populates="documents")
    requirement: DocumentRequirement = Relationship(back_populates="documents")
    uploaded_by: "User" = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[Document.uploaded_by_id]"}
    )
    validated_by: "User" = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[Document.validated_by_user_id]"}
    )
    extracted_data: list["DocumentExtractedData"] = Relationship(back_populates="document")
    reviews: list["DocumentReview"] = Relationship(back_populates="document")


class DocumentExtractedData(TimeStampModel, UUIDModel, table=True):
    """Data extracted from documents via OCR and processing."""

    document_id: uuid.UUID = Field(foreign_key="document.id")
    field_name: str
    field_value: str
    confidence: float
    extraction_method: str  # 'ocr', 'llm', 'manual'

    # Manual verification
    verified: bool = Field(default=False)
    verified_by_user_id: uuid.UUID | None = Field(default=None, foreign_key="user.id")
    verified_at: datetime | None = None

    # Relationships
    document: Document = Relationship(back_populates="extracted_data")
    verified_by: "User" = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[DocumentExtractedData.verified_by_user_id]"}
    )


class DocumentReview(TimeStampModel, UUIDModel, table=True):
    """Document reviews by consultants/administrators."""

    document_id: uuid.UUID = Field(foreign_key="document.id")
    reviewer_id: uuid.UUID = Field(foreign_key="user.id")
    status: str  # 'approved', 'rejected', 'pending_correction'
    comments: str | None = None
    correction_requested: str | None = None

    # Relationships
    document: Document = Relationship(back_populates="reviews")
    reviewer: "User" = Relationship()
