import uuid
from datetime import datetime

from sqlmodel import Session

from models.holding.document import Document, DocumentExtractedData
from tasks.document_tasks import process_document_ocr_task


def upload_document(
    session: Session,
    holding_id: uuid.UUID,
    requirement_id: uuid.UUID,
    file_path: str,
    original_filename: str,
    file_type: str,
    file_size: int,
    content_type: str,
    uploaded_by_id: uuid.UUID,
) -> Document:
    doc = Document(
        holding_id=holding_id,
        requirement_id=requirement_id,
        file_path=file_path,
        original_filename=original_filename,
        file_type=file_type,
        file_size=file_size,
        content_type=content_type,
        uploaded_by_id=uploaded_by_id,
        status="uploaded",
    )
    session.add(doc)
    session.commit()
    session.refresh(doc)
    return doc


def trigger_ocr_processing(document_id: uuid.UUID) -> None:
    process_document_ocr_task.delay(str(document_id))  # type: ignore


def process_ocr(session: Session, document_id: uuid.UUID, extracted_fields: dict) -> None:
    doc = session.get(Document, document_id)
    if not doc:
        raise ValueError("Documento não encontrado")
    doc.status = "processing"
    doc.ocr_processed = True
    doc.ocr_processed_at = datetime.utcnow()
    for field, value in extracted_fields.items():
        data = DocumentExtractedData(
            document_id=doc.id,
            field_name=field,
            field_value=value,
            confidence=0.99,
            extraction_method="ocr",
        )
        session.add(data)
    session.commit()


def validate_document(
    session: Session, document_id: uuid.UUID, validated_by_user_id: uuid.UUID
) -> None:
    doc = session.get(Document, document_id)
    if not doc:
        raise ValueError("Documento não encontrado")
    doc.status = "validated"
    doc.validated_by_user_id = validated_by_user_id
    doc.validated_at = datetime.utcnow()
    session.commit()
