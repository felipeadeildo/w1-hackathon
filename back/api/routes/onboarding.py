import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from api.dependencies import get_current_user
from api.schemas.llm_chat import ChatStructuredData
from api.schemas.onboarding import (
    StepDataUpdate,
    StepStatusUpdate,
    UserOnboardingFlowRead,
    UserOnboardingStepRead,
)
from core.database import get_session
from core.user_crud import (
    check_onboarding_flow_completion,
    complete_onboarding_flow,
    get_user_onboarding_flow,
    get_user_onboarding_step,
    update_onboarding_step,
)
from models.document import DocumentRequirement
from models.onboarding import (
    OnboardingStep,
    OnboardingStepType,
    UserOnboardingFlow,
    UserOnboardingStep,
)
from models.user import User

router = APIRouter(tags=["onboarding"])


@router.get("/flow", response_model=UserOnboardingFlowRead)
async def get_current_onboarding_flow(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserOnboardingFlowRead:
    """Get the current user's onboarding flow and steps"""
    if current_user.is_consultant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consultants don't have onboarding flows",
        )

    user_flow = get_user_onboarding_flow(session, current_user.id)
    if not user_flow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active onboarding flow found for this user",
        )

    return user_flow  # type: ignore


@router.get("/step/{step_id}", response_model=UserOnboardingStepRead)
async def get_onboarding_step(
    step_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserOnboardingStepRead:
    """Get details for a specific onboarding step"""
    user_flow = get_user_onboarding_flow(session, current_user.id)
    if not user_flow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active onboarding flow found for this user",
        )

    user_step = get_user_onboarding_step(session, step_id, user_flow.id)  # type: ignore
    if not user_step:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Step not found in user's onboarding flow"
        )

    return user_step  # type: ignore


@router.patch("/step/{user_step_id}/status", response_model=UserOnboardingStepRead)
async def update_step_status(
    user_step_id: int,
    status_update: StepStatusUpdate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserOnboardingStepRead:
    """Mark a step as completed or not completed"""
    user_step = session.get(UserOnboardingStep, user_step_id)
    if not user_step:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Step not found")

    user_flow = session.get(UserOnboardingFlow, user_step.user_flow_id)
    if not user_flow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User flow not found for this step"
        )

    if user_flow.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this step"
        )

    # Update the step status
    updated_step = update_onboarding_step(
        session=session, user_step_id=user_step_id, is_completed=status_update.is_completed
    )

    # If step is completed and is of type LLM_CHAT, create document requirements for the
    # DATA_VERIFICATION step
    if status_update.is_completed and user_step.step.type == OnboardingStepType.LLM_CHAT:
        await create_document_requirements_for_verification_step(
            session, user_step, current_user.id
        )

    # Check if the entire flow is completed
    is_completed = check_onboarding_flow_completion(session, user_flow.id)  # type: ignore
    if status_update.is_completed and is_completed:
        complete_onboarding_flow(session, user_flow.id)  # type: ignore

    return updated_step  # type: ignore


@router.patch("/step/{user_step_id}/data", response_model=UserOnboardingStepRead)
async def update_step_data(
    user_step_id: int,
    step_data: StepDataUpdate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserOnboardingStepRead:
    """Update data for a specific onboarding step"""
    # First verify the step belongs to this user
    user_step = session.get(UserOnboardingStep, user_step_id)
    if not user_step:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Step not found")

    user_flow = session.get(UserOnboardingFlow, user_step.user_flow_id)
    if not user_flow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User flow not found for this step"
        )

    if user_flow.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this step"
        )

    updated_step = update_onboarding_step(
        session=session, user_step_id=user_step_id, data=step_data.data
    )

    # If the step is of type LLM_CHAT and is completed, update document requirements for the
    # DATA_VERIFICATION step
    if user_step.step.type == OnboardingStepType.LLM_CHAT and user_step.is_completed:
        await create_document_requirements_for_verification_step(
            session, updated_step, current_user.id
        )

    return updated_step  # type: ignore


