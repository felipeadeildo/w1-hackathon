import uuid
from datetime import UTC, datetime

from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from core.security import get_password_hash, verify_password
from models.onboarding import (
    OnboardingFlow,
    OnboardingStep,
    OnboardingStepType,
    UserOnboardingFlow,
    UserOnboardingStep,
)
from models.user import User, UserProfile


def get_user_by_email(session: Session, email: str) -> User | None:
    """Busca um usuário pelo email"""
    query = select(User).where(User.email == email)
    result = session.exec(query)
    return result.one_or_none()


def create_default_onboarding_flow(session: Session) -> OnboardingFlow:
    """Creates a default onboarding flow with predefined steps."""
    flow = OnboardingFlow(
        name="Cadastro de Usuário",
        description="Processo completo de cadastro e coleta de informações",
    )
    session.add(flow)
    session.flush()

    if not flow.id:
        raise Exception("Failed to create onboarding flow")

    steps = [
        OnboardingStep(
            name="Dados Pessoais",
            description="Preencher informações pessoais e fazer upload de documentos de identificação",  # noqa: E501
            order=1,
            type=OnboardingStepType.PERSONAL_DATA,
            flow_id=flow.id,
        ),
        OnboardingStep(
            name="Entrevista Assistida",
            description="Conversa com assistente virtual para estruturar suas informações familiares e patrimoniais",  # noqa: E501
            order=2,
            type=OnboardingStepType.LLM_CHAT,
            flow_id=flow.id,
        ),
        OnboardingStep(
            name="Verificação Documental",
            description="Envio de documentos para comprovar as informações fornecidas",
            order=3,
            type=OnboardingStepType.DATA_VERIFICATION,
            flow_id=flow.id,
        ),
    ]

    session.add_all(steps)
    session.flush()
    return flow


def assign_onboarding_flow_to_user(
    session: Session, user: User, flow: OnboardingFlow
) -> UserOnboardingFlow:
    """Assigns an onboarding flow to a user."""
    if not flow.id:
        raise Exception("Failed to assign onboarding flow to user")

    user_flow = UserOnboardingFlow(
        user_id=user.id, flow_id=flow.id, is_completed=False, started_at=datetime.now(UTC)
    )
    session.add(user_flow)
    session.flush()  # Ensure user_flow.id is available

    if not user_flow.id:
        raise Exception("Failed to assign onboarding flow to user")

    # Create user step entries for each step in the flow
    user_steps = [
        UserOnboardingStep(user_flow_id=user_flow.id, step_id=step.id, is_completed=False)  # type: ignore [step.id is fucking defined.]
        for step in flow.steps
    ]

    session.add_all(user_steps)
    session.flush()
    return user_flow


async def create_user(
    session: Session,
    email: str,
    password: str,
    name: str,
    is_consultant: bool = False,
) -> User:
    """Cria um novo usuário com perfil e inicia processo de onboarding"""
    user = User(
        email=email,
        hashed_password=get_password_hash(password),
        is_consultant=is_consultant,
    )
    session.add(user)
    session.flush()

    profile = UserProfile(user_id=user.id, full_name=name)
    session.add(profile)

    if is_consultant:
        session.commit()
        session.refresh(user)
        return user

    query = select(OnboardingFlow).where(OnboardingFlow.name == "Cadastro de Usuário")
    result = session.exec(query)
    flow = result.first()

    if not flow:
        flow = create_default_onboarding_flow(session)

    assign_onboarding_flow_to_user(session, user, flow)

    session.commit()
    session.refresh(user)
    return user


def authenticate_user(session: Session, email: str, password: str) -> User | None:
    """Autentica um usuário pelo email e senha"""
    user = get_user_by_email(session, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def get_user_onboarding_flow(session: Session, user_id: uuid.UUID) -> UserOnboardingFlow | None:
    """Get the active onboarding flow for a user"""
    query = (
        select(UserOnboardingFlow)
        .where((UserOnboardingFlow.user_id == user_id) & (not UserOnboardingFlow.is_completed))
        .options(
            selectinload(UserOnboardingFlow.flow),  # type: ignore
            selectinload(UserOnboardingFlow.user_steps).selectinload(UserOnboardingStep.step),  # type: ignore
        )
    )
    return session.exec(query).first()


def get_user_onboarding_step(
    session: Session, step_id: int, user_flow_id: int
) -> UserOnboardingStep | None:
    """Get specific onboarding step for a user"""
    query = select(UserOnboardingStep).where(
        (UserOnboardingStep.step_id == step_id) & (UserOnboardingStep.user_flow_id == user_flow_id)
    )
    return session.exec(query).one_or_none()


def update_onboarding_step(
    session: Session, user_step_id: int, is_completed: bool | None = None, data: dict | None = None
) -> UserOnboardingStep:
    """Update a user's onboarding step with progress data"""
    user_step = session.get(UserOnboardingStep, user_step_id)
    if not user_step:
        raise ValueError(f"User step with ID {user_step_id} not found")

    if is_completed is not None:
        user_step.is_completed = is_completed
        if is_completed and not user_step.completed_at:
            user_step.completed_at = datetime.now(UTC)
        if not user_step.started_at:
            user_step.started_at = datetime.now(UTC)

    if data is not None:
        existing_data = user_step.data or {}
        existing_data.update(data)
        user_step.data = existing_data

    session.add(user_step)
    session.commit()
    session.refresh(user_step)
    return user_step


def check_onboarding_flow_completion(session: Session, flow_id: int) -> bool:
    """Check if all steps in an onboarding flow are completed"""
    query = select(UserOnboardingStep).where(
        (UserOnboardingStep.user_flow_id == flow_id) & (not UserOnboardingStep.is_completed)
    )
    incomplete_steps = session.exec(query).all()

    return len(incomplete_steps) == 0


def complete_onboarding_flow(session: Session, flow_id: int) -> UserOnboardingFlow:
    """Mark an onboarding flow as completed"""
    user_flow = session.get(UserOnboardingFlow, flow_id)
    if not user_flow:
        raise ValueError(f"User flow with ID {flow_id} not found")

    user_flow.is_completed = True
    user_flow.completed_at = datetime.now(UTC)

    session.add(user_flow)
    session.commit()
    session.refresh(user_flow)
    return user_flow
