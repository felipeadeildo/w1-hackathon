import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from api.dependencies import get_current_user
from api.schemas.document import DocumentOut, DocumentRequirementOut, DocumentUpload
from core.database import get_session
from models.document import Document, DocumentRequirement
from models.onboarding import OnboardingStep, UserOnboardingStep
from models.user import User

router = APIRouter(tags=["documents"])


@router.get("/steps/{step_id}/requirements", response_model=list[DocumentRequirementOut])
def list_step_requirements(
    step_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ...:
    """List document requirements for a given onboarding step."""
    step = session.get(OnboardingStep, step_id)
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")
    return step.document_requirements


@router.post(
    "/steps/{step_id}/requirements",
    response_model=DocumentRequirementOut,
    status_code=status.HTTP_201_CREATED,
)
def create_step_requirement(
    step_id: int,
    req: DocumentRequirementOut,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ...:
    """Create a document requirement for a given onboarding step."""
    step = session.get(OnboardingStep, step_id)
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")
    requirement = DocumentRequirement(
        step_id=step_id,
        name=req.name,
        description=req.description,
        doc_type=req.doc_type,
        is_required=req.is_required,
        created_by_user_id=current_user.id,
        created_by_type="admin",
        priority=0,
        reason=None,
    )
    session.add(requirement)
    session.commit()
    session.refresh(requirement)
    return requirement


@router.get("/user-steps/{user_step_id}/documents", response_model=list[DocumentOut])
def list_user_step_documents(
    user_step_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ...:
    """List documents uploaded for a user's onboarding step."""
    user_step = session.get(UserOnboardingStep, user_step_id)
    if not user_step:
        raise HTTPException(status_code=404, detail="User onboarding step not found")
    return user_step.documents


@router.post(
    "/user-steps/{user_step_id}/documents",
    response_model=DocumentOut,
    status_code=status.HTTP_201_CREATED,
)
def upload_user_step_document(
    user_step_id: int,
    doc: DocumentUpload,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ...:
    """Upload a document for a user's onboarding step."""
    user_step = session.get(UserOnboardingStep, user_step_id)
    if not user_step:
        raise HTTPException(status_code=404, detail="User onboarding step not found")
    document = Document(
        user_step_id=user_step_id,
        requirement_id=doc.requirement_id,
        file_path=doc.file_path,
        original_filename=doc.original_filename,
        file_type=doc.file_type,
        file_size=doc.file_size,
        content_type=doc.content_type,
        uploaded_by_id=current_user.id,
        status="uploaded",
    )
    session.add(document)
    session.commit()
    session.refresh(document)
    return document


@router.get("/user-steps/{user_step_id}/documents/{document_id}", response_model=DocumentOut)
def get_user_step_document(
    user_step_id: int,
    document_id: str,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ...:
    """Get a document for a user's onboarding step."""
    user_step = session.get(UserOnboardingStep, user_step_id)
    if not user_step:
        raise HTTPException(status_code=404, detail="User onboarding step not found")
    document = session.get(Document, document_id)
    if not document or document.user_step_id != user_step_id:
        raise HTTPException(status_code=404, detail="Document not found for this step")
    return document


@router.post(
    "/requirements/{requirement_id}",
    response_model=DocumentOut,
    status_code=status.HTTP_201_CREATED,
)
def upload_document(
    requirement_id: uuid.UUID,
    doc: DocumentUpload,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ...:
    """
    Upload a document for a requirement.
    The backend will resolve the user_step for the current user and requirement's step.
    """
    requirement = session.get(DocumentRequirement, requirement_id)
    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")
    # Find the current user's onboarding flow and user_step for this step
    from models.onboarding import UserOnboardingFlow, UserOnboardingStep

    user_flow = session.exec(
        select(UserOnboardingFlow).where(UserOnboardingFlow.user_id == current_user.id)
    ).first()
    if not user_flow:
        raise HTTPException(status_code=404, detail="User onboarding flow not found")
    user_step = session.exec(
        select(UserOnboardingStep).where(
            (UserOnboardingStep.user_flow_id == user_flow.id)
            & (UserOnboardingStep.step_id == requirement.step_id)
        )
    ).first()
    if not user_step:
        raise HTTPException(
            status_code=404, detail="User onboarding step not found for this requirement"
        )
    document = Document(
        user_step_id=user_step.id,  # type: ignore
        requirement_id=requirement_id,
        file_path=doc.file_path,
        original_filename=doc.original_filename,
        file_type=doc.file_type,
        file_size=doc.file_size,
        content_type=doc.content_type,
        uploaded_by_id=current_user.id,
        status="uploaded",
    )
    session.add(document)
    session.commit()
    session.refresh(document)
    return document


@router.get("/requirements/{requirement_id}", response_model=list[DocumentOut])
def list_documents_for_requirement(
    requirement_id: uuid.UUID,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ...:
    """List all documents for a given requirement (across all user steps)."""
    requirement = session.get(DocumentRequirement, requirement_id)
    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")
    return requirement.documents


@router.get("/{document_id}", response_model=DocumentOut)
def get_document_by_id(
    document_id: uuid.UUID,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ...:
    """Get document details by document id."""
    document = session.get(Document, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document
