import os
import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlmodel import Session, select

from api.dependencies import get_current_user
from api.schemas.document import DocumentOut
from core.database import get_session
from models.document import Document
from models.user import User

router = APIRouter(tags=["admin-documents"])


def require_admin(user: User) -> User:
    # TODO: Implement proper admin check
    # if not getattr(user, "is_admin", True):
    #     raise HTTPException(status_code=403, detail="Admin only")
    return user


@router.get("/", response_model=list[DocumentOut])
def list_all_documents(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
    skip: int = 0,
    limit: int = 100,
    status: str | None = Query(None),
) -> ...:
    """Admin: List all submitted documents (optionally filter by status)."""
    require_admin(current_user)
    query = select(Document)
    if status:
        query = query.where(Document.status == status)
    query = query.offset(skip).limit(limit)

    documents = session.exec(query).all()
    return documents


@router.get("/{document_id}/download")
def download_document(
    document_id: uuid.UUID,
    session: Annotated[Session, Depends(get_session)],
    # current_user: Annotated[User, Depends(get_current_user)],
) -> FileResponse:
    """Admin: Download document file."""
    # require_admin(current_user)
    document = session.exec(select(Document).where(Document.id == document_id)).one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = document.file_path
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(
        path=file_path,
        filename=document.original_filename,
        media_type=document.content_type,
    )


@router.patch("/{document_id}/status", response_model=DocumentOut)
def update_document_status(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
    document_id: uuid.UUID,
    status: str = Body(..., embed=True),
    rejection_reason: str | None = Body(None, embed=True),
) -> ...:
    """Admin: Update document status (accept/reject)."""
    require_admin(current_user)
    document = session.get(Document, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    if status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    document.status = status
    document.validated_by_user_id = current_user.id
    document.validated_at = datetime.utcnow()
    if status == "rejected":
        document.rejection_reason = rejection_reason
    else:
        document.rejection_reason = None
    session.add(document)
    session.commit()
    session.refresh(document)
    return document
