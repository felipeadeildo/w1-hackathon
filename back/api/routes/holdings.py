from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from api.dependencies import get_current_user
from api.schemas.document import DocumentOut, DocumentRequirementOut
from api.schemas.holding import HoldingCreate, HoldingOut, HoldingStageOut
from core.database import get_session
from core.holding.holding_service import create_holding
from models.holding.core import Holding, HoldingStage
from models.holding.document import Document, DocumentRequirement
from models.user import User

router = APIRouter(tags=["holdings"])


@router.post("/", response_model=HoldingOut)
def create_holding_route(
    holding_in: HoldingCreate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> HoldingOut:
    holding = create_holding(
        session=session,
        name=holding_in.name,
        client_id=current_user.id,
        consultant_id=holding_in.consultant_id,
    )
    return HoldingOut.model_validate(holding)


@router.get("/", response_model=list[HoldingOut])
def list_holdings(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> list[HoldingOut]:
    holdings = list(session.exec(select(Holding).where(Holding.client_id == current_user.id)))
    return [HoldingOut.model_validate(h) for h in holdings]


@router.get("/{holding_id}", response_model=HoldingOut)
def get_holding(
    holding_id: str,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> HoldingOut:
    holding = session.get(Holding, UUID(holding_id))
    if not holding or holding.client_id != current_user.id:
        raise HTTPException(status_code=404, detail="Holding not found")
    return HoldingOut.model_validate(holding)


@router.get("/{holding_id}/stages", response_model=list[HoldingStageOut])
def list_holding_stages(
    holding_id: str,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> list[HoldingStageOut]:
    stages = list(
        session.exec(select(HoldingStage).where(HoldingStage.holding_id == UUID(holding_id)))
    )
    stages.sort(key=lambda s: s.order)
    return [HoldingStageOut.model_validate(s) for s in stages]


@router.get(
    "/{holding_id}/stages/{stage_id}/requirements", response_model=list[DocumentRequirementOut]
)
def list_stage_requirements(
    holding_id: str,
    stage_id: str,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> list[DocumentRequirementOut]:
    reqs = list(
        session.exec(
            select(DocumentRequirement).where(
                (DocumentRequirement.holding_id == UUID(holding_id))
                & (DocumentRequirement.stage_id == UUID(stage_id))
            )
        )
    )
    return [DocumentRequirementOut.model_validate(r) for r in reqs]


@router.get(
    "/{holding_id}/requirements/{requirement_id}/documents",
    response_model=list[DocumentOut],
)
def list_requirement_documents(
    holding_id: str,
    requirement_id: str,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> list[DocumentOut]:
    from uuid import UUID

    docs = list(
        session.exec(
            select(Document).where(
                (Document.holding_id == UUID(holding_id))
                & (Document.requirement_id == UUID(requirement_id))
            )
        )
    )
    return [DocumentOut.model_validate(d) for d in docs]
