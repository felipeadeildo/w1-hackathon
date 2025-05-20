import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from api.dependencies import get_current_user
from api.schemas.document import DocumentOut, DocumentUpload
from core.database import get_session
from core.holding.document_service import upload_document, validate_document
from models.user import User

router = APIRouter(tags=["documents"])


@router.post("/upload", response_model=DocumentOut)
def upload_document_route(
    doc_in: DocumentUpload,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> DocumentOut:
    doc = upload_document(
        session=session,
        holding_id=doc_in.holding_id,
        requirement_id=doc_in.requirement_id,
        file_path=doc_in.file_path,
        original_filename=doc_in.original_filename,
        file_type=doc_in.file_type,
        file_size=doc_in.file_size,
        content_type=doc_in.content_type,
        uploaded_by_id=current_user.id,
    )
    # Dispara OCR automaticamente se necessário
    from core.holding.document_service import trigger_ocr_processing

    trigger_ocr_processing(doc.id)
    return DocumentOut.model_validate(doc)


@router.patch("/{document_id}/validate")
def validate_document_route(
    document_id: str,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict:
    doc_uuid = uuid.UUID(document_id)
    validate_document(session, doc_uuid, current_user.id)
    return {"ok": True}
