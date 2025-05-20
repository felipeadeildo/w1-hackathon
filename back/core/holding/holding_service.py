import uuid
from datetime import datetime

from sqlmodel import Session

from models.holding.core import Holding, HoldingStage
from models.holding.document import DocumentRequirement
from models.holding.tracking import HoldingActivity

STAGES = [
    {
        "name": "personal_docs",
        "description": "Documentos Pessoais",
        "order": 1,
        "stage_type": "document",
    },
    {
        "name": "family_structure",
        "description": "Chat Estruturado",
        "order": 2,
        "stage_type": "chat",
    },
    {
        "name": "assets_docs",
        "description": "Documentos Comprobatórios",
        "order": 3,
        "stage_type": "document",
    },
]

PERSONAL_DOCS_REQUIREMENTS = [
    {"name": "RG", "description": "Documento de Identidade", "doc_type": "rg"},
    {"name": "CPF", "description": "Cadastro de Pessoa Física", "doc_type": "cpf"},
    {"name": "Declaração IR", "description": "Declaração de Imposto de Renda", "doc_type": "ir"},
]


def create_holding(
    session: Session, name: str, client_id: uuid.UUID, consultant_id: uuid.UUID | None = None
) -> Holding:
    holding = Holding(
        name=name,
        status="analysis",
        client_id=client_id,
        consultant_id=consultant_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    session.add(holding)
    session.flush()

    # Log activity
    activity = HoldingActivity(
        holding_id=holding.id,
        activity_type="creation",
        description=f"Holding criada: {name}",
        performed_by_id=client_id,
        performed_by_type="client",
    )
    session.add(activity)
    session.flush()

    # Create stages
    for stage in STAGES:
        status = "in_progress" if stage["order"] == 1 else "pending"
        start_date = datetime.utcnow() if stage["order"] == 1 else None
        holding_stage = HoldingStage(
            holding_id=holding.id,
            name=stage["name"],
            description=stage["description"],
            order=stage["order"],
            status=status,
            stage_type=stage["stage_type"],
            start_date=start_date,
        )
        session.add(holding_stage)
        session.flush()
        # Add requirements for stage 1
        if stage["order"] == 1:
            for req in PERSONAL_DOCS_REQUIREMENTS:
                dr = DocumentRequirement(
                    holding_id=holding.id,
                    stage_id=holding_stage.id,
                    name=req["name"],
                    description=req["description"],
                    doc_type=req["doc_type"],
                    is_required=True,
                    created_by_type="system",
                )
                session.add(dr)
    session.commit()
    return holding