async def create_document_requirements_for_verification_step(
    session: Session, llm_step: UserOnboardingStep, user_id: uuid.UUID
) -> None:
    """Create document requirements for the DATA_VERIFICATION step based on structured data from LLM
    chat.
    """

    if not llm_step.data:
        return

    # Find the DATA_VERIFICATION step in the same flow
    stmt = (
        select(UserOnboardingStep)
        .join(OnboardingStep)
        .where(
            UserOnboardingStep.user_flow_id == llm_step.user_flow_id,
            OnboardingStep.type == OnboardingStepType.DATA_VERIFICATION,
        )
    )

    verification_step = session.exec(stmt).first()

    if not verification_step:
        # No verification step found in this flow
        return

    # Parse the structured data
    try:
        structured_data = ChatStructuredData.model_validate(llm_step.data)
    except Exception:
        # If we can't parse the data, we can't create requirements
        return

    # Create a list to track requirements we've already created
    existing_requirements = set()

    # Get existing requirements for the verification step
    for req in session.exec(
        select(DocumentRequirement).where(DocumentRequirement.step_id == verification_step.step_id)
    ).all():
        existing_requirements.add(req.doc_type)

    new_requirements = []

    # Process imóveis
    for i, imovel in enumerate(structured_data.imoveis):
        doc_type = f"imovel_{i + 1}_posse"
        if doc_type not in existing_requirements:
            new_requirements.append(
                DocumentRequirement(
                    step_id=verification_step.step_id,
                    name=f"Comprovante de posse ou propriedade: {imovel.tipo}",
                    description=f"Documento que comprove a posse ou propriedade do imóvel {imovel.tipo} localizado em {imovel.localizacao}",  # noqa
                    doc_type=doc_type,
                    is_required=True,
                    created_by_user_id=user_id,
                    created_by_type="system",
                    priority=1,
                    reason="Necessário para validar a propriedade do imóvel na estruturação patrimonial",  # noqa
                )
            )
            existing_requirements.add(doc_type)

        # If it's a rental property, require rental contract
        if imovel.status and "alug" in imovel.status.lower():
            doc_type = f"imovel_{i + 1}_contrato_aluguel"
            if doc_type not in existing_requirements:
                new_requirements.append(
                    DocumentRequirement(
                        step_id=verification_step.step_id,
                        name=f"Contrato de aluguel: {imovel.tipo}",
                        description=f"Contrato de aluguel do imóvel {imovel.tipo} localizado em {imovel.localizacao}",  # noqa
                        doc_type=doc_type,
                        is_required=True,
                        created_by_user_id=user_id,
                        created_by_type="system",
                        priority=2,
                        reason="Necessário para validar a renda de aluguel na estruturação patrimonial",  # noqa
                    )
                )
                existing_requirements.add(doc_type)

    # Process participações societárias
    for i, participacao in enumerate(structured_data.participacoes):
        doc_type = f"participacao_{i + 1}_comprovante"
        if doc_type not in existing_requirements:
            new_requirements.append(
                DocumentRequirement(
                    step_id=verification_step.step_id,
                    name=f"Comprovante de participação societária: {participacao.empresa}",
                    description=f"Documento que comprove sua participação de {participacao.participacao} na empresa {participacao.empresa}",  # noqa
                    doc_type=doc_type,
                    is_required=True,
                    created_by_user_id=user_id,
                    created_by_type="system",
                    priority=1,
                    reason="Necessário para validar participações societárias na estruturação patrimonial",  # noqa
                )
            )
            existing_requirements.add(doc_type)

        # Require latest financial statements if available
        doc_type = f"participacao_{i + 1}_balanco"
        if doc_type not in existing_requirements:
            new_requirements.append(
                DocumentRequirement(
                    step_id=verification_step.step_id,
                    name=f"Balanço financeiro: {participacao.empresa}",
                    description=f"Balanço financeiro mais recente da empresa {participacao.empresa}",  # noqa
                    doc_type=doc_type,
                    is_required=False,
                    created_by_user_id=user_id,
                    created_by_type="system",
                    priority=2,
                    reason="Auxiliar na avaliação financeira da empresa para estruturação patrimonial",  # noqa
                )
            )
            existing_requirements.add(doc_type)

    # Process family structure
    if structured_data.estrutura_familiar:
        # Certidão de casamento if married
        if (
            structured_data.estrutura_familiar.estado_civil
            and "casad" in structured_data.estrutura_familiar.estado_civil.lower()
        ):
            doc_type = "certidao_casamento"
            if doc_type not in existing_requirements:
                new_requirements.append(
                    DocumentRequirement(
                        step_id=verification_step.step_id,
                        name="Certidão de casamento",
                        description="Certidão de casamento para comprovar o regime de bens",
                        doc_type=doc_type,
                        is_required=True,
                        created_by_user_id=user_id,
                        created_by_type="system",
                        priority=1,
                        reason="Necessário para validar o regime de bens do casamento na estruturação patrimonial",  # noqa
                    )
                )
                existing_requirements.add(doc_type)

        # Birth certificates for children
        for i, filho in enumerate(structured_data.estrutura_familiar.filhos):
            doc_type = f"certidao_nascimento_filho_{i + 1}"
            if doc_type not in existing_requirements:
                new_requirements.append(
                    DocumentRequirement(
                        step_id=verification_step.step_id,
                        name=f"Certidão de nascimento: {filho.nome}",
                        description=f"Certidão de nascimento de {filho.nome}",
                        doc_type=doc_type,
                        is_required=True,
                        created_by_user_id=user_id,
                        created_by_type="system",
                        priority=2,
                        reason="Necessário para validar a filiação na estruturação patrimonial",
                    )
                )
                existing_requirements.add(doc_type)

    # Process investments
    for i, investimento in enumerate(structured_data.investimentos):
        doc_type = f"investimento_{i + 1}_comprovante"
        if doc_type not in existing_requirements:
            new_requirements.append(
                DocumentRequirement(
                    step_id=verification_step.step_id,
                    name=f"Comprovante de investimento: {investimento.tipo}",
                    description=f"Extrato ou comprovante do investimento em {investimento.tipo}"
                    + (
                        f" na instituição {investimento.instituicao}"
                        if investimento.instituicao
                        else ""
                    ),
                    doc_type=doc_type,
                    is_required=True,
                    created_by_user_id=user_id,
                    created_by_type="system",
                    priority=2,
                    reason="Necessário para validar investimentos na estruturação patrimonial",
                )
            )
            existing_requirements.add(doc_type)

    # Process other assets
    for i, ativo in enumerate(structured_data.outros_ativos):
        doc_type = f"outro_ativo_{i + 1}_comprovante"
        if doc_type not in existing_requirements:
            new_requirements.append(
                DocumentRequirement(
                    step_id=verification_step.step_id,
                    name=f"Comprovante de propriedade: {ativo.tipo}",
                    description=f"Documento que comprove a propriedade de {ativo.descricao}",
                    doc_type=doc_type,
                    is_required=True,
                    created_by_user_id=user_id,
                    created_by_type="system",
                    priority=2,
                    reason="Necessário para validar a propriedade do bem na estruturação patrimonial",  # noqa
                )
            )
            existing_requirements.add(doc_type)

    basic_docs = [
        ("rg", "RG", "Documento de identidade (RG)", "Necessário para validação da identidade"),
        ("cpf", "CPF", "Comprovante de CPF", "Necessário para validação fiscal"),
        (
            "comprovante_residencia",
            "Comprovante de Residência",
            "Comprovante de residência recente (últimos 3 meses)",
            "Necessário para validação de endereço",
        ),
    ]

    for doc_type, name, description, reason in basic_docs:
        if doc_type not in existing_requirements:
            new_requirements.append(
                DocumentRequirement(
                    step_id=verification_step.step_id,
                    name=name,
                    description=description,
                    doc_type=doc_type,
                    is_required=True,
                    created_by_user_id=user_id,
                    created_by_type="system",
                    priority=1,
                    reason=reason,
                )
            )
            existing_requirements.add(doc_type)

    for req in new_requirements:
        session.add(req)

    session.commit()
