from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from core.database import get_session
from core.security import verify_token
from models.onboarding import (
    OnboardingStep,
    OnboardingStepType,
    UserOnboardingFlow,
    UserOnboardingStep,
)
from models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], session: Annotated[Session, Depends(get_session)]
) -> User:
    """Obtém o usuário atual a partir do token JWT"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )

    user_id = verify_token(token)
    if not user_id:
        raise credentials_exception

    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    if user is None:
        raise credentials_exception

    return user


def get_current_consultant(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    """Verifica se o usuário atual é um consultor"""
    if not current_user.is_consultant:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="O usuário não tem permissão para acessar este recurso",
        )
    return current_user


async def get_user_step_for_llm_chat(
    step_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserOnboardingStep:
    """
    Valida e retorna o UserOnboardingStep para chat LLM.

    Verifica:
    - Se o step existe e pertence ao usuário
    - Se o step é do tipo LLM_CHAT
    - Se o usuário tem permissão para acessar
    """

    # Busca o UserOnboardingStep
    stmt = (
        select(UserOnboardingStep)
        .join(UserOnboardingFlow)
        .where(UserOnboardingStep.step_id == step_id, UserOnboardingFlow.user_id == current_user.id)
    )

    user_step = session.exec(stmt).first()

    if not user_step:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Step não encontrado ou você não tem acesso a ele",
        )

    # Verifica se é um step de LLM Chat
    if user_step.step.type != OnboardingStepType.LLM_CHAT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Este step não é do tipo LLM Chat"
        )

    # Verifica se o usuário é consultor (consultores não fazem onboarding)
    if current_user.is_consultant:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Consultores não podem acessar o chat LLM de onboarding",
        )

    # Verifica se o flow está ativo
    if user_step.user_flow.is_completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="O fluxo de onboarding já foi concluído"
        )

    return user_step


async def validate_step_access(
    user_step: Annotated[UserOnboardingStep, Depends(get_user_step_for_llm_chat)],
    session: Annotated[Session, Depends(get_session)],
) -> UserOnboardingStep:
    """
    Validação adicional de acesso ao step.

    Pode ser usado para verificar:
    - Se steps anteriores foram concluídos
    - Se há dependências não satisfeitas
    - Regras de negócio específicas
    """

    # Verifica se steps anteriores obrigatórios foram concluídos
    previous_steps = session.exec(
        select(UserOnboardingStep)
        .join(OnboardingStep)
        .where(
            UserOnboardingStep.user_flow_id == user_step.user_flow_id,
            OnboardingStep.order < user_step.step.order,
        )
    ).all()

    # Verifica se todos os steps anteriores obrigatórios foram concluídos
    for prev_step in previous_steps:
        # Aqui você pode definir quais steps são obrigatórios
        # Por exemplo, se for um step de dados pessoais, pode ser obrigatório
        if prev_step.step.type == OnboardingStepType.PERSONAL_DATA and not prev_step.is_completed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"O step '{prev_step.step.name}' deve ser concluído antes deste chat",
            )

    return user_step


async def get_validated_user_step(
    step_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserOnboardingStep:
    """
    Dependency principal que combina todas as validações.
    Use esta nos endpoints que precisam de acesso validado ao step LLM.
    """

    user_step = await get_user_step_for_llm_chat(step_id, session, current_user)
    validated_step = await validate_step_access(user_step, session)

    return validated_step


# === DEPENDENCIES AUXILIARES ===


async def get_user_onboarding_flow_by_step(
    user_step: Annotated[UserOnboardingStep, Depends(get_validated_user_step)],
) -> UserOnboardingFlow:
    """Retorna o UserOnboardingFlow do step validado"""
    return user_step.user_flow


async def check_llm_chat_enabled(
    session: Annotated[Session, Depends(get_session)],
) -> bool:
    """
    Verifica se o chat LLM está habilitado globalmente.
    Pode ser usado para manutenção ou desabilitar temporariamente.
    """

    # Aqui você pode implementar lógica para verificar:
    # - Configurações globais
    # - Status de manutenção
    # - Limites de uso
    # - etc.

    # Por enquanto, sempre habilitado
    return True


async def validate_llm_chat_enabled(
    is_enabled: Annotated[bool, Depends(check_llm_chat_enabled)],
) -> None:
    """Valida se o chat LLM está habilitado"""

    if not is_enabled:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="O chat LLM está temporariamente indisponível",
        )


# === DEPENDENCY PARA RATE LIMITING ===


class RateLimiter:
    """Simple rate limiter para chat LLM"""

    def __init__(self) -> None:
        self.user_requests = {}  # user_id -> list of timestamps
        self.max_requests = 10  # máximo de requests por minuto
        self.window_seconds = 60

    def is_allowed(self, user_id: str) -> bool:
        """Verifica se o usuário pode fazer mais requests"""
        import time

        now = time.time()

        if user_id not in self.user_requests:
            self.user_requests[user_id] = []

        # Remove requests antigos
        self.user_requests[user_id] = [
            req_time
            for req_time in self.user_requests[user_id]
            if now - req_time < self.window_seconds
        ]

        # Verifica limite
        if len(self.user_requests[user_id]) >= self.max_requests:
            return False

        # Adiciona request atual
        self.user_requests[user_id].append(now)
        return True


# Instância global do rate limiter
rate_limiter = RateLimiter()


async def check_rate_limit(
    current_user: Annotated[User, Depends(get_current_user)],
) -> None:
    """Verifica rate limit para o usuário"""

    if not rate_limiter.is_allowed(str(current_user.id)):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Muitas mensagens enviadas. Tente novamente em alguns instantes.",
        )
