from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from api.dependencies import get_current_user
from api.schemas.document import DocumentRequirementOut
from api.schemas.holding import HoldingCreate, HoldingOut, HoldingStageOut
from core.database import get_session
from core.holding.holding_service import create_holding
from models.holding.core import HoldingStage
from models.holding.document import DocumentRequirement
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
