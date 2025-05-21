import uuid
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlmodel import Session

from api.dependencies import get_current_user
from api.schemas.document import DocumentOut, DocumentUpload
from core.database import get_session
from core.holding.document_service import upload_document, validate_document
from models.holding.document import Document
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


@router.post("/upload-multipart", response_model=DocumentOut)
def upload_document_multipart(
    holding_id: Annotated[str, Form(...)],
    requirement_id: Annotated[str, Form(...)],
    file: Annotated[UploadFile, File(...)],
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> DocumentOut:
    import os
    import uuid

    upload_dir = "/tmp/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    filename = file.filename or str(uuid.uuid4())
    file_path = os.path.join(upload_dir, filename)
    with open(file_path, "wb") as f:
        content = file.file.read()
        f.write(content)
    file_size = len(content)
    # Cria registro no banco
    doc = upload_document(
        session=session,
        holding_id=uuid.UUID(holding_id),
        requirement_id=uuid.UUID(requirement_id),
        file_path=file_path,
        original_filename=filename,
        file_type=filename.split(".")[-1] if "." in filename else "unknown",
        file_size=file_size,
        content_type=file.content_type or "application/octet-stream",
        uploaded_by_id=current_user.id,
    )
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


@router.get("/{document_id}", response_model=DocumentOut)
def get_document(
    document_id: str,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> DocumentOut:
    doc = session.get(Document, UUID(document_id))
    if not doc:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentOut.model_validate(doc)
